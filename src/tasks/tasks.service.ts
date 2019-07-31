import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './types/task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const searchedTask = await this.taskRepository.findOne({
      where: { id, userId: user.id }
    });
    if (!searchedTask) {
      throw new NotFoundException(`Task with id ${id} does not exist`);
    }

    return searchedTask;
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    const { affected } = await this.taskRepository.delete({
      id,
      userId: user.id
    });
    if (!affected) {
      throw new NotFoundException(`Task with id ${id} does not exist`);
    }
  }

  async updateTask(id: number, status: TaskStatus, user: User): Promise<Task> {
    const targetTask = await this.getTaskById(id, user);
    targetTask.status = status;
    await this.taskRepository.save(targetTask);
    return targetTask;
  }
}
