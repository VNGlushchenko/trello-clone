import { Group } from '../app-group/group';
import { Task } from '../app-task/task';

export class Board {
  _id: string;
  title: string;
  groups: Group[];
  tasks: Task[];
}
