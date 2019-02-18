import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomPatternSelectModalPage } from './custom-pattern-select-modal';

@NgModule({
  declarations: [
    CustomPatternSelectModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomPatternSelectModalPage),
  ],
})
export class CustomPatternSelectModalPageModule {}
