import { SectionService } from './../services/SectionService';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import Container from 'typedi';
import { Section } from '../entities/Section';

class SectionController {
  static fetch = async (req: Request, res: Response) => {
    const sectionService = Container.get(SectionService);
    const sections = await sectionService.findAll();
    res.status(200).send(sections);
  }

  static list = async (req: Request, res: Response) => {
    const sectionService = Container.get(SectionService);
    const sections = await sectionService.listAll();
    res.status(200).send(sections);
  }

  static store = async (req: Request, res: Response) => {
    const sectionService = Container.get(SectionService);
    const { name }: { name: string } = req.body;

    const section = new Section();
    section.name = name;

    const sectionErrors = await validate(section);
    if (sectionErrors.length > 0) {
      res.status(400).send(sectionErrors);
      return;
    }

    try {
      await sectionService.create(section);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear la sección' });
    }

    res.status(201).send('Sección creada correctamente');
  }

  static update = async (req: Request, res: Response) => {
    const sectionService = Container.get(SectionService);
    const id: number = +req.params.id;
    const { name }: { name: string } = req.body;

    const section = await sectionService.findById(id);
    if (!section) {
      res.status(404).json({ message: 'Sección no encontrada' });
      return;
    }

    section.name = name;

    const sectionErrors = await validate(section);
    if (sectionErrors.length > 0) {
      res.status(400).send(sectionErrors);
      return;
    }

    try {
      await sectionService.update(section)
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar la sección' });
      return;
    }

    res.status(200).send('Sección actualizada');
  }

  static show = async (req: Request, res: Response) => {
    const sectionService = Container.get(SectionService);
    const id: number = +req.params.id;

    const section = await sectionService.findByIdWithRelations(id);
    if (!section) {
      res.status(404).json({ message: 'Sección no encontrada' });
      return;
    }
    res.status(200).send(section);
  }

  static destroy = async (req: Request, res: Response) => {
    const sectionService = Container.get(SectionService);
    const id: number = +req.params.id;

    const section = await sectionService.findById(id);
    if (!section) {
      res.status(404).json({ message: 'Sección no encontrada' });
      return;
    }
    await sectionService.delete(id);
    res.status(204).send();
  }
}

export default SectionController;
