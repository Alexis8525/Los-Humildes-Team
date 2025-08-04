import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Respuesta } from '../../interfaces/respuesta.interface';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-confirm-tkn-nwpass',
  templateUrl: './confirm-tkn-nwpass.component.html',
  styleUrl: './confirm-tkn-nwpass.component.scss'
})
export class ConfirmTknNwpassComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private token = '';
  private shredService = inject(SharedService);
  public respuesta = signal<Respuesta>({ status: 'error', msg: '', data: undefined });
  public infoBtn = {url:'',title:''};

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      //console.log(params);
      this.token = params.get('token') || '';

      if (this.token != '') {
        this.shredService.confirmarTokenNewPass(this.token).pipe(
          tap({
            next: (resp: Respuesta) => {
              console.log(resp.status);
              this.respuesta.set(resp);
              this.infoBtn = { url: '/', title: 'Cambiar Password' };
            },
          }),
          catchError((err) => {
            console.log(err);
            this.infoBtn = { url: '/', title: 'Inicio' };
            this.respuesta.set(err.error);
            return of(null)
          })
        ).subscribe();
      }
    })
  }
}
