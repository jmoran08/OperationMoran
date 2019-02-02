import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayTypeSelectionPage } from './play-type-selection';

@NgModule({
  declarations: [
    PlayTypeSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayTypeSelectionPage),
  ],
})
export class PlayTypeSelectionPageModule {}
