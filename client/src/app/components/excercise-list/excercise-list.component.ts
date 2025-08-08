import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarraLateralComponent } from '../pagina_principal/barra-lateral/barra-lateral.component';
import { Router, RouterModule } from '@angular/router';



interface Exercise {
  _id: string;
  name: string;
  muscleGroups: string[];
  equipmentRequired: string;
  difficulty: string;
  videoUrl?: string;
  visibility: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Respuesta {
  status: string;
  msg: string;
  data: any;
}

@Component({
  selector: 'app-excercise-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './excercise-list.component.html',
  styleUrl: './excercise-list.component.scss'
})
export class ExerciseListComponent implements OnInit {
  @ViewChild('sidebar') sidebarRef!: ElementRef;
      private isBrowser: boolean;
      public isExpanded: boolean = false;
    
  exercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];
  loading = true;
  error = '';
  
  // Filtros
  searchTerm = '';
  selectedVisibility: 'all' | 'system' | 'private' = 'all';
  selectedDifficulty: 'all' | 'fácil' | 'medio' | 'difícil' = 'all';
  selectedEquipment: 'all' | string = 'all';
  equipmentOptions: string[] = ['pesas', 'bandas', 'ninguno'];

  // Nuevo ejercicio
  newExercise = {
    name: '',
    muscleGroups: [] as string[],
    equipmentRequired: '',
    difficulty: 'medio',
    videoUrl: ''
  };
  muscleGroupInput = '';
  showAddForm = false;
  isCollapsed = false;


  constructor(
    private http: HttpClient,
    private renderer: Renderer2, 
    @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router
    ) {
      this.isBrowser = isPlatformBrowser(this.platformId);
    }

  ngOnInit(): void {
    this.loadExercises();
  }
    toggleSidebar(): void {
      this.isCollapsed = !this.isCollapsed;
      if (this.isBrowser) {
        const sidebar = this.sidebarRef.nativeElement;
        if (this.isExpanded) {
          this.renderer.removeClass(sidebar, 'expand');
        } else {
          this.renderer.addClass(sidebar, 'expand');
        }
        this.isExpanded = !this.isExpanded;
      }
    }
  
    logout(): void {
      if (this.isBrowser) {
        // Aquí puedes agregar lógica para limpiar localStorage/sessionStorage si es necesario
        this.router.navigate(['/login']); // Ajusta la ruta según tu configuración
      }
    }

  loadExercises(): void {
    this.loading = true;
    this.http.get<Respuesta>(`${environment.baseURL}/exercises/user-system`)
      .subscribe({
        next: (response) => {
          this.exercises = response.data;
          this.filterExercises();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los ejercicios';
          this.loading = false;
          console.error(err);
        }
      });
  }

  filterExercises(): void {
    this.filteredExercises = this.exercises.filter(exercise => {
      // Filtro por término de búsqueda
      const matchesSearch = exercise.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        exercise.muscleGroups.some(mg => mg.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      // Filtro por visibilidad
      const matchesVisibility = this.selectedVisibility === 'all' || 
        exercise.visibility === this.selectedVisibility;
      
      // Filtro por dificultad
      const matchesDifficulty = this.selectedDifficulty === 'all' || 
        exercise.difficulty === this.selectedDifficulty;
      
      // Filtro por equipo
      const matchesEquipment = this.selectedEquipment === 'all' || 
        exercise.equipmentRequired === this.selectedEquipment;
      
      return matchesSearch && matchesVisibility && matchesDifficulty && matchesEquipment;
    });
  }

  addMuscleGroup(): void {
    if (this.muscleGroupInput.trim() && !this.newExercise.muscleGroups.includes(this.muscleGroupInput.trim())) {
      this.newExercise.muscleGroups.push(this.muscleGroupInput.trim());
      this.muscleGroupInput = '';
    }
  }

  removeMuscleGroup(index: number): void {
    this.newExercise.muscleGroups.splice(index, 1);
  }

  submitExercise(): void {
    if (!this.newExercise.name || 
        this.newExercise.muscleGroups.length === 0 || 
        !this.newExercise.equipmentRequired || 
        !this.newExercise.difficulty) {
      this.error = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.http.post<Respuesta>(`${environment.baseURL}/exercises`, this.newExercise)
      .subscribe({
        next: (response) => {
          this.exercises.unshift(response.data);
          this.filterExercises();
          this.resetForm();
          this.loading = false;
          this.showAddForm = false;
        },
        error: (err) => {
          this.error = err.error?.msg || 'Error al agregar el ejercicio';
          this.loading = false;
        }
      });
  }

  resetForm(): void {
    this.newExercise = {
      name: '',
      muscleGroups: [],
      equipmentRequired: '',
      difficulty: 'medio',
      videoUrl: ''
    };
    this.muscleGroupInput = '';
    this.error = '';
  }

  deleteExercise(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
      this.http.delete<Respuesta>(`${environment.baseURL}/exercises/${id}`)
        .subscribe({
          next: () => {
            this.exercises = this.exercises.filter(ex => ex._id !== id);
            this.filterExercises();
          },
          error: (err) => {
            this.error = err.error?.msg || 'Error al eliminar el ejercicio';
          }
        });
    }
  }
}
