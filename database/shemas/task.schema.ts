import { tableSchema } from "@nozbe/watermelondb";

export const taskSchema = tableSchema({
  name: 'tasks',
  columns: [
    { name: 'task', type: 'string' },
    { name: 'is_completed', type: 'boolean' }
  ]
})