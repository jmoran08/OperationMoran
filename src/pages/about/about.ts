import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GlobalVars } from '../global';
import { Prebuilts } from '../prebuilts';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public prebuilts: Prebuilts, public global: GlobalVars) {
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

}
