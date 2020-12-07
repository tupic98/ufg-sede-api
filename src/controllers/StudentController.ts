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

    student.code = `${sede.code.toUpperCase()}${userCode}`
    student.grade = grade;
    student.section = section;
    student.modality = modality;
    student.person = person;
    student.firstTime = firstTime;
    student.report = report;
    student.year = year;

    const studentErrors = await validate(student);
    if (studentErrors.length > 0) {
      res.status(400).send(studentErrors);
      return;
    }

    try {
      await studentService.create(student);
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
        if (!modules?.[q.module.moduleNumber]) {
          Reflect.set(modules, q.module.moduleNumber, []);
        }
        const { module, ...res } = q;
        modules[q.module.moduleNumber].push({
          subject: s.subject.name,
          ...res,
        })
      })
    })

    const studentData = {
      ...rest,
      ...person,
      modality: rest.modality.type,
      section: rest.section.name,
      grade: rest.grade.grade,
    }

    res.status(200).send({
      ...studentData,
      modules,
    });
  }
}

export default StudentController;
