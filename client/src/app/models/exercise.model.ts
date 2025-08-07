export interface Exercise {
  _id: string;
  createdBy: string;
  name: string;
  muscleGroups: string[];
  equipmentRequired: string;
  difficulty: string;
  videoUrl?: string;
  visibility: 'system' | 'private';
  isActive: boolean;
}
