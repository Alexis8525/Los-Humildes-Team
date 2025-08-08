import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { LayoutSharedPageComponent } from '../pages/layout-shared-page/layout-shared-page.component';
import { ConfirmTknNwpassComponent } from './confirm-tkn-nwpass/confirm-tkn-nwpass.component';
import { AccountCreatedComponent } from './account-created/account-created.component';
import { Code2fComponent } from './code2f/code2f.component';

const routes: Routes = [
  {
    path:'',
    component:LayoutSharedPageComponent,
    children:[
      {
        path:'confirm-account/:token',
        component:ConfirmAccountComponent
      },
      {
        path:'confirm-tkn-pass/:token',
        component:ConfirmTknNwpassComponent
      },
      {
        path:'created',
        component:AccountCreatedComponent
      },
      {
        path:'2fa/:id',
        component:Code2fComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
