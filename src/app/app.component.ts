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
  device: any;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, modalCtrl: ModalController, public global: GlobalVars, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      //splashScreen.hide()
      //let splash = modalCtrl.create(SplashPage);
           //splash.present();

      this.global.setArduinoInfo();
      this.startScanning(1);
    });
  }

  showNoBluetoothWarning(){
    let alert = this.alertCtrl.create({
    title: 'Warning',
    message: 'You must connect to the machine to utilize full capability of this application.',
    buttons: [
      {
        text: 'Ok',
        role: 'cancel',
        handler: () => {
          console.log('cancelled even after warning');
        },
        cssClass: 'alertCancelButton'
      },
      {
        text: 'Connect',
        handler: () => {
          console.log('connecting');
          this.displayAllowBluetooth();
        },
        cssClass: 'alertSuccessButton'
      }
    ],
    cssClass: 'alertCustomCss'
  });
  alert.present();
  }

  displayAllowBluetooth(){
    let alert = this.alertCtrl.create({
    title: 'Connect to Machine',
    message: 'Connect bluetooth to Field Machine?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('cancelled connection');
          this.showNoBluetoothWarning();
        },
        cssClass: 'alertCancelButton'
      },
      {
        text: 'Connect',
        handler: () => {
          console.log('connecting');
          if(this.device != null){
            BluetoothSerial.connect(this.device.id).subscribe((success) => {
                  console.log("connected bluetooth success");
            },
            (err) => {
              console.log("Connect to bluetooth error: " + err.message);
            })
          }
          else{
            this.displayNoneFound();
          }

        },
        cssClass: 'alertSuccessButton'
      }
    ],
    cssClass: 'alertCustomCss'
  });
  alert.present();
  }

  displayNoneFound(){
    let alert = this.alertCtrl.create({
    title: 'Enable Bluetooth',
    message: 'Cannot find the machine. Please make sure your bluetooth is enabled and the machine is powered on.',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('cancelled try again');
        },
        cssClass: 'alertCancelButton'
      },
      {
        text: 'Try Again',
        handler: () => {
          console.log('trying connection again');
          this.startScanning(0);
        },
        cssClass: 'alertSuccessButton'
      }
    ],
    cssClass: 'alertCustomCss'
  });
  alert.present();
  }

  startScanning(initial: any) {
     this.pairedDevices = null;
     BluetoothSerial.list().then((success) => {
       console.log("bluetooth scan succeses");
       this.pairedDevices = success;
       if(this.pairedDevices.length > 0){
         for(var i = 0; i < this.pairedDevices.length; i++){
           console.log("paired device name: " + this.pairedDevices[i].name);
           if(this.pairedDevices[i].name === "HMSoft"){
             this.device = this.pairedDevices[i];
           }
         }
       }
       if(this.device != null || initial > 0){
          this.displayAllowBluetooth();
        }
        else{
          console.log("nothing found do not connect");
          this.displayNoneFound();
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
         },
         cssClass: 'alertCancelButton'
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

         },
         cssClass: 'alertSuccessButton'
       }
     ],
     cssClass: 'alertCustomCss'
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
         }
       }
     ]
   });
   alert.present();
 }

}
