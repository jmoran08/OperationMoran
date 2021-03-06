import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Select} from 'ionic-angular';
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
  playType: any;
	instructions: any;
  @ViewChild('mySelect') selectRef: Select;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public popoverCtrl: PopoverController, public global: GlobalVars) {
    this.instructions = [];
    var paramInstructions = this.navParams.get('savedInstructions');
    if(paramInstructions != null){
        for(var i=0; i < paramInstructions.length; i++){
          this.instructions.push({row: paramInstructions[i].patternRow, col: paramInstructions[i].patternCol, type: paramInstructions[i].patternType});
        }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomPatternModalPage');
    var $src = $('#field-grid-source');
    var $wrap = $('<div id="field-grid-overlay"></div>');
    var $gsize = 40;

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
    $('#field-grid-overlay td').css('text-align', 'center');
    $('#field-grid-overlay td').click((e) => {
      //***NEED TO UNSELECT INSTRUCTION IF CLICKED AGAIN
      //***AND ALSO REMOVE FROM LIST OF INSTRUCTIONS
      //***AND RELOAD INSTRUCTIONS WITH CORRECT NUMBERS
    	/*if(this.prevoiusPosition.hasClass('selected')){
    		this.previousPosition.removeClass('selected');
    		this.previousPosition.addClass('unselected');
    	}*/
      if($(e.currentTarget).hasClass('selected')){
        $(e.currentTarget).removeClass('selected');
        $(e.currentTarget).addClass('unselected');
        $(e.currentTarget).css('background-color', 'transparent');
        $(e.currentTarget).html("");
        this.recountInstructions($(e.currentTarget));
      }
      else{
      	//$(e.currentTarget).toggleClass('selected').toggleClass('unselected');
        $(e.currentTarget).removeClass('unselected');
        $(e.currentTarget).addClass('selected');
        this.previousPosition = $(e.currentTarget);
      	this.previousRow = $(e.currentTarget).parent();
        this.selectRef.open();
      }
    });
    this.showSavedInstructions();

  }

  closeModal(){
  	this.viewCtrl.dismiss("cancel");
  }

  setInstructionsAndClose(){
  	//this.global.setInstructions(this.instructions);
  	this.viewCtrl.dismiss(this.instructions);
  }
  onPlaySelect(){
			this.play = this.playType;
			this.addInstruction();
  }

  onPlaySelectCancel(){
    this.previousPosition.removeClass('selected');
    this.previousPosition.addClass('unselected');
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
		});;
    $(this.previousPosition).html(this.instructions.length);
    switch(this.play){
      case 'Fly Ball':
        $(this.previousPosition).css('background-color', 'yellow');
        break;
      case 'Ground Ball':
        $(this.previousPosition).css('background-color', 'green');
        break;
      case 'Line Drive':
      $(this.previousPosition).css('background-color', 'red');
        break;
      default:
        break;
    }

  }

  recountInstructions(target: any){
    this.instructions = this.instructions.filter(function( instruction ) {
      return target.attr('class').indexOf(instruction.col) <= -1 || target.parent().attr('class').indexOf(instruction.row) <= -1;
    });
    console.log("New instruction count: " + this.instructions.length);
    var square;
    for(var i=0; i < this.instructions.length; i++){
      square = $('tr.row' + this.instructions[i].row).find('td.col' + this.instructions[i].col);
      square.html(i+1);
      switch(this.instructions[i].type){
        case 'Fly Ball':
          square.css('background-color', 'yellow');
          break;
        case 'Ground Ball':
          square.css('background-color', 'green');
          break;
        case 'Line Drive':
        square.css('background-color', 'red');
          break;
        default:
          break;
      }
    }
  }

  showSavedInstructions(){
      console.log("saved instructions: " + this.instructions.length);
      var square;
      for(var i=0; i < this.instructions.length; i++){
        square = $('tr.row' + this.instructions[i].row).find('td.col' + this.instructions[i].col);
        square.addClass('selected');
        square.html(i+1);
        switch(this.instructions[i].type){
          case 'Fly Ball':
            square.css('background-color', 'yellow');
            break;
          case 'Ground Ball':
            square.css('background-color', 'green');
            break;
          case 'Line Drive':
          square.css('background-color', 'red');
            break;
          default:
            break;
        }
      }
  }

}
