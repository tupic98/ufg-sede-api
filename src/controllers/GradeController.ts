import { Request, Response } from 'express';
import { Container } from "typedi";
import { GradeService } from "../services/GradeService";
import { Grade } from "../entities/Grade";
import { validate } from "class-validator";

class GradeController {
  static fetch = async (req: Request, res: Response) => {
    const gradeService = Container.get(GradeService);
    const grades = await gradeService.findAll();
    res.status(200).send(grades);
  }

  static list = async (req: Request, res: Response) => {
    const gradeService = Container.get(GradeService);
    const grades = await gradeService.listAll();
    res.status(200).send(grades);
  }

  static store = async (req: Request, res: Response) => {
    const gradeService = Container.get(GradeService);
    const {
      name,
      institutionalPercentage,
      externalPercentage,
    }: {
      name: string,
      institutionalPercentage: number,
      externalPercentage: number,
    } = req.body;

    const grade = new Grade();
    grade.grade = name;
    grade.externalPercentage = externalPercentage;
    grade.institutionalPercentage = institutionalPercentage;

    const gradeErrors = await validate(grade);
    if (gradeErrors.length > 0) {
      res.status(400).send(gradeErrors);
      return;
    }

    try {
      await gradeService.create(grade);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el grado '});
      return;
    }

    res.status(201).json({ message: 'Grado creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const gradeService = Container.get(GradeService);
    const id: number = Number(req.params.id);

    const {
      name,
      institutionalPercentage,
      externalPercentage,
    }: {
      name: string,
      institutionalPercentage: number,
      externalPercentage: number,
    } = req.body;

    const grade = await gradeService.findById(id);
    if (!grade) {
      res.status(400).json({ message: 'Grado no encontrado '});
      return;
    }

    grade.grade = name;
    grade.externalPercentage = externalPercentage;
    grade.institutionalPercentage = institutionalPercentage;

    const gradeErrors = await validate(grade);
    if (gradeErrors.length > 0) {
      res.status(400).send(gradeErrors);
      return;
    }

    try {
      await gradeService.update(grade);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actializar el grado'});
      return;
    }

    res.status(200).json({ message: 'Grado actualizado' });
  }

  static show = async (req: Request, res: Response) => {
    const gradeService = Container.get(GradeService);
    const id: number = Number(req.params.id);

    const grade = await gradeService.findByIdWithRelations(id);
    if (!grade) {
      res.status(404).json({ message: 'Grado no encontrado'});
      return;
    }
    res.status(200).send(grade);
  }

  static destroy = async (req: Request, res: Response) => {
    const gradeService = Container.get(GradeService);
    const id: number = Number(req.params.id);

    const grade = await gradeService.findById(id);
    if (!grade) {
      res.status(404).json({ message: 'Grado no encontrado'});
      return;
    }
    await gradeService.delete(id);
    res.status(204).send();
  }
}

export default GradeController;
