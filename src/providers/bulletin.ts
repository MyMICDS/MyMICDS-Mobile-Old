import * as environment from '../common/config';

import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { xhrHeaders, handleError } from '../common/http-helpers';
import { Observable } from 'rxjs/Observable';
import '../common/rxjs-operators';

@Injectable()
export class BulletinService {
	constructor(private http: Http) { }

	listBulletins() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/daily-bulletin/list', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return {
					baseURL: data.baseURL,
					bulletins: data.bulletins
				};
			})
			.catch(handleError);
	}
}
