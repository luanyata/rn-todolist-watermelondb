import { Model } from "@nozbe/watermelondb";
import { field } from '@nozbe/watermelondb/decorators';

export class TaskModel extends Model {
  static table = 'tasks';

  @field('task') task!: string;
  @field('is_completed') isCompleted!: boolean;

}