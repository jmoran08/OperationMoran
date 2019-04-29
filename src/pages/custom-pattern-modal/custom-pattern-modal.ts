import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { ViewController, PopoverController } from 'ionic-angular';
import { GlobalVars } from '../global'

import * as $ from "jquery";

/**
 * Generated class for the CustomPatternModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-custom-pattern-modal',
  templateUrl: 'custom-pattern-modal.html',
})
export class CustomPatternModalPage {

	previousPosition: any;
	previousRow: any;
	play: any;
	instructions: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public popoverCtrl: PopoverController, public global: GlobalVars) {
  	this.instructions = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomPatternModalPage');
    var $src = $('#field-grid-source');
    var $wrap = $('<div id="field-grid-overlay"></div>');
    var $gsize = 20;

    var $cols = Math.ceil($src.find('img').innerWidth() / $gsize);
    var $rows = Math.ceil($src.find('img').innerHeight() / $gsize);

    // create overlay
    var $tbl = $('<table></table>');
    $tbl.addClass('positionTable');
    for (var y = 1; y <= $rows; y++) {
        var $tr = $('<tr></tr>');
        $tr.addClass('row' + (y-1));
        for (var x = 1; x <= $cols; x++) {
            var $td = $('<td></td>');
            $td.css('width', $gsize+'px').css('height', $gsize+'px');
            $td.addClass('unselected');
            $td.addClass('col' + (x-1));
            $td.addClass('arduinoMap' + (y-1) + (x-1));
            $tr.append($td);
        }
        $tbl.append($tr);
    }
    $src.css('width', $cols*$gsize+'px').css('height', $rows*$gsize+'px')

    // attach overlay
    $wrap.append($tbl);
    $src.after($wrap);
    $('#field-grid-overlay td').click((e) => {
    	if(this.previousPosition){
    		this.previousPosition.removeClass('selected');
    		this.previousPosition.addClass('unselected');
    	}
    	$(e.currentTarget).toggleClass('selected').toggleClass('unselected');
    	this.previousPosition = $(e.currentTarget);
    	this.previousRow = $(e.currentTarget).parent();
    	this.positionSelected();
    });
  }

  closeModal(){
  	this.viewCtrl.dismiss("");
  }

  setInstructionsAndClose(){
  	//this.global.setInstructions(this.instructions);
  	this.viewCtrl.dismiss(this.instructions);
  }

  positionSelected(){
  	const popover = this.popoverCtrl.create('PlayTypeSelectionPage');
    popover.present();
    popover.onDidDismiss(data => {
    	if(data != ""){
			this.play = data;
			this.addInstruction();
    	}
	});
  }

  addInstruction(){
    //find matching angles & PSI
    var arduinoMap = this.previousPosition.attr('class').split(' ')[1];
    arduinoMap = arduinoMap.substring(10, arduinoMap.length);
    console.log("arduino map id: " + arduinoMap);
  	this.instructions.push(
		{
			row: this.previousRow.index(),
			col: this.previousPosition.index(),
			type: this.play,
      mapId: arduinoMap
		});
  	this.previousPosition.removeClass('selected');
  	this.previousPosition.addClass('unselected');

  }

}
