import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

import { GlobalVars } from '../global';
import { Prebuilts } from '../prebuilts';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public prebuilts: Prebuilts, public global: GlobalVars) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatternSelectModalPage');
  }

  selectPrebuilt(prebuiltName: any){
  	switch(prebuiltName){
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
  }

  closeModal(){
  	this.viewCtrl.dismiss("");
  }

}
