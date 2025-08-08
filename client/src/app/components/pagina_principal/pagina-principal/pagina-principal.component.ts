import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { BarraLateralComponent } from '../barra-lateral/barra-lateral.component';
import { Router, RouterModule } from '@angular/router';
import { ProgressTrackerComponent } from "../../progress-tracker/progress-tracker.component";

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProgressTrackerComponent
],
  templateUrl: './pagina-principal.component.html',
  styleUrl: './pagina-principal.component.scss'
})
export class PaginaPrincipalComponent {
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
  
    isCollapsed = false;
  
  
    toggleSidebar(): void {
      this.isCollapsed = !this.isCollapsed;
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
