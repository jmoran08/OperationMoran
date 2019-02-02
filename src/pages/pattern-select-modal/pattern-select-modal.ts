import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

import { GlobalVars } from '../global';
import { Prebuilts } from '../prebuilts';
import { PopoverController } from 'ionic-angular';


/**
 * Generated class for the PatternSelectModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pattern-select-modal',
  templateUrl: 'pattern-select-modal.html',
})
export class PatternSelectModalPage {
	chosenPrebuilt: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public prebuilts: Prebuilts, public global: GlobalVars, public popoverCtrl: PopoverController) {
  	this.chosenPrebuilt = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatternSelectModalPage');
  }

  selectPrebuilt(prebuiltName: any){
  this.chosenPrebuilt = prebuiltName;
  	
  }

  closeModal(){
  	this.viewCtrl.dismiss("");
  }

  confirmChoice(){
  	switch(this.chosenPrebuilt){
  		case "prebuilt1":
  			this.global.setInstructions(this.prebuilts.prebuilt1);
  			break;
  		case "basicFielding":
  			this.global.setInstructions(this.prebuilts.basicFielding);
  			break;
  		default:
  			this.global.setInstructions(this.prebuilts.prebuilt2);
  			break;
  	}
  		this.viewCtrl.dismiss(this.chosenPrebuilt);

  }

  displayDetails(pattern: any, myEvent: any) {
    const popover = this.popoverCtrl.create('PrebuiltPatternDetailsPage', {detailsOf:pattern});
    popover.present({
    	ev: myEvent
    });
  }

}
