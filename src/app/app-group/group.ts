import { Task } from '../app-task/task';

export class Group {
  _id: string;
  title: string;
  boardId: string;
  order: number;
  tasks?: Task[];
}
