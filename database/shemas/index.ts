import { appSchema } from "@nozbe/watermelondb";
import { taskSchema } from "./task.schema";

export const schemas = appSchema(
  {
    version: 1,
    tables: [
      taskSchema
    ]
  }
)