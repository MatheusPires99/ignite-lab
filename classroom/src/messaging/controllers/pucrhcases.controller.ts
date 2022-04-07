import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { NEW_PURCHASE_TOPIC } from '../../constants/kafka-topics';
import { CoursesService } from '../../services/courses.service';
import { EnrollmentsService } from '../../services/enrollments.service';
import { StudentsService } from '../../services/students.service';

type PurchaseCreatedPayload = {
  customer: {
    authUserId: string;
  };
  product: {
    id: string;
    title: string;
    slug: string;
  };
};

@Controller()
export class PurchasesController {
  constructor(
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  @EventPattern(NEW_PURCHASE_TOPIC)
  async purchaseCreated(@Payload('value') payload: PurchaseCreatedPayload) {
    const { customer, product } = payload;

    let student = await this.studentsService.getStudentByAuthUserId(
      customer.authUserId,
    );

    if (!student) {
      student = await this.studentsService.createStudent({
        authUserId: customer.authUserId,
      });
    }

    let course = await this.coursesService.getCourseBySlug(product.slug);

    if (!course) {
      course = await this.coursesService.createCourse({
        title: product.title,
        slug: product.slug,
      });
    }

    await this.enrollmentsService.createEnrollment({
      courseId: course.id,
      studentId: student.id,
    });
  }
}
