import { Component } from '@angular/core';
import { Platform, ModalController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { TabsPage } from '../pages/tabs/tabs';
import { SplashPage } from '../pages/splash/splash';
import { GlobalVars } from '../pages/global'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, modalCtrl: ModalController, public global: GlobalVars) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      //splashScreen.hide()
      let splash = modalCtrl.create(SplashPage);
           splash.present();

      this.global.setArduinoInfo();
    });
  }
}
