import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PruebaComponent } from './components/prueba/prueba.component';
import { ConfirmAccountComponent } from './components/confirm-account/confirm-account.component';
import { SharedRoutingModule } from './shared-routing.module';
import { LayoutSharedPageComponent } from './pages/layout-shared-page/layout-shared-page.component';
import { RouterOutlet } from '@angular/router';
import { LayoutMsgComponent } from './components/layout-msg/layout-msg.component';
import { ConfirmTknNwpassComponent } from './components/confirm-tkn-nwpass/confirm-tkn-nwpass.component';



@NgModule({
  declarations: [
    PruebaComponent,
    ConfirmAccountComponent,
    LayoutSharedPageComponent,
    LayoutMsgComponent,
    ConfirmTknNwpassComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    RouterOutlet
  ],
  exports:[
    PruebaComponent
  ]
})
export class SharedModule { }
