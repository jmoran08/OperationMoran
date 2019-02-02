import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrebuiltPatternDetailsPage } from './prebuilt-pattern-details';

@NgModule({
  declarations: [
    PrebuiltPatternDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PrebuiltPatternDetailsPage),
  ],
})
export class PrebuiltPatternDetailsPageModule {}
