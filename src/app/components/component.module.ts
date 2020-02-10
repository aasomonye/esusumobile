import {NgModule, Input} from '@angular/core';
import {FooterComponent} from './footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { InfobarComponent } from './infobar/infobar.component';

@NgModule({
    imports : [
        IonicModule
    ],
    declarations:[FooterComponent,InfobarComponent],
    exports:[FooterComponent,InfobarComponent]
})
export class ComponentModule{
    @Input() page : string;
}