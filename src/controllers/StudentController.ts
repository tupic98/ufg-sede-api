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
import transporter from '../providers/nodemailer';

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
    qualification.recoverEnabled = recoveryEnabled ? recoveryEnabled : false;
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

  static studentInformation = async (req: Request, res: Response) => {
    const {
      sedeCode,
      centerCode,
      sedeName,
      studentFirstName,
      studentLastName,
      studentGender,
      studentBirthdate,
      studentDUI,
      studentNIE,
      studentGenderIdentity,
      studentNationality,
      studentMaritalStatus,
      studentTransport,
      studentDistance,
      studentJobStatus,
      studentOccupation,
      studentDiscapacity,
      studentDeported,
      studentAddress,
      studentResidenceType,
      studentResidencePhoneNumber,
      studentPhoneNumber,
      studentWorkPhoneNumber,
      studentEmail,
      familyMembersQuantity,
      livingWith,
      economicallyDependsFrom,
      hasChild,
      lastTakenGrade,
      lastTakenGradeYear,
      takenInstitutionType,
      institutionCode,
      takenInstitution,
    }: {
        sedeCode: string;
        centerCode: string;
        sedeName: string;
        studentFirstName: string;
        studentLastName: string;
        studentGender: string;
        studentBirthdate: string;
        studentDUI: string;
        studentNIE: string;
        studentGenderIdentity: string;
        studentNationality: string;
        studentMaritalStatus: string;
        studentTransport: string;
        studentDistance: string;
        studentJobStatus: string;
        studentOccupation: string;
        studentDiscapacity: string;
        studentDeported: string;
        studentAddress: string;
        studentResidenceType: string;
        studentResidencePhoneNumber: string;
        studentPhoneNumber: string;
        studentWorkPhoneNumber: string;
        studentEmail: string;
        familyMembersQuantity: string;
        livingWith: string;
        economicallyDependsFrom: string;
        hasChild: string;
        lastTakenGrade: string;
        lastTakenGradeYear: string;
        takenInstitutionType: string;
        institutionCode: string;
        takenInstitution: string;
      } = req.body;
    
    const html = `
      <h1>
        Reserva de matricula ${studentFirstName} ${studentLastName || ''}
      </h1> <br>
      <h2>Datos de sede</h2>
      <table style="border: none">
        <tr>
          <td> <h3> Código de centro: </h3> </td>
          <td> ${centerCode || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Código de sede: </h3> </td>
          <td> ${sedeCode || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Nombre de la sede: </h3> </td>
          <td> ${sedeName || '-'} </td>
        </tr>
      </table>
      <br>
      <h2>Datos personales</h2>
      <table style="border: none">
        <tr>
          <td> <h3> Nombres: </h3> </td>
          <td> ${studentFirstName || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Apellidos: </h3> </td>
          <td> ${studentLastName || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Sexo: </h3> </td>
          <td> ${studentGender || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Fecha de nacimiento: </h3> </td>
          <td> ${studentBirthdate || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Número de DUI: </h3> </td>
          <td> ${studentDUI || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Número de NIE: </h3> </td>
          <td> ${studentNIE || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Identidad de género: </h3> </td>
          <td> ${studentGenderIdentity || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Nacionalidad: </h3> </td>
          <td> ${studentNationality || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Estado Familiar: </h3> </td>
          <td> ${studentMaritalStatus || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Medio de transporte: </h3> </td>
          <td> ${studentTransport || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Distancia en kilometros para llegar al centro: </h3> </td>
          <td> ${studentDistance || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Trabaja: </h3> </td>
          <td> ${studentJobStatus || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Ocupación: </h3> </td>
          <td> ${studentOccupation || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Discapacidad: </h3> </td>
          <td> ${studentDiscapacity || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Retornado </h3> </td>
          <td> ${studentDeported || '-'} </td>
        </tr>
      </table>
      <br>
      <h2>Datos de residencia</h2>
      <table style="border: none">
        <tr>
          <td> <h3> Dirección: </h3> </td>
          <td> ${studentAddress || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Zona de residencia: </h3> </td>
          <td> ${studentResidenceType || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Teléfono de residencia: </h3> </td>
          <td> ${studentResidencePhoneNumber || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Teléfono celular: </h3> </td>
          <td> ${studentPhoneNumber || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Teléfono de trabajo: </h3> </td>
          <td> ${studentWorkPhoneNumber || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Correo Electrónico: </h3> </td>
          <td> ${studentEmail || '-'} </td>
        </tr>
      </table>
      <br>
      <h2>Datos sobre situación familiar</h2>
      <table style="border: none">
        <tr>
          <td> <h3> Número de miembros de la familia: </h3> </td>
          <td> ${familyMembersQuantity || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Convivencia: </h3> </td>
          <td> ${livingWith || '-'} </td>
        </tr>
        <tr>
          <td> <h3> De quien depende económicamente: </h3> </td>
          <td> ${economicallyDependsFrom || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Tiene hijos: </h3> </td>
          <td> ${hasChild || '-'} </td>
        </tr>
      </table>
      <br>
      <h2>Estudios realizados</h2>
      <table style="border: none">
        <tr>
          <td> <h3> Último grado cursado: </h3> </td>
          <td> ${lastTakenGrade || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Año en el que cursó su último grado: </h3> </td>
          <td> ${lastTakenGradeYear || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Institución en donde lo cursó: </h3> </td>
          <td> ${takenInstitutionType || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Código de la institución: </h3> </td>
          <td> ${institutionCode || '-'} </td>
        </tr>
        <tr>
          <td> <h3> Nombre del centro educativo: </h3> </td>
          <td> ${takenInstitution || '-'} </td>
        </tr>
      </table>
    `
    
    const mailOptions = {
     from: process.env.MAIL_FROM_EMAIL,
     to: process.env.MAIL_TO_EMAIL,
     subject: `Reserva de matrícula - ${studentFirstName} ${studentLastName}`,
     html,
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        res.status(400).json(error);
      } else {
        res.status(200).json({
          response: info.response,
        })
      }   
    });
  }
}

export default StudentController;
