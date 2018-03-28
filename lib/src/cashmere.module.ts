import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from './button/button.module';
import { TypeAheadModule } from './type-ahead/type-ahead.module';
import { NavbarModule } from './navbar/navbar.module';
import { PopoverModule } from './popover/popover.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { RadioButtonModule } from './radio-button/radio-button.module';
import { ProgressIndicatorsModule } from './progress-indicators/progress-indicators.module';
import { AppSwitcherModule } from './app-switcher';
import { ModalModule } from './modal';
import { IconModule } from './icon/icon.module';
import { DrawerModule } from './drawer/drawer.module';
import { TabsModule } from './tabs/tabs.module';
import { SelectModule } from './select/select.module';
import { ListModule } from './list/list.module';
import { SubnavModule } from './subnav/subnav.module';
import { BreadcrumbsModule } from './breadcrumbs/breadcrumbs.module';
import { AccordionModule } from './accordion/accordion.module';
import { TypeformSurveyModule } from './typeform-survey/typeform-survey.module';
import { TileModule } from './tile/tile.module';
import { ChipModule } from './chip/chip.module';
import { InputModule } from './input/input.module';
import { LabelModule } from './label/label.module';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        NavbarModule,
        PopoverModule,
        CheckboxModule,
        RadioButtonModule,
        ProgressIndicatorsModule,
        AppSwitcherModule,
        ModalModule,
        IconModule,
        DrawerModule,
        TabsModule,
        SelectModule,
        ListModule,
        SubnavModule,
        BreadcrumbsModule,
        AccordionModule,
        TypeformSurveyModule,
        TileModule,
        ChipModule,
        InputModule,
        LabelModule,
        TypeAheadModule
    ],
    exports: [
        CommonModule,
        ButtonModule,
        NavbarModule,
        PopoverModule,
        CheckboxModule,
        RadioButtonModule,
        ProgressIndicatorsModule,
        AppSwitcherModule,
        ModalModule,
        IconModule,
        DrawerModule,
        TabsModule,
        SelectModule,
        ListModule,
        SubnavModule,
        BreadcrumbsModule,
        AccordionModule,
        TypeformSurveyModule,
        TileModule,
        ChipModule,
        InputModule,
        LabelModule,
        TypeAheadModule
    ]
})
export class CashmereModule {
}
