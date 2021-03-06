import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { contains } from '../../../common/utils';

import { AlertService } from '../../../providers/alert';
import { PortalService } from '../../../providers/portal';

import { Observable } from 'rxjs/Observable';
import '../../../common/rxjs-operators';


@Component({
	selector: 'mymicds-schedule',
	templateUrl: './schedule.html',
	// styleUrls: ['./schedule.scss']
})
export class Schedule implements OnInit {

	@Input()
	set currentSchedule(value) {
		this._currentSchedule = value;
		this.viewSchedule = value;
	}

	get currentSchedule() {
		return this._currentSchedule;
	}

	private _currentSchedule: any = null;
	current = moment();

	viewSchedule: any = null;
	scheduleDate = moment();

	// Observable navigation
	click$: Observable<{}>;
	clickSub: any;
	previousCreated = [];
	currentCreated = [];
	nextCreated = [];

	constructor(private alertService: AlertService, private portalService: PortalService) { }

	ngOnInit() {
		this.getSchedule(this.scheduleDate);
		this.click$ = Observable.empty();
	}

	previousDay(event) {
		this.scheduleDate.subtract(1, 'day');
		if (!contains(this.previousCreated, event.target)) {
			let o = Observable.fromEvent(event.target, 'click');
			this.click$ = Observable.merge(this.click$, o);
			this.previousCreated.push(event.target);
			this.getSchedule(this.scheduleDate);
			this.clickSub = this.click$
				.debounceTime(1000)
				.subscribe(
					() => {
						this.getSchedule(this.scheduleDate);
					}
				);
		}
	}

	currentDay(event) {
		this.scheduleDate = moment();
		if (!contains(this.currentCreated, event.target)) {
			let o = Observable.fromEvent(event.target, 'click');
			this.click$ = Observable.merge(this.click$, o);
			this.currentCreated.push(event.target);
			this.getSchedule(this.scheduleDate);
			this.clickSub = this.click$
				.debounceTime(1000)
				.subscribe(
					() => {
						this.getSchedule(this.scheduleDate);
					}
				);
		}
	}

	nextDay(event) {
		this.scheduleDate.add(1, 'day');
		if (!contains(this.nextCreated, event.target)) {
			let o = Observable.fromEvent(event.target, 'click');
			this.click$ = Observable.merge(this.click$, o);
			this.nextCreated.push(event.target);
			this.getSchedule(this.scheduleDate);
			this.clickSub = this.click$
				.debounceTime(1000)
				.subscribe(
					() => {
						this.getSchedule(this.scheduleDate);
					}
				);
		}
	}

	getSchedule(date: any) {
		// First check if date is current date
		if (this.current.isSame(date, 'day')) {
			this.viewSchedule = this._currentSchedule;
			return;
		}

		this.viewSchedule = null;

		this.portalService.getSchedule({
			year : this.scheduleDate.year(),
			month: this.scheduleDate.month() + 1,
			day  : this.scheduleDate.date()
		}).subscribe(
			schedule => {
				this.viewSchedule = schedule;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Schedule Error!', error);
			}
		);
	}

}
