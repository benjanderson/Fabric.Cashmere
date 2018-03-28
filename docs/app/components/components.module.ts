import { SubModalDemoComponent } from './modal/sub-modal-demo.component';
import { ModalDemoComponent } from './modal/modal-demo.component';
import { TypeFormSurveyDemoComponent } from './typeform-survey/typeform-survey-demo.component';
import { TabsDemoComponent } from './tabs/tabs-demo.component';
import { TabDemoComponent } from './tabs/tab-demo.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsComponent } from './components.component';
import { ButtonDemoComponent } from './button/button-demo.component';
import { routes } from './components-routes';
import { NavbarDemoComponent } from './navbar/navbar-demo.component';
import { PopoverDemoComponent } from './popover/popover-demo.component';
import { CheckboxDemoComponent } from './checkbox/checkbox-demo.component';
import { RadioButtonDemoComponent } from './radio-button/radio-button-demo.component';
import { SelectDemoComponent } from './select/select-demo.component';
import { DrawerDemoComponent } from './drawer/drawer-demo.component';
import { HomeComponent } from '../home/home.component';
import { IconDemoComponent } from './icon/icon-demo.component';
import { ListDemoComponent } from './list/list-demo.component';
import { SubnavDemoComponent } from './subnav/subnav-demo.component';
import { AccordionDemoComponent } from './accordion/accordion-demo.component';
import { BreadcrumbsDemoComponent } from './breadcrumbs/breadcrumbs-demo.component';
import { Breadcrumb1DemoComponent } from './breadcrumbs/breadcrumbs1-demo.component';
import { Breadcrumb2DemoComponent } from './breadcrumbs/breadcrumbs2-demo.component';
import { TileDemoComponent } from './tile/tile-demo.component';
import { FilterButtonComponent } from './chip/filter-button.component';
import { ChipDemoComponent } from './chip/chip-demo.component';
import { InputDemoComponent } from './input/input-demo.component';
import { ProgressIndicatorDemoComponent } from './progress-indicator/progress-indicator-demo.component';
import { SharedModule } from '../shared/shared.module';
import { TypeAheadDemoComponent } from './type-ahead/type-ahead-demo.component';
import { CashmereModule } from '../../../lib/src/cashmere.module';
import { MockAppSwitcherService } from '../../../lib/src/app-switcher';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        CashmereModule,
        SharedModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        ComponentsComponent,
        HomeComponent,
        ButtonDemoComponent,
        NavbarDemoComponent,
        PopoverDemoComponent,
        CheckboxDemoComponent,
        RadioButtonDemoComponent,
        SelectDemoComponent,
        DrawerDemoComponent,
        TabsDemoComponent,
        TabDemoComponent,
        IconDemoComponent,
        ListDemoComponent,
        ModalDemoComponent,
        SubnavDemoComponent,
        AccordionDemoComponent,
        SubnavDemoComponent,
        SubModalDemoComponent,
        BreadcrumbsDemoComponent,
        Breadcrumb1DemoComponent,
        Breadcrumb2DemoComponent,
        TileDemoComponent,
        ChipDemoComponent,
        ProgressIndicatorDemoComponent,
        FilterButtonComponent,
        TypeFormSurveyDemoComponent,
        InputDemoComponent,
        ModalDemoComponent,
        TypeAheadDemoComponent
    ],
    providers: [
        {
            provide: 'IAppSwitcherService',
            useClass: MockAppSwitcherService
        }
    ],
    entryComponents: [
        SubModalDemoComponent,
    ]
})
export class ComponentsModule {
}
