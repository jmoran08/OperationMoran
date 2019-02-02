import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as $ from "jquery";

/**
 * Generated class for the PlayTypeSelectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-play-type-selection',
  templateUrl: 'play-type-selection.html',
})
export class PlayTypeSelectionPage {
	playType: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayTypeSelectionPage');
  }

  selectAndClose(){
  	this.viewCtrl.dismiss(this.playType);

  }

}
