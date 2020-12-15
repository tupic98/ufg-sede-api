import { StudentService } from './../services/StudentService';
import { Request, Response } from "express";
import { Student } from "../entities/Student";
import { SedeService } from "../services/SedeService";
import { ModalityService } from "../services/ModalityService";
import { SectionService } from "../services/SectionService";
import { GradeService } from "../services/GradeService";
import { Person } from "../entities/Person";
import { validate } from "class-validator";
import { Container } from "typedi";
import { PersonService } from "../services/PersonService";
import { SubjectService } from '../services/SubjectService';
import { Subject } from '../entities/Subject';
import { SubjectToStudent } from '../entities/SubjectToStudent';
import { SubjectToStudentService } from '../services/SubjectToStudentService';
import { ModuleService } from '../services/ModuleService';
import { QualificationService } from '../services/QualificationService';
import { Qualification } from '../entities/Qualification';
import { UserService } from '../services/UserService';

class StudentController {
  static fetch = async (req: Request, res: Response) => {
    const studentService = Container.get(StudentService);
    const students = await studentService.findAll();
    res.status(200).send(students);
  }

  static show = async (req: Request, res: Response) => {
    const studentService = Container.get(StudentService);
    const id: number = Number(req.params.id);

    const student = await studentService.findByIdWithRelation(id);
    if (!student) {
      res.status(404).json({ message: 'Estudiante no encontrado '});
      return;
    }
    res.status(200).send(student);
  }

  static store = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const gradeService = Container.get(GradeService);
    const studentService = Container.get(StudentService);
    const modalityService = Container.get(ModalityService);
    const sectionService = Container.get(SectionService);
    const subjectService = Container.get(SubjectService);
    const subjectToStudentService = Container.get(SubjectToStudentService);
    const moduleService = Container.get(ModuleService);
    const qualificationService = Container.get(QualificationService);
    const {
      year,
      report,
      firstName,
      lastName,
      code,
      status,
      sedeId,
      modalityId,
      sectionId,
      gradeId,

    }: {
      code: string,
      year: number,
      report: string,
      firstName: string,
      lastName: string,
      status: boolean,
      sedeId: number,
      modalityId: number,
      sectionId: number,
      gradeId: number,
    } = req.body;

    //Getting sede information
    const sede = await sedeService.findById(sedeId);
    if (!sede) {
      res.status(400).json({ message: 'La sede que intenta asignar no existe' });
      return;
    }

    //Getting modality information
    const modality = await modalityService.findById(modalityId);
    if (!modality) {
      res.status(400).json({ message: 'La modalidad que intenta asignar no existe' });
      return;
    }

    //Getting section information
    const section = await sectionService.findById(sectionId);
    if (!section) {
      res.status(400).json({ message: 'La sección que intenta asignar no existe' });
      return;
    }

    //Getting grade information
    const grade = await gradeService.findById(gradeId);
    if (!grade) {
      res.status(400).json({ message: 'El grado que intenta asignar no existe' });
      return;
    }

    let subjects: Subject[];
    try {
      subjects = await subjectService.listAllByGrade(gradeId);
    } catch (e) {
      res.status(500).json({ message: 'Error asignando materias', errors: e });
      return;
    }

    //Getting subjects information
    let userCode = '';
    firstName.split(' ').forEach((name: string) => {
      userCode = `${userCode}${name.slice(0, 1).toUpperCase()}`;
    })
    lastName.split(' ').forEach((name: string) => {
      userCode = `${userCode}${name.slice(0, 1).toUpperCase()}`
    })
    userCode = `${userCode}${year}`

    //Setting person information
    const person = new Person();
    person.username = userCode;
    person.firstName = firstName;
    person.lastName = lastName;
    person.status = status;
    person.sede = sede;

    const personErrors = await validate(person);

    if (personErrors.length > 0) {
      res.status(400).send(personErrors);
      return;
    }

    const student = new Student();

    student.approved = false;
    student.code = code;
    student.grade = grade;
    student.section = section;
    student.modality = modality;
    student.person = person;
    student.firstTime = true;
    student.report = report;
    student.year = year;

