import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

type GetByCourseAndStudentIdParams = {
  courseId: string;
  studentId: string;
};

type CreateEnrollmentParams = {
  courseId: string;
  studentId: string;
};

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  getAllEnrollments() {
    return this.prisma.enrollment.findMany({
      where: {
        cancelledAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getEnrollmentByCourseAndStudentId({
    courseId,
    studentId,
  }: GetByCourseAndStudentIdParams) {
    return this.prisma.enrollment.findFirst({
      where: {
        courseId,
        studentId,
        cancelledAt: null,
      },
    });
  }

  getAllEnrollmentsByStudentId(studentId: string) {
    return this.prisma.enrollment.findMany({
      where: {
        studentId,
        cancelledAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  createEnrollment({ courseId, studentId }: CreateEnrollmentParams) {
    return this.prisma.enrollment.create({
      data: {
        courseId,
        studentId,
      },
    });
  }
}
