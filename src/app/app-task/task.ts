export class Task {
  _id?: string;
  title?: string;
  description?: string;
  dueDate?: Date;
  boardId?: string;
  groupId: string;
  order: number;
}
