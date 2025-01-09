import { PrismaClient, UserSex } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create Grades
  const grade1 = await prisma.grade.create({
    data: {
      level: 1,
    },
  })

  const grade2 = await prisma.grade.create({
    data: {
      level: 2,
    },
  })

  // Create Classes
  const class1A = await prisma.class.create({
    data: {
      name: '1-A',
      capacity: 30,
      gradeId: grade1.id,
    },
  })

  const class2A = await prisma.class.create({
    data: {
      name: '2-A',
      capacity: 30,
      gradeId: grade2.id,
    },
  })

  // Create Subjects
  const mathSubject = await prisma.subject.create({
    data: {
      name: 'Mathematics',
    },
  })

  const scienceSubject = await prisma.subject.create({
    data: {
      name: 'Science',
    },
  })

  // Create a Teacher
  const teacher = await prisma.teacher.create({
    data: {
      id: 'teacher1',
      username: 'teacher1',
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@school.com',
      phone: '1234567890',
      address: '123 School Street',
      bloodType: 'A+',
      sex: UserSex.MALE,
      birthday: new Date('1980-01-01'),
      subjects: {
        connect: [{ id: mathSubject.id }, { id: scienceSubject.id }],
      },
      classes: {
        connect: [{ id: class1A.id }],
      },
    },
  })

  // Create a Parent
  const parent = await prisma.parent.create({
    data: {
      id: 'parent1',
      username: 'parent1',
      name: 'Jane',
      surname: 'Smith',
      email: 'jane.smith@email.com',
      phone: '0987654321',
      address: '456 Parent Avenue',
    },
  })

  // Create a Student
  const student = await prisma.student.create({
    data: {
      id: 'student1',
      username: 'student1',
      name: 'Tom',
      surname: 'Smith',
      email: 'tom.smith@school.com',
      phone: '1122334455',
      address: '456 Parent Avenue',
      bloodType: 'B+',
      sex: UserSex.MALE,
      birthday: new Date('2010-05-15'),
      parentId: parent.id,
      classId: class1A.id,
      gradeId: grade1.id,
    },
  })

  // Create Lessons
  const mathLesson = await prisma.lesson.create({
    data: {
      name: 'Mathematics 101',
      day: 'MONDAY',
      startTime: new Date('2024-01-01T09:00:00Z'),
      endTime: new Date('2024-01-01T10:30:00Z'),
      subjectId: mathSubject.id,
      classId: class1A.id,
      teacherId: teacher.id,
    },
  })

  // Create an Event
  await prisma.event.create({
    data: {
      title: 'School Opening Ceremony',
      description: 'Annual school opening ceremony',
      startTime: new Date('2024-01-15T08:00:00Z'),
      endTime: new Date('2024-01-15T10:00:00Z'),
      classId: class1A.id,
    },
  })

  // Create an Announcement
  await prisma.announcement.create({
    data: {
      title: 'Welcome Back!',
      description: 'Welcome to the new school year',
      date: new Date(),
      classId: class1A.id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
