import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { Respuesta } from '../../interfaces/respuesta.interface';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.scss'
})
export class ConfirmAccountComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private token = '';
  private shredService = inject(SharedService);
  public respuesta = signal<Respuesta>({status:'error',msg:'',data:undefined});

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      //console.log(params);
      this.token = params.get('token') || '';

      if (this.token != '') {
        this.shredService.confirmarCuenta(this.token).pipe(
          tap({
            next:(resp:Respuesta)=>{
              console.log(resp.status);
              this.respuesta.set(resp);
            },
          }),
          catchError((err)=>{
            console.log(err);
            this.respuesta.set(err.error);
            return of(null)
          })
        ).subscribe();
      }
    })
  }


}
