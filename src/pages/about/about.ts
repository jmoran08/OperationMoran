import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ModalController } from 'ionic-angular';
import { GlobalVars } from '../global';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	pattern: any;
	prebuiltChosen: any;
	selectionMade: Boolean;

  constructor(public navCtrl: NavController, public modalCtrl : ModalController, public global: GlobalVars) {
  	this.prebuiltChosen = "";
  	this.selectionMade = false;
  }

  patternSelected(){
  	console.log(this.pattern);
  	if(this.pattern === "prebuilt"){
  		this.openModal();
  	}
  }

  openModal(){
	let chooseModal = this.modalCtrl.create('PatternSelectModalPage');
	  chooseModal.onDidDismiss(data => {
	  	this.prebuiltChosen = data;
	     if(data != ""){
	     	this.selectionMade = true;
	     }
	     else{
	     	this.pattern = "";
	     }
		});
	chooseModal.present();
  	/*var modalPage = this.modalCtrl.create('PatternSelectModalPage');
    modalPage.present();*/
  }

  removePrebuiltSelection(){
    this.global.setInstructions({});
  	this.prebuiltChosen = "";
  	this.selectionMade = false;
  	this.pattern = "";
  }

}
