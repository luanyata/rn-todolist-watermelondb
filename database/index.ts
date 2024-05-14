import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { TaskModel } from './models/task.model';
import { schemas } from "./shemas";

const adapter = new SQLiteAdapter({
  dbName: 'todo-database',
  schema: schemas,
});


export const database = new Database({
  adapter,
  modelClasses: [TaskModel],
});