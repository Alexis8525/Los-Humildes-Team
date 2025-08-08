import { Component, ElementRef, Renderer2, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barra-lateral',
  standalone: true,
    imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './barra-lateral.component.html',
  styleUrls: ['./barra-lateral.component.scss']
})
export class BarraLateralComponent {
  @ViewChild('sidebar') sidebarRef!: ElementRef;
  private isBrowser: boolean;
  public isExpanded: boolean = false;

  constructor(
    private renderer: Renderer2, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  toggleSidebar(): void {
    if (this.isBrowser) {
      const sidebar = this.sidebarRef.nativeElement;
      if (this.isExpanded) {
        this.renderer.removeClass(sidebar, 'expand');
      } else {
        this.renderer.addClass(sidebar, 'expand');
      }
      this.isExpanded = !this.isExpanded;
    }
  }

  logout(): void {
    if (this.isBrowser) {
      // Aquí puedes agregar lógica para limpiar localStorage/sessionStorage si es necesario
      this.router.navigate(['/login']); // Ajusta la ruta según tu configuración
    }
  }
}
