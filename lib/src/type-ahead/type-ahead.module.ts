import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeAheadComponent } from './type-ahead.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        TypeAheadComponent
    ],
    declarations: [
        TypeAheadComponent
    ]
})
export class TypeAheadModule {
}
