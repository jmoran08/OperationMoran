import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomPatternModalPage } from './custom-pattern-modal';

@NgModule({
  declarations: [
    CustomPatternModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomPatternModalPage),
  ],
})
export class CustomPatternModalPageModule {}
