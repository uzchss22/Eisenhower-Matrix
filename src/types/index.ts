export interface Task {
  id: string;
  title: string;
  description: string;
  urgency: number;
  importance: number;
  date: Date;
  notificationDate?: Date;  
  notificationId?: string;  
}

export interface CompletedTask extends Task {
  completedDate: Date;
}