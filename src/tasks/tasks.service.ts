import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskRepository } from './/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './types/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const searchedTask = await this.taskRepository.findOne(id);
    if (!searchedTask) {
      throw new NotFoundException(`Task with id ${id} does not exist`);
    }

    return searchedTask;
  }

  async deleteTaskById(id: number): Promise<void> {
    const { affected } = await this.taskRepository.delete(id);
    if (!affected) {
      throw new NotFoundException(`Task with id ${id} does not exist`);
    }
  }

  async updateTask(id: number, status: TaskStatus): Promise<Task> {
    const targetTask = await this.getTaskById(id);
    targetTask.status = status;
    await this.taskRepository.save(targetTask);
    return targetTask;
  }
}
