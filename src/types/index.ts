export interface Task {
  id: string;
  title: string;
  description: string;
  urgency: number;
  importance: number;
  date: Date;
}

export interface CompletedTask extends Task {
  completedDate: Date;
}