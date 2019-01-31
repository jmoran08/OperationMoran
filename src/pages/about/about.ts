import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ModalController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	pattern: any;

  constructor(public navCtrl: NavController, public modalCtrl : ModalController) {
  }

  patternSelected(){
  	console.log(this.pattern);
  	if(this.pattern === "prebuilt"){
  		this.openModal();
  	}
  }

  openModal(){
  	var modalPage = this.modalCtrl.create('PatternSelectModalPage');
    modalPage.present();
  }

}
