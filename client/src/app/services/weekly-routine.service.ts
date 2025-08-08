import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeeklyRoutine } from '../models/weekly-routine.model';
import { DailyRoutine } from '../models/weekly-routine.model'; 

@Injectable({
  providedIn: 'root'
})
export class WeeklyRoutineService {
  private apiUrl = 'api/weekly-routines'; // Ajusta según tu API

  constructor(private http: HttpClient) { }

  createWeeklyRoutine(weeklyRoutine: WeeklyRoutine): Observable<WeeklyRoutine> {
    return this.http.post<WeeklyRoutine>(this.apiUrl, weeklyRoutine);
  }

  getUserWeeklyRoutines(userId: string): Observable<WeeklyRoutine[]> {
    return this.http.get<WeeklyRoutine[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateDailyRoutine(weeklyRoutineId: string, day: number, dailyRoutine: DailyRoutine): Observable<WeeklyRoutine> {
    return this.http.patch<WeeklyRoutine>(`${this.apiUrl}/${weeklyRoutineId}/day/${day}`, dailyRoutine);
 } 

 updateWeeklyRoutine(weeklyRoutine: WeeklyRoutine): Observable<WeeklyRoutine> {
    return this.http.put<WeeklyRoutine>(`${this.apiUrl}/${weeklyRoutine._id}`, weeklyRoutine);
  }
}
