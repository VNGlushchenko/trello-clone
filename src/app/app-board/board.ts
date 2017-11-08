import { Task } from '../app-task/task';
import { Group } from '../app-group/group';

export class Board {
  _id: string;
  title: string;
  groups: Group[];
}
