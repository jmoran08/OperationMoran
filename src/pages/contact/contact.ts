import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

	fieldType: any;
	skillLevel: any;
  constructor(public navCtrl: NavController) {
  	this.fieldType = "";
  	this.skillLevel = "";
  }

  fieldTypeSelected(fieldChosen){
  	this.fieldType = fieldChosen;
  }

  skillLevelSelected(skillLevelSelected){
  	this.skillLevel = skillLevelSelected;
  }

}
