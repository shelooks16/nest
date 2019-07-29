import { TaskStatus } from '../types/task-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.IN_PROGRESS, TaskStatus.OPEN, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
