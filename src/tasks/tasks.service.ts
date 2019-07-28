import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search)
      );
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const newTask: Task = {
      title,
      description,
      status: TaskStatus.OPEN,
      id: uuid()
    };

    this.tasks = [...this.tasks, newTask];

    return newTask;
  }

  getTaskById(id: string): Task {
    const searchedTask = this.tasks.find((task) => task.id === id);

    if (!searchedTask) {
      throw new NotFoundException(`Task with id ${id} does not exist`);
    }

    return searchedTask;
  }

  deleteTaskById(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }

  updateTask(id: string, status: TaskStatus): Task {
    const targetTask = this.getTaskById(id);
    targetTask.status = status;
    return targetTask;
  }
}
