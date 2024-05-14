import { database } from '../';
import { TaskModel } from '../models/task.model';


export const createTask = async (task: string) => {
  await database.write(async () => {
    await database.get<TaskModel>('tasks').create((newTask) => {
      newTask.task = task
      newTask.isCompleted = false
    })
  })
}

export const updateTask = async (id: string, isCompleted: boolean) => {
  await database.write(async () => {
    const task = await database.get<TaskModel>('tasks').find(id)
    await task?.update((updatedTask) => {
      updatedTask.isCompleted = isCompleted
    })
  })
}

export const deleteTask = async (id: string) => {
  await database.write(async () => {
    const task = await database.get<TaskModel>('tasks').find(id)
    await task?.destroyPermanently()
  })
}

export const fetchTasks = async () => {
  const tasksCollection = database.get<TaskModel>('tasks')
  const tasks = await tasksCollection.query().fetch()
  return tasks
}

export const observableTasks = () => {
  const tasksCollection = database.get<TaskModel>('tasks')
  return tasksCollection.query().observe()
}
