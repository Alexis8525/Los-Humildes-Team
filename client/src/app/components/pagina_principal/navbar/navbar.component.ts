import { Component,OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


// Definir la interface fuera de la clase
export interface NavLink {
  id: string;
  url: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  navLinks: NavLink[] = [
    { id: 'navInicio', url: '/home' },
    { id: 'navConocenos', url: '/principal-conocenos' },
    { id: 'navServicios', url: '/principal-servicios' },
    { id: 'navContacto', url: '/principal-contactos' }
  ];

  constructor(
    private renderer: Renderer2, 
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object // Inject the platform ID
  ) { }

  // Implementación de ngOnInit
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Call the highlightActiveLink function only in the browser
      this.highlightActiveLink(); 
    }
  }

  // Función para resaltar el enlace activo
  highlightActiveLink(): void {
    // Obtener la URL actual usando el Location service de Angular
    const currentUrl = this.location.path();

    // Eliminar la clase 'active' de todos los enlaces
    this.navLinks.forEach((link: NavLink) => {
      const element = document.getElementById(link.id);
      if (element) {
        this.renderer.removeClass(element, 'active');
      }
    });

    // Agregar la clase 'active' al enlace correspondiente
    const activeLink = this.navLinks.find(link => currentUrl.includes(link.url));
    if (activeLink) {
      const element = document.getElementById(activeLink.id);
      if (element) {
        this.renderer.addClass(element, 'active');
      }
    }
  }

}
