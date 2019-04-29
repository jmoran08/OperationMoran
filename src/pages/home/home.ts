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
	constructor(public loadCtrl:LoadingController, private alertCtrl: AlertController, public navCtrl: NavController, private ngZone: NgZone, public modalCtrl: ModalController, private platform: Platform, public prebuilts: Prebuilts, public global: GlobalVars) {
		this.readyToPlay = true;
		//this.getAllBluetoothDevices();
		//BluetoothSerial.enable();
		//MOST RECENT ATTEMPT that connects - bluetooth stops blinking
		//this.startScanning();
		//this.presentModal();
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

		    $('#grid-overlay td').click(function(e) {
		        $(this).toggleClass('selected').toggleClass('unselected');
		    });

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

	/*presentModal() {
	    const modal = this.modalCtrl.create(ModalPage);
	    modal.present();
	}*/

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
		  		//this.sendData();
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
		this.message=data;

		})
	}

	read1(){
		this.ngZone.run(()=>{
		this.read();
		})
	}

	sendData(){
		BluetoothSerial.write(this.psi + " " + this.servo + " " + this.linear + " ").then((success) => {
		  console.log("successfully wrote data");

		},
		  (err) => {
		  	console.log("could not write data");
		  })
	}

	readData(){
		BluetoothSerial.read().then((data) => {
		  	console.log("DATA: " + data);
		  	this.feedback = data;
		});
	}

	async wait() {
		return new Promise(function(resolve) {
			setTimeout(resolve, 2000);
		});
	}

	async playPrebuilt() {
		var globeInstruct = this.global.getInstructions();
		if(this.global.getInstructions() === ""){
			this.displayNoInstructionsPopup();
		}
		else{
			this.playing = true;
			this.readyToPlay = false;
			this.stopped = false;
			this.instructions = this.global.getInstructions();
			var color;
			var coordinatesSent = false;
      var psi;
      var angleServo;
      var angleLinear;
			for(var i=0; i < this.instructions.length; i++){
				if(this.paused){
					if(this.stopped){
						//this.stopped = false;
						//this.paused = false;
						break;
					}
					i--;
					await this.wait();
				}
				else if(this.stopped){
					//this.stopped = false;
					break;
				}
				else{
					if(coordinatesSent){
						i--;
					}
					//if the coordinates have not been sent, send coordinates
					else{
						if(this.previous){
							coordinatesSent = false;
							i = i-2;
							this.previous = false;
						}
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
            console.log("pattern arduino info: " + this.instructions[i].servo + " " + this.instructions[i].linear + " " + this.instructions[i].psi);
						//wait for "done" response from arduino
						await this.wait();
					}
					//once coordinates are sent, fire if not paused or stopped
					//if paused, don't fire and wait
					if(this.paused){
						if(this.stopped){
							//this.stopped = false;
							//this.paused = false;
							break;
						}
						coordinatesSent = true;
					}
					//if stopped, don't fire and break
					else if(this.stopped){
						//this.stopped = false;
						break;
					}
					else{
						//fire
						coordinatesSent = false;
					}

				}
			}
			if(this.previousPosition){
				this.previousPosition.css('background-color', 'transparent');
				this.previousPosition = null;
				this.playType = "";
			}
			this.playing = false;
			this.paused = false;
			this.stopped = false;
			this.readyToPlay = true;
		}

	}

	pause(){
		if(this.paused){
			this.paused = false;
			this.playing = true;
		}
		else{
			this.paused = true;
			this.playing = false;
		}
	}

	stop(){
		this.stopped = true;
		this.playing = false;
		this.paused = false;
		this.readyToPlay = true;
	}

	previousInstruction(){
		this.previous = true;
		this.paused = false;
		this.playing = true;
	}

	displayNoInstructionsPopup() {
	    const alert = this.alertCtrl.create({
	      title: 'Select Play Type',
	      subTitle: 'Please select a play type',
	      buttons: ['OK']
	    });
	    alert.present();
	}

}
