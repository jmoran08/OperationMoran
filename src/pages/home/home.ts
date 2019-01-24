import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from 'ionic-native';
import { AlertController, LoadingController, Platform } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
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

	constructor(public loadCtrl:LoadingController, private alertCtrl: AlertController, public navCtrl: NavController, private ngZone: NgZone, public modalCtrl: ModalController, private platform: Platform) {
		//this.getAllBluetoothDevices();
		//BluetoothSerial.enable();
		//MOST RECENT ATTEMPT that connects - bluetooth stops blinking
		//this.startScanning();
		//this.presentModal();
		platform.ready().then(() => {
			var $src = $('#grid-source');
		    var $wrap = $('<div id="grid-overlay"></div>');
		    var $gsize = 20;

		    var $cols = Math.ceil($src.find('img').innerWidth() / $gsize);
		    var $rows = Math.ceil($src.find('img').innerHeight() / $gsize);

		    // create overlay
		    var $tbl = $('<table></table>');
		    for (var y = 1; y <= $rows; y++) {
		        var $tr = $('<tr></tr>');
		        for (var x = 1; x <= $cols; x++) {
		            var $td = $('<td></td>');
		            $td.css('width', $gsize+'px').css('height', $gsize+'px');
		            $td.addClass('unselected');
		            $tr.append($td);
		        }
		        $tbl.append($tr);
		    }
		    $src.css('width', $cols*$gsize+'px').css('height', $rows*$gsize+'px')

		    // attach overlay
		    $wrap.append($tbl);
		    $src.after($wrap);

		    $('#grid-overlay td').click(function() {
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
	      this.pairedDevices = success;
	      this.showPairedDevices = true;
	    },
	      (err) => {

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
		},
		  (err) => {

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

}
