import { Component, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, of, tap } from 'rxjs';
import { Respuesta } from '../../interfaces/respuesta.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-code2f',
  templateUrl: './code2f.component.html',
  styleUrl: './code2f.component.scss'
})
export class Code2fComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  public respuesta = signal<Respuesta>({ status: 'error', msg: '', data: undefined });
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private id  = '';

  form2fa = this.fb.group({
    code: ['', Validators.required]
  })

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      //console.log(params);
      this.id = params.get('id') || '';
    })
  }
  onSubmit() {
    const data = {
      code: this.form2fa.controls.code.value || '',
      userId: this.id
    }
    console.log(data);

    this.authService.verifi2Fa(data).pipe(
      tap({
        next: (resp: Respuesta) => {
          this.respuesta.set(resp);
          console.log(resp);
          window.sessionStorage.setItem('_tkn', resp.data || '');
          this.authService.isAuth.set(true);
          this.router.navigate(['/'])
        },
      }),
      catchError((err) => {
        this.respuesta.set(err.error);
        console.log(this.respuesta());
        return of(null)
      })
    ).subscribe();
  }

  onClose() {
    this.router.navigate(['/login']);
  }
}
