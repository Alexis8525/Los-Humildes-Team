import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Routine } from '../models/routine.model';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  private apiUrl = 'api/routines'; // Ajusta según tu API

  constructor(private http: HttpClient) { }

  createRoutine(routine: Routine): Observable<Routine> {
    return this.http.post<Routine>(this.apiUrl, routine);
  }

  getUserRoutines(userId: string): Observable<Routine[]> {
    return this.http.get<Routine[]>(`${this.apiUrl}/user/${userId}`);
  }
}
