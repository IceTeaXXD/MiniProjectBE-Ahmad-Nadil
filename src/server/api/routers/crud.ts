import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const crudRouter = createTRPCRouter({
  getStudentsWithCoursesOnId: publicProcedure
    .input(z.object({ studentId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      // Expected output: data student berdasarkan id yang diberikan, kalau id tidak diberikan, fetch semua data
      if (!input.studentId) {
        const students = await ctx.prisma.student.findMany({});
        return students;
      } else {
        const student = await ctx.prisma.student.findUnique({
          where: { student_id: input.studentId }
        });
        return student;
      }
    }),

  getAllCourses: publicProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
    // Expected output: seluruh data course yang ada
    return await ctx.prisma.course.findMany({});
  }),

  getStudentsListOnCourseId: publicProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: data course berdasarkan id yang diberikan beserta seluruh student id yang mengambil course tersebut
      const course = await ctx.prisma.enrollment.findUnique({
        where: { course_id: input.courseId },
        include: { student: true }
      });
    }),

  insertNewStudent: publicProcedure
    .input(z.object({ firstName: z.string(), lastName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di insert
      const student = await ctx.prisma.student.create({
        data: {
          first_name: input.firstName,
          last_name: input.lastName
        }
      });
      return student;
    }),

  insertNewCourse: publicProcedure
    .input(z.object({ name: z.string(), credits: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di insert
      const course = await ctx.prisma.course.create({
        data: {
          name: input.name,
          credits: input.credits
        }
      });
      return course;
    }),

  enrollNewStudent: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di insert, enrollment_date mengikuti waktu ketika fungsi dijalankan
      const enrollment = await ctx.prisma.enrollment.create({
        data: {
          student_id: input.studentId,
          course_id: input.courseId
        }
      });
      return enrollment;
    }),

  updateCourseData: publicProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        name: z.string().optional(),
        credits: z.number().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di update berdasarkan courseId yang diberikan, apabila name atau credits tidak diberikan, tidak usah di update
      const course = await ctx.prisma.course.update({
        where: { course_id: input.courseId },
        data: {
          name: input.name,
          credits: input.credits
        }
      });
      return course;
    }),

    removeStudentfromCourse: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di delete
      const enrollment = await ctx.prisma.enrollment.delete({
        where: {
          student_id_course_id: {
            student_id: input.studentId,
            course_id: input.courseId
          }
        }
      });
      return enrollment;
    })
});