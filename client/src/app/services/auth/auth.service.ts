import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Respuesta } from '../../interfaces/respuesta.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.baseURL;
  isAuth = signal(false);

  constructor(private http: HttpClient) {
    this.isAuth.set(window.sessionStorage.getItem('_tkn') ? true : false);
  }

  login(user: { email: string, password: string }): Observable<Respuesta> {
    const  { email, password } = user;
    return this.http.post<Respuesta>(`${this.apiUrl}/auth/login`, { email, pass:password });
  }

  register(data:{name: string, lastN:string, email: string, password: string}): Observable<Respuesta> {
    const { name, lastN ,email, password } = data;
    return this.http.post<Respuesta>(`${this.apiUrl}/auth/registro`, { name, lastN ,email, pass:password });
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('_tkn')?true:false;
  }

  logOut(){
    window.sessionStorage.removeItem('_tkn');
    this.isAuth.set(false);
  }

  verifi2Fa(data:{code:string,userId:string}):Observable<Respuesta>{
    const {code,userId} = data;
    return this.http.post<Respuesta>(`${this.apiUrl}/auth/verify-2fa`,{code,userId});
  }
}
