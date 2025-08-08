import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { BarraLateralComponent } from '../barra-lateral/barra-lateral.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BarraLateralComponent,
    RouterModule
],
  templateUrl: './pagina-principal.component.html',
  styleUrl: './pagina-principal.component.scss'
})
export class PaginaPrincipalComponent {

}