    const studentErrors = await validate(student);
    if (studentErrors.length > 0) {
      res.status(400).send(studentErrors);
      return;
    }

    const subjectToStudents: SubjectToStudent[] = [];
    const modules = await moduleService.listAll();
    let qualifications: Qualification[] = [];


    subjects.forEach((subject) => {
      console.log('Subject: ', subject);
      const subjectToStudent = new SubjectToStudent();
      subjectToStudent.student = student;
      subjectToStudent.subject = subject;
      subjectToStudent.student_code = student.code;
      subjectToStudents.push(subjectToStudent);
      modules.forEach((module) => {
        console.log('Module: ', module);
        if (subject.isExternalTest && +module.moduleNumber === 6984) {
          const qualification = new Qualification();
          qualification.approved = false;
          qualification.recoverEnabled = false;
          qualification.isExternalTest = true;
          qualification.subjectStudent = subjectToStudent;
          qualification.module = module;
          qualifications.push(qualification);
        } else if (!subject.isExternalTest && +module.moduleNumber !== 6984) {
          const qualification = new Qualification();
          qualification.approved = false;
          qualification.recoverEnabled = false;
          qualification.isExternalTest = false;
          qualification.subjectStudent = subjectToStudent;
          qualification.module = module;
        }
      })
    })

    try {
      await studentService.create(student);
      try {
        await subjectToStudentService.createVarious(subjectToStudents);
      } catch (e) {
        res.status(400).json({ message: 'Error asignando materias '});
        return;
      }
      try {
        await qualificationService.createVarious(qualifications);
      } catch (e) {
        res.status(400).json({ message: 'Error asignando calificaciones' });
      }
    } catch (error) {
      res.status(400).json({ message: 'No se pudo crear el estudiante '})
      return;
    }

