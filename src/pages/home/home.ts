import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';

import {AlertService} from '../../providers/alert';
import {PortalService} from '../../providers/portal';

@Component({
	selector: 'mymicds-home',
	templateUrl: './home.html',
	// styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {

	// Possibly show announcement (leave announcement as empty string if no announcement!)
	announcement: string = 'Hey you! Yeah you! We need your help generating ideas for the WWT Hackathon. <a class="alert-link" href="https://goo.gl/forms/pLHZw53kXGp4Tw993" target="_blank">Fill out this quick form and tell us about any problems you see in the community!</a>';
	dismissAnnouncement = false;
	showAnnouncement = true;

	// Options for slide navigation
	slideOptions = {
		direction: 'vertical'
	};

	timer: any;
	current: any = new Date();
	scheduleDate: any = new Date();
	schedule: any;

	constructor(public navCtrl: NavController, private alertService: AlertService, private portalService: PortalService) { }

	ngOnInit() {
		// Get schedule from date object and assign to schedule variable
		this.portalService.getSchedule({
			year : this.scheduleDate.getFullYear(),
			month: this.scheduleDate.getMonth() + 1,
			day  : this.scheduleDate.getDate()
		}).subscribe(
			schedule => {
				this.schedule = schedule;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Schedule Error!', error);
			}
		);

		// Start timer
		this.timer = setInterval(() => {
			this.current = new Date();
		}, 100);
	}

	ngOnDestroy() {
		// Stop timer
		clearInterval(this.timer);
	}

	dismissAlert() {
		// How long CSS delete animation is in milliseconds
		let animationTime = 200;
		this.dismissAnnouncement = true;

		// Wait until animation is done before actually removing from array
		setTimeout(() => {
			this.showAnnouncement = false;
		}, animationTime - 5);
	}

}
