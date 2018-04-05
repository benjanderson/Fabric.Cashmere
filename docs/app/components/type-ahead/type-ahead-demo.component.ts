import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'hc-type-ahead-demo',
    templateUrl: './type-ahead-demo.component.html',
    styleUrls: ['./type-ahead-demo.component.scss']
})
export class TypeAheadDemoComponent {
    lastModified: Date = new Date(document.lastModified);
    public document: string = require('raw-loader!../../../../guides/components/type-ahead.md')
    selected: string = '';
    states: string[] = [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Dakota',
        'North Carolina',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming'
    ];
}
