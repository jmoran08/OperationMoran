import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PrebuiltPatternDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prebuilt-pattern-details',
  templateUrl: 'prebuilt-pattern-details.html',
})
export class PrebuiltPatternDetailsPage {

	pattern: any;
	details: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.pattern = this.navParams.get('detailsOf');
  	if(this.pattern === "basic"){
  		this.details = "basic fielding details";
  	}
  	else{
  		this.details = "prebuilt1 details";
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrebuiltPatternDetailsPage');
  }

}
