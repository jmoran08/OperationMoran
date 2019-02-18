import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ModalController } from 'ionic-angular';
import { GlobalVars } from '../global';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	prebuiltChosen: any;
	prebuiltSelectionMade: Boolean;
	customPattern: any;
  constructor(public navCtrl: NavController, public modalCtrl : ModalController, public global: GlobalVars) {
  	this.prebuiltChosen = "";
  	this.customPattern = "";
  	this.prebuiltSelectionMade = false;
  }

  random(){
  	this.prebuiltChosen = "";
  	this.prebuiltSelectionMade = false;
  	//will eventually replace this with a random instruction generator call
  	this.global.setInstructions("");
  }

  openPrebuiltModal(){
	let chooseModal = this.modalCtrl.create('PatternSelectModalPage');
	  chooseModal.onDidDismiss(data => {
	  	this.prebuiltChosen = data;
	     if(data != ""){
	     	this.prebuiltSelectionMade = true;
	     }
		});
	chooseModal.present();
  	/*var modalPage = this.modalCtrl.create('PatternSelectModalPage');
    modalPage.present();*/
  }

  openCustomModal(){
  	let chooseModal = this.modalCtrl.create('CustomPatternModalPage');
	  chooseModal.onDidDismiss(data => {
	  	this.customPattern = data;
	     if(data != ""){
	     	this.prebuiltSelectionMade = true;
	     	this.prebuiltChosen = "";
		  	this.prebuiltSelectionMade = false;
	     }
		});
	chooseModal.present();
  }

  openCustomSelectModal(){
  	let chooseModal = this.modalCtrl.create('CustomPatternSelectModalPage');
	  chooseModal.onDidDismiss(data => {
	  	this.customPattern = data;
	     if(data != ""){
	     	this.prebuiltSelectionMade = true;
	     	this.prebuiltChosen = "";
		  	this.prebuiltSelectionMade = false;
	     }
		});
	chooseModal.present();
  }

  removePrebuiltSelection(){
    this.global.setInstructions("");
  	this.prebuiltChosen = "";
  	this.prebuiltSelectionMade = false;
  }

}
