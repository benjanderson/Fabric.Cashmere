import {Component, ViewEncapsulation} from '@angular/core';
import {parseBooleanAttribute} from '../util';

/** The datepicker allows user to select a date or date range by choosing dates from a calendar.*/
@Component({
    selector: 'hc-datepicker',
    templateUrl: './hc-datepicker.html',
    styleUrls: ['./hc-datepicker.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HcDatepickerComponent {}
