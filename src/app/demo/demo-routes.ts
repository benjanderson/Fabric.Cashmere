import { Routes } from '@angular/router';
import { ButtonDemoComponent } from 'app/lib/button/button-demo/button-demo.component';
import { SelectDemoComponent } from 'app/lib/select/select-demo/select-demo.component';
import { DemoComponent } from 'app/demo/demo.component';

export const routes: Routes = [
    {
        path: 'demo',
        component: DemoComponent,
        children: [
            {
                path: 'buttons',
                component: ButtonDemoComponent
            },
            {
                path: 'select',
                component: SelectDemoComponent
            }
        ]
    }
];
