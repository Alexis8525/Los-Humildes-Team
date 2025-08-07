import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-msg',
  templateUrl: './layout-msg.component.html',
  styleUrl: './layout-msg.component.scss'
})
export class LayoutMsgComponent {
  @Input('msg') mensaje = '';
  @Input('title') title = '';
  @Input('msg-btn') btn = '';
  @Input('url') url = '/';

  private router = inject(Router);

  onRedirect(url:string){
    this.router.navigate([url]);
  }
}
