import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';

import { PopoverContentComponent } from './popover.component';
import { PopoverDirective } from './popover-anchor.directive';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule,
    BidiModule,
  ],
  declarations: [
    PopoverContentComponent,
    PopoverDirective,
  ],
  exports: [
    PopoverContentComponent,
    PopoverDirective,
    BidiModule,
  ]
})
export class PopoverModule { }
