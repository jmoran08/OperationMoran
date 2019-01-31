import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatternSelectModalPage } from './pattern-select-modal';

@NgModule({
  declarations: [
    PatternSelectModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PatternSelectModalPage),
  ],
})
export class PatternSelectModalPageModule {}
