import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { CreateTaskDto } from 'src/modules/tasks/dto/create.dto';
import { QueryTasksDto } from 'src/modules/tasks/dto/query.dto';
import { UpdateTaskDto } from 'src/modules/tasks/dto/update.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryTasksDto) {
    const where: Prisma.TaskWhereInput = {};

    if (query.search) {
      where.OR = [
        {
          title: { contains: query.search, mode: 'insensitive' },
        },
        {
          description: { contains: query.search, mode: 'insensitive' },
        },
      ];
    }

    if (query.authorId) {
      where.ownerId = Number(query.authorId);
    }

    if (query.quickFilter === 'active') {
      where.isCompleted = false;
    }

    if (query.quickFilter === 'completed') {
      where.isCompleted = true;
    }

    if (query.quickFilter === 'overdue') {
      where.isCompleted = false;
      where.dueDate = { lt: new Date() };
    }

    const orderBy =
      query.sortBy === 'status'
        ? { isCompleted: query.sortOrder }
        : { [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc' };

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          owner: { select: { id: true, name: true, email: true, role: true } },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      items,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  create(userId: number, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: { ...dto, dueDate: new Date(dto.dueDate), ownerId: userId },
    });
  }

  async update(
    id: number,
    user: { sub: number; role: Role },
    dto: UpdateTaskDto,
  ) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Задач не найдена');
    }

    const isAdmin = task.ownerId === user.sub || user.role === 'ADMIN';

    if (!isAdmin) {
      throw new ForbiddenException('Нет доступа');
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async remove(id: number, user: { sub: number; role: Role }) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Задач не найдена');
    }

    const isAdmin = task.ownerId === user.sub || user.role === 'ADMIN';

    if (!isAdmin) {
      throw new ForbiddenException('Нет доступа');
    }

    return this.prisma.task.delete({ where: { id } });
  }
}
