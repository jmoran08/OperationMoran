import { Component } from '@angular/core';
import { Platform, ModalController, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { BluetoothSerial } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { SplashPage } from '../pages/splash/splash';
import { GlobalVars } from '../pages/global'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  pairedDevices: any;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, modalCtrl: ModalController, public global: GlobalVars, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      //splashScreen.hide()
      let splash = modalCtrl.create(SplashPage);
           splash.present();

      this.global.setArduinoInfo();
      this.startScanning();
    });
  }

  displayAllowBluetooth(device: any){
    var device;
    let alert = this.alertCtrl.create({
    title: 'Connect to Machine',
    message: 'Connect bluetooth to Field Machine?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('cancelled connection');
        }
      },
      {
        text: 'Connect',
        handler: () => {
          console.log('connecting');
          BluetoothSerial.connect(device.id).subscribe((success) => {
                console.log("connected bluetooth success");
          },
          (err) => {
            console.log("Connect to bluetooth error: " + err.message);
          })

        }
      }
    ]
  });
  alert.present();
  }

  startScanning() {
     var device = null;
     this.pairedDevices = null;
     BluetoothSerial.list().then((success) => {
       console.log("bluetooth scan succeses");
       this.pairedDevices = success;
       if(this.pairedDevices.length > 0){
         for(var i = 0; i < this.pairedDevices.length; i++){
           console.log("paired device name: " + this.pairedDevices[i].name);
           if(this.pairedDevices[i].name === "HMSoft"){
             device = this.pairedDevices[i];
           }
         }
         if(device.name != null){
           this.displayAllowBluetooth(device);
         }
         else{
           console.log("nothing found do not connect");
         }
       }
     },
       (err) => {
         console.log("Bluetooth scan error: " + err.message);
       })
 }

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

}
