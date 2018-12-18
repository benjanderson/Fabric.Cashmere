import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HcDatepickerComponent} from './hc-datepicker.component';

@NgModule({
    imports: [CommonModule],
    exports: [HcDatepickerComponent],
    declarations: [HcDatepickerComponent]
})
export class DatepickerModule {}
