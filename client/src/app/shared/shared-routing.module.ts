import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmAccountComponent } from './components/confirm-account/confirm-account.component';
import { LayoutSharedPageComponent } from './pages/layout-shared-page/layout-shared-page.component';
import { ConfirmTknNwpassComponent } from './components/confirm-tkn-nwpass/confirm-tkn-nwpass.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
