import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hc-type-ahead-demo',
  templateUrl: './type-ahead-demo.component.html',
  styleUrls: ['./type-ahead-demo.component.scss']
})
export class TypeAheadDemoComponent {
    lastModified: Date = new Date( document.lastModified );
    public document: string = require('raw-loader!../../../../guides/components/type-ahead.md');
}
