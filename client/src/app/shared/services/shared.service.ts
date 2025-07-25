import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Respuesta } from '../interfaces/respuesta.interface';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseURL;

  constructor() { }

  confirmarCuenta(token:string):Observable<Respuesta>{
    return this.http.get<Respuesta>(`${this.baseUrl}/auth/confirmar-cuenta/${token}`);
  }

  confirmarTokenNewPass(token:string):Observable<Respuesta>{
    return this.http.get<Respuesta>(`${this.baseUrl}/auth/new-pass/${token}`);
  }
}
