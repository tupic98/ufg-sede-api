import { Request, Response } from 'express';
import { SubjectService } from "../services/SubjectService";
import { Subject } from "../entities/Subject";
import { GradeService } from "../services/GradeService";
import { validate } from "class-validator";
import { Container } from "typedi";

class SubjectController {
  static fetch = async (req: Request, res: Response) => {
    const subjectService = Container.get(SubjectService);
    const subjects = await subjectService.findAll();
    res.status(200).send(subjects);
  }

  static list = async (req: Request, res: Response) => {
    const subjectService = Container.get(SubjectService);
    const subjects = await subjectService.listAll();
    res.status(200).send(subjects);
  }

  static store = async (req: Request, res: Response) => {
    const gradeService = Container.get(GradeService);
    const subjectService = Container.get(SubjectService);
    const { name, gradeId, externalTest }: { name: string; gradeId: number; externalTest: boolean } = req.body;

    //Getting grade information
    const grade = await gradeService.findById(gradeId);
    if (!grade) {
      res.status(400).json({ message: 'El grado que intenta asignar no existe' })
      return;
    }

    const subject = new Subject();
    subject.name = name;
    subject.grade = grade;
    subject.isExternalTest = externalTest;

    const subjectErrors = await validate(subject);
    if (subjectErrors.length > 0) {
      res.status(400).send(subjectErrors);
      return;
    }

    try {
      await subjectService.create(subject);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear la materia' });
      return;
    }

    res.status(201).json({ message: 'Materia creada correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const gradeService = Container.get(GradeService);
    const subjectService = Container.get(SubjectService);
    const id: number = Number(req.params.id);

    const { name, gradeId }: { name: string; gradeId: number } = req.body;

    const subject = await subjectService.findById(id);
    if (!subject) {
      res.status(404).json({ message: 'Materia no encontrada ' });
      return;
    }

    const grade = await gradeService.findById(gradeId);
    if (!grade) {
      res.status(400).json({ message: 'El grado que intenta asignar no existe ' });
      return;
    }

    subject.name = name;
    subject.grade = grade;

    const subjectErrors = await validate(subject);
    if (subjectErrors.length > 0) {
      res.status(400).send(subjectErrors);
      return;
    }

    try {
      await subjectService.update(subject);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar la materia ' });
      return;
    }

    res.status(200).json({ message: 'Materia actualizada' });
  }

  static show = async (req: Request, res: Response) => {
    const subjectService = Container.get(SubjectService);
    const id: number = Number(req.params.id);

    const subject = await subjectService.findByIdWithRelation(id);
    if (!subject) {
      res.status(404).json({ message: 'Materia no encontrada ' });
      return;
    }
    res.status(200).send(subject);
  }

  static destroy = async (req: Request, res: Response) => {
    const subjectService = Container.get(SubjectService);
    const id: number = Number(req.params.id);

    const subject = await subjectService.findById(id);
    if (!subject) {
      res.status(404).json({ message: 'Materia no encontrada' });
      return;
    }

    await subjectService.delete(id);
    res.status(204).send();
  }
}

export default SubjectController;
