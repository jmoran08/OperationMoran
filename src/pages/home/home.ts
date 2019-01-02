import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from 'ionic-native';
import { AlertController, LoadingController } from 'ionic-angular';

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

  constructor(public loadCtrl:LoadingController, private alertCtrl: AlertController, public navCtrl: NavController, private ngZone: NgZone) {
  	//this.getAllBluetoothDevices();
  	//BluetoothSerial.enable();
  	//MOST RECENT ATTEMPT that connects - bluetooth stops blinking
  	this.startScanning();
  }

  // put BluetoothSerial inside a function, can't be called different
  //this gets all available bluetooth - paired or not ORIGINAL ATTEMPT
	getAllBluetoothDevices(){
	    // async so keep everything in this method
	    BluetoothSerial.isEnabled().then((data)=> {
	        // not sure of returning value, probably a boolean
	        console.log("dont know what it returns"+data);

	        // returns all the available devices, not just the unpaired ones
	        BluetoothSerial.list().then((allDevices) => {
	            // set the list to returned value
	            this.lists = allDevices;
	            if(!(this.lists.length > 0)){
	               this.var2 = "could not find any bluetooth devices";
	               console.log(this.var2);
	            }
	            else{
		            for(var i = 0; i < this.lists.length; i++){
		            	console.log(this.lists[i]);
		            }
	            }
	        });
	    });
	 }

	 startScanning() {
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    BluetoothSerial.discoverUnpaired().then((success) => {
      this.unpairedDevices = success;
      this.gettingDevices = false;
      success.forEach(element => {
        console.log("Element found: " + element);
        
      });
    },
      (err) => {
        console.log(err);
      })

    BluetoothSerial.list().then((success) => {
      this.pairedDevices = success;
      console.log("successfully paired");
      this.selectDevice(this.pairedDevices[0].address);
    },
      (err) => {

      })
  }
  success = (data) => alert(data);
  fail = (error) => alert(error);

  selectDevice(address: any) {
  	console.log("giving bluetooth options");
    let alert = this.alertCtrl.create({
      title: 'Connect',
      message: 'Do you want to connect with' + address + '?',
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
            BluetoothSerial.connect(address).subscribe(this.success, this.fail);
        
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

}
