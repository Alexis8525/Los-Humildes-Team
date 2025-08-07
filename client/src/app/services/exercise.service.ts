import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root' // Esto es importante
})
export class ExerciseService {
  private apiUrl = 'api/exercises'; // Ajusta esta URL según tu backend

  constructor(private http: HttpClient) {} // Inyección de HttpClient

  getExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.apiUrl);
  }
}