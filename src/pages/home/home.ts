import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from 'ionic-native';
import { AlertController, LoadingController, Platform } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Prebuilts } from '../prebuilts';
import { GlobalVars } from '../global';

import * as $ from "jquery";
//import { ModalPage } from '../../contact';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	public working:string;
	public var2: string ;
	public lists = [];


	output:any;
	message:String;
	responseTxt:any;
	unpairedDevices: any;
	pairedDevices: any;
	statusMessage: string;
	gettingDevices: Boolean;
	psi: any;
	servo: any;
	linear: any;
	feedback: any;
	showPairedDevices: any;
	instructions: any;
	previousPosition: any;
	playType: any;
	paused: Boolean;
	stopped: Boolean;
	previous: Boolean;
	playing: Boolean;
	readyToPlay: Boolean;
  coordinatesSent: Boolean;
  arduinoDone: Boolean;

	constructor(public loadCtrl:LoadingController, private alertCtrl: AlertController, public navCtrl: NavController, private ngZone: NgZone, public modalCtrl: ModalController, private platform: Platform, public prebuilts: Prebuilts, public global: GlobalVars) {
		this.readyToPlay = true;
    this.arduinoDone = false;

		platform.ready().then(() => {
			this.instructions = global.getInstructions();
			var $src = $('#grid-source');
		    var $wrap = $('<div id="grid-overlay"></div>');
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
		            $tr.append($td);
		        }
		        $tbl.append($tr);
		    }
		    $src.css('width', $cols*$gsize+'px').css('height', $rows*$gsize+'px')

		    // attach overlay
		    $wrap.append($tbl);
		    $src.after($wrap);

		});

	}

	changeTextColor(){
	  $('#myButton').text('white');
	}

	 startScanning() {
	    this.pairedDevices = null;
	    this.gettingDevices = true;
	    BluetoothSerial.list().then((success) => {
        console.log("bluetooth scan succeses");
	      this.pairedDevices = success;
	      this.showPairedDevices = true;
	    },
	      (err) => {
          console.log("Bluetooth scan error: " + err.message);
	      })
	}

	success = (data) => alert(data);
	fail = (error) => alert(error);

	selectDevice(address: any, name: any) {
		console.log("giving bluetooth options");
		let alert = this.alertCtrl.create({
		  title: 'Connect',
		  message: 'Do you want to connect with' + name + '?',
		  buttons: [
		    {
		      text: 'Cancel',
		      role: 'cancel',
		      handler: () => {
		        console.log('Cancel clicked');
		      }
		    },
		    {
		      text: 'Connect',
		      handler: () => {
		        BluetoothSerial.connect(address).subscribe((success) => {
          console.log("connected bluetooth success");
		},
		  (err) => {
        console.log("Connect to bluetooth error: " + err.message);
		  })

		      }
		    }
		  ]
		});
		alert.present(

		);
	}

	disconnect() {
		let alert = this.alertCtrl.create({
		  title: 'Disconnect?',
		  message: 'Do you want to Disconnect?',
		  buttons: [
		    {
		      text: 'Cancel',
		      role: 'cancel',
		      handler: () => {
		        alert.dismiss();
		      }
		    },
		    {
		      text: 'Disconnect',
		      handler: () => {
		        BluetoothSerial.disconnect();
		        this.gettingDevices=null;
		      }
		    }
		  ]
		});
		alert.present();
	}

	next(){
		this.navCtrl.push('TerminalPage');
	}

	data(){
	    setInterval(()=>{
	      this.read1();
	    } ,3000);
	}

	read(){
		BluetoothSerial.read().then((data)=>
		{
      if(data === null){
        this.read();
      }
      else{
        this.message=data;
      }

		})
	}

	read1(){
		this.ngZone.run(()=>{
		this.read();
		})
	}

	sendData(servo, linear, psi){
		BluetoothSerial.write(servo + " " + linear + " " + psi + " ").then((success) => {
		  console.log("successfully wrote data");

		},
		  (err) => {
		  	console.log("could not write data");
		  })
	}

  async readData(){
    BluetoothSerial.read().then((data) => {
      if(data === "edon"){
        console.log("I got data: " + data);
        this.coordinatesSent = false;
        this.feedback = data;
      }
    });
  }

	async wait() {
		return new Promise(function(resolve) {
			setTimeout(resolve, 500);
		});
	}

  async play(){
    this.instructions = this.global.getInstructions();
    if(this.instructions === ""){
			this.displayNoInstructionsPopup();
		}
    else{
      this.coordinatesSent = false;
      this.feedback = "";
      this.playing = true;
      this.readyToPlay = false;
      this.paused = false;
      this.stopped = false;
      this.previous = false;
      var waitUntilDone = false;
      var color;
      var psi;
      var angleServo;
      var angleLinear;
      for(var i=0; i < this.instructions.length; i++)
      {
        if(this.playing && this.coordinatesSent){
          await this.wait();
          //console.log("in waiting for response mode new play");
          await this.readData();
          i--;

          continue;
        }
        else if(this.paused){
          await this.wait();
          console.log("in pause mode new play");
          i--;
          continue;
        }
        else if((!this.playing && this.stopped) || waitUntilDone){
          console.log("in stop mode new play");
          break;
        }
        else{
          //console.log("sending from new play");
          //send instructions
          if(this.previousPosition){
            this.previousPosition.css('background-color', 'transparent');
            this.playType = "";
          }

          var table = (<HTMLTableElement>$(".positionTable")[0]);
            var cell = table.rows[this.instructions[i].patternRow].cells[this.instructions[i].patternCol];
          var $cell = $(cell);
          switch(this.instructions[i].patternType){
            case "ground":
              color = "green";
              this.playType = "Ground Ball";
              break;
            case "fly":
              color = "yellow";
              this.playType = "Fly Ball";
              break;
            case "line":
              color = "red";
              this.playType = "Line Drive";
              break;
            default:
              break;
          }
          $cell.css('background-color', color);
          this.previousPosition = $cell;
          //send motor coordinates
          //console.log("pattern arduino info: " + this.instructions[i].servo + " " + this.instructions[i].linear + " " + this.instructions[i].psi);
          this.sendData(this.instructions[i].servo, this.instructions[i].linear, this.instructions[i].psi);
          //wait for "done" response from arduino
          this.coordinatesSent = true;
          if(i === this.instructions.length - 1){
            i--;
            waitUntilDone = true;
          }
        }
      }
      this.readyToPlay = true;
      this.stopped = false;
      this.playing = false;
      this.paused = false;
      this.previous = false;
      this.previousPosition.css('background-color', 'transparent');
      this.playType = "";
    }
  }



	pause(){
		this.previous = false;
    this.playing = false;
    this.stopped = false;
    this.paused = true;
	}

  unpause(){
    this.previous = false;
    this.playing = true;
    this.stopped = false;
    this.paused = false;
  }

	stop(){
		this.previous = false;
    this.playing = false;
    this.stopped = true;
    this.paused = false;
	}

	previousInstruction(){
		this.previous = true;
		this.playing = false;
    this.stopped = false;
	}

	displayNoInstructionsPopup() {
	    const alert = this.alertCtrl.create({
	      title: 'Select Play Type',
	      subTitle: 'You must select a play type for the machine to run.',
	      buttons: ['OK'],
        cssClass: 'alertCustomCss'
	    });
	    alert.present();
	}

}
