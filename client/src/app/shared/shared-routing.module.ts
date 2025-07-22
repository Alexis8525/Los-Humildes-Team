import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmAccountComponent } from './components/confirm-account/confirm-account.component';

const routes: Routes = [
  {
    path:'confirm-account/:id',
    component:ConfirmAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
