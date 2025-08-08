import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PruebaComponent } from './prueba/prueba.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { SharedRoutingModule } from './shared-routing.module';
import { LayoutSharedPageComponent } from '../pages/layout-shared-page/layout-shared-page.component';
import { RouterOutlet } from '@angular/router';
import { LayoutMsgComponent } from './layout-msg/layout-msg.component';
import { ConfirmTknNwpassComponent } from './confirm-tkn-nwpass/confirm-tkn-nwpass.component';
import { Code2fComponent } from './code2f/code2f.component';
import { NavbarComponent } from '../components/pagina_principal/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountCreatedComponent } from './account-created/account-created.component';



@NgModule({
  declarations: [
    PruebaComponent,
    ConfirmAccountComponent,
    LayoutSharedPageComponent,
    LayoutMsgComponent,
    ConfirmTknNwpassComponent,
    Code2fComponent,
    AccountCreatedComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    RouterOutlet,
    NavbarComponent,
    ReactiveFormsModule
  ],
  exports:[
    PruebaComponent,
    Code2fComponent
  ]
})
export class SharedModule { }