    res.status(201).send('Estudiante creado correctamente');
  }

  static update = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const gradeService = Container.get(GradeService);
    const studentService = Container.get(StudentService);
    const modalityService = Container.get(ModalityService);
    const sectionService = Container.get(SectionService);
    const id: number = Number(req.params.id);

    const {
      year,
      report,
      firstTime,
      firstName,
      lastName,
      status,
      sedeId,
      modalityId,
      sectionId,
      gradeId,
      username,
      code,
    }: {
      year: number,
      report: string,
      firstTime: boolean,
      firstName: string,
      lastName: string,
      status: boolean,
      sedeId: number,
      modalityId: number,
      sectionId: number,
      gradeId: number,
      username?: string,
      code?: string,
    } = req.body;

    //Getting student information
    const student = await studentService.findById(id);
    if (!student) {
      res.status(404).json({ message: 'Estudiante no encontrado '})
      return;
    }

    //Getting sede information
    const sede = await sedeService.findById(sedeId);
    if (!sede) {
      res.status(400).json({ message: 'La sede que intenta asignar no existe' });
      return;
    }

    //Getting modality information
    const modality = await modalityService.findById(modalityId);
    if (!modality) {
      res.status(400).json({ message: 'La modalidad que intenta asignar no existe' });
      return;
    }

    //Getting section information
    const section = await sectionService.findById(sectionId);
    if (!section) {
      res.status(400).json({ message: 'La sección que intenta asignar no existe' });
      return;
    }

    //Getting grade information
    const grade = await gradeService.findById(gradeId);
    if (!grade) {
      res.status(400).json({ message: 'El grado que intenta asignar no existe' });
      return;
    }

    //Setting person information
    if (username) {
      student.person.username = username;
    }
    student.person.firstName = firstName;
    student.person.lastName = lastName;
    student.person.status = status;
    student.person.sede = sede;

    const personErrors = await validate(student.person);

    if (personErrors.length > 0) {
      res.status(400).send(personErrors);
      return;
    }

    if (code) {
      student.code = code;
    }
    student.grade = grade;
    student.section = section;
    student.modality = modality;
    student.firstTime = firstTime;
    student.report = report;
    student.year = year;

    const studentErrors = await validate(student);
    if (studentErrors.length > 0) {
      res.status(400).send(studentErrors);
      return;
    }

    try {
      await studentService.update(student);
    } catch (error) {
      res.status(400).json({ message: 'No se pudo actualizar el estudiante '})
      return;
    }

    res.status(200).send('Estudiante actualizado correctamente');
  }

  static destroy = async (req: Request, res: Response) => {
    const studentService = Container.get(StudentService);
    const id: number = Number(req.params.id);

    const student = await studentService.findById(id);
    if (!student) {
      res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    await studentService.delete(id);
    res.status(204).send();
  }

  static updateContact = async (req: Request, res: Response) => {
    const studentService = Container.get(StudentService);
    const personService = Container.get(PersonService);
    const studentId = res.locals.jwtPayload.studentId;
    const { phoneNumber, email, altPhoneNumber }: { phoneNumber: string, email: string, altPhoneNumber: string } = req.body;

    const student = await studentService.findByIdWithRelation(studentId);
    if (!student) {
      res.status(404).json({ message: 'Estudiante no encontrado' });
      return;
    }

    const person = await personService.findByIdWithRelation(student.person.id);
    if (!person) {
      res.status(404).json({ message: 'Estudiante no encontrado '});
      return;
    }

    person.phoneNumber = phoneNumber ? phoneNumber : null;
    person.email = email ? email : null;
    person.altPhoneNumber = altPhoneNumber ? altPhoneNumber : null;

    const personErrors = await validate(student.person);

    if (personErrors.length > 0) {
      res.status(400).send(personErrors);
      return;
    }

    console.log('Person: ', person);
    console.log('Student: ', student);

    student.person = person;
    student.firstTime = false;

    const studentErrors = await validate(student);
    if (studentErrors.length > 0) {
      res.status(400).send(studentErrors);
      return;
    }

    try {
      await personService.update(person);
      await studentService.update(student);
    } catch (error) {
      res.status(400).json({ message: 'No se pudo actualizar el contacto del estudiante', error })
      return;
    }

    res.status(200).json({ message: 'Contacto de estudiante actualizado correctamente' });
  }

  static me = async (req: Request, res: Response) => {
    const studentService = Container.get(StudentService);
    const code = res.locals.jwtPayload.code;

    const student = await studentService.findByCode(code);
    if (!student) {
      res.status(404).json({ message: 'Estudiante no encontrado' });
      return;
    }

    const { person, ...rest } = student;

    res.status(200).send({
      ...rest,
      ...person,
      id: rest.id,
    });
  }

  static showByCode = async (req: Request, res: Response) => {
    const studentService = Container.get(StudentService);
    const code = res.locals.jwtPayload.code;

    const student = await studentService.findByCodeWithRelation(code);
    if (!student) {
      res.status(404).json({ message: 'Estudiante no encontrado' });
      return;
    }
    const { subjectQualifications, person, ...rest } = student;

    const modules = {}

    subjectQualifications.map((s) => {
      s.qualifications.map((q) => {
        const moduleName = +q.module.moduleNumber === 6984 ? 'externalTest' : q.module.moduleNumber;
        if (!modules[q.module.moduleNumber]) {
          Reflect.set(modules, moduleName, []);
        }
        const { module, ...res } = q;

        modules[moduleName].push({
          module: moduleName,
          subject: s.subject.name,
          ...res,
        })
      })
    })

    const studentData = {
      ...rest,
      ...person,
      id: rest.id,
      modality: rest.modality.type,
      section: rest.section.name,
      grade: rest.grade.grade,
    }

    res.status(200).send({
      ...studentData,
      modules,
    });
  }

  static assignNewSubject = async (req: Request, res: Response) => {
    const studentService = Container.get(StudentService);
    const subjectToStudentService = Container.get(SubjectToStudentService);
    const qualificationService = Container.get(QualificationService);
    const moduleService = Container.get(ModuleService);
    const subjectService = Container.get(SubjectService);
    const id: number = Number(req.params.id);
    const { subjectId }: { subjectId: number } = req.body;

    const student = await studentService.findById(id);
    if (!student) {
      res.status(404).json({ message: 'Estudiante no encontrado' });
      return
    }

    const subject = await subjectService.findById(subjectId);
    if (!subject) {
      res.status(404).json({ message: 'Materia no encontrada' });
      return
    }

    const subjectToStudent = new SubjectToStudent();
    subjectToStudent.student = student;
    subjectToStudent.student_code = student.code;
    subjectToStudent.subject = subject;

    const modules = await moduleService.listAll();
    let qualifications: Qualification[] = [];
    modules.forEach((module) => {
      if (subject.isExternalTest && +module.moduleNumber === 6984) {
        const qualification = new Qualification();
        qualification.approved = false;
        qualification.recoverEnabled = false;
        qualification.isExternalTest = true;
        qualification.subjectStudent = subjectToStudent;
        qualification.module = module;
        qualifications.push(qualification);
      } else if (!subject.isExternalTest && +module.moduleNumber !== 6984) {
        const qualification = new Qualification();
        qualification.approved = false;
        qualification.recoverEnabled = false;
        qualification.isExternalTest = false;
        qualification.subjectStudent = subjectToStudent;
        qualification.module = module;
      }
    })
    try {
      await subjectToStudentService.create(subjectToStudent);
      await qualificationService.createVarious(qualifications);
      res.status(200).json({ message: 'Materia asignada correctamente' });
    } catch (e) {
      res.status(400).json({ message: 'No se pudo asignar la materia', e });
    }
  }

  static fetchNotes = async (req: Request, res: Response) => {
    const studentService = Container.get(StudentService);

    const id: number = Number(req.params.id);

    const student = await studentService.findByIdWithNotesRelations(id);
    if (!student) {
      res.status(404).json({ message: 'Estudiante no encontrado' });
      return;
    }
    // @ts-ignore
    const { subjectQualifications, person, ...rest } = student;

    const modules = {}

    subjectQualifications.map((s) => {
      s.qualifications.map((q) => {
        const moduleName = +q.module.moduleNumber === 6984 ? 'externalTest' : q.module.moduleNumber;
        if (!modules[q.module.moduleNumber]) {
          Reflect.set(modules, moduleName, []);
        }
        const { module, ...res } = q;

        modules[moduleName].push({
          module: moduleName,
          subject: s.subject.name,
          ...res,
        })
      })
    })

    res.status(200).send({
      ...modules,
    });
  }

  static saveNotes = async (req: Request, res: Response) => {
    const qualificationService = Container.get(QualificationService);
    const userService = Container.get(UserService);
    // const id: number = Number(req.params.id);
    const { qualificationId, userId, note, recoveryLink, recoveryEnabled }: { qualificationId: number, userId: number, note: number, recoveryLink: string, recoveryEnabled: boolean } = req.body;

    const user = await userService.findByIdWithRelations(+userId);

    const qualification = await qualificationService.findById(qualificationId);
    if (!qualification) {
      res.status(400).json({ message: 'Error al actualizar la nota', error: 'Qualification not found' });
      return;
    }

    qualification.note = note;
    qualification.approved = +note >= 6.0;
    if (recoveryLink) {
      qualification.recoverLink = recoveryLink;
    }
    qualification.recoverEnabled = recoveryEnabled ?? false;
    if (user) {
      qualification.updatedBy = `${user.person.firstName} ${user.person.lastName}`
    }

    try {
      await qualificationService.update(qualification);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar la nota' });
      return;
    }

    res.status(200).json({ message: 'Nota actualizada correctamente' });
  }

  static subjects = async (req: Request, res: Response) => {
    const studentService = Container.get(StudentService);
    const subjectService = Container.get(SubjectService);
    const id: number = Number(req.params.id);

    const student = await studentService.findByIdWithRelation(id);
    if (!student) {
      res.status(404).json({ message: 'Estudiante no encontrado '});
      return;
    }

    const gradeId = student.grade.id;

    let subjects: Subject[];
    try {
      subjects = await subjectService.listAllByGrade(gradeId);
      res.status(200).send(subjects);
      return;
    } catch (e) {
      res.status(500).json({ message: 'Error obteniendo las materias', errors: e });
      return;
    }
  }

  static publish
}

export default StudentController;
