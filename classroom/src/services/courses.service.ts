import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

import { PrismaService } from '../database/prisma/prisma.service';

type CreateCourseParams = {
  title: string;
};

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  getAllCourses() {
    return this.prisma.course.findMany();
  }

  getCourseById(id: string) {
    return this.prisma.course.findUnique({
      where: {
        id,
      },
    });
  }

  async createCourse({ title }: CreateCourseParams) {
    const slug = slugify(title, { lower: true });

    const courseAlreadyExists = await this.prisma.course.findUnique({
      where: {
        slug,
      },
    });

    if (courseAlreadyExists) {
      throw new Error('Course already exists.');
    }

    return this.prisma.course.create({
      data: {
        slug,
        title,
      },
    });
  }
}
