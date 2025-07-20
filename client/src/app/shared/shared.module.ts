import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PruebaComponent } from './components/prueba/prueba.component';
import { ConfirmAccountComponent } from './components/confirm-account/confirm-account.component';
import { SharedRoutingModule } from './shared-routing.module';



@NgModule({
  declarations: [
    PruebaComponent,
    ConfirmAccountComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports:[
    PruebaComponent
  ]
})
export class SharedModule { }
