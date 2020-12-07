import { Request, Response } from 'express';
import { ModalityService } from '../services/ModalityService';
import { Container } from 'typedi';
import { Modality } from '../entities/Modality';
import { validate } from 'class-validator';

class ModalityController {
  static fetch = async (req: Request, res: Response) => {
    const modalityService = Container.get(ModalityService);
    const modalities = await modalityService.findAll();
    res.status(200).send(modalities);
  }

  static store = async (req: Request, res: Response) => {
    const modalityService = Container.get(ModalityService);
    const { type }: { type: string } = req.body;

    const modality = new Modality();
    modality.type = type;

    const modalityErrors = await validate(modality);
    if (modalityErrors.length > 0) {
      res.status(400).send(modalityErrors);
      return;
    }

    try {
      await modalityService.create(modality);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear la modalidad '});
      return;
    }
    res.status(201).json({ message: 'Modalidad creada correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const modalityService = Container.get(ModalityService);
    const id: number = Number(req.params.id);
    const { type }: { type: string } = req.body;

    const modality = await modalityService.findById(id);
    if (!modality) {
      res.status(404).json({ message: 'Modalidad no encontrada '});
      return;
    }

    modality.type = type;

    const modalityErrors = await validate(modality);
    if (modalityErrors.length > 0) {
      res.status(400).send(modalityErrors);
      return;
    }

    try {
      await modalityService.update(modality);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar la modalidad '});
      return;
    }

    res.status(200).json({ message: 'Modalidad actualizada' });
  }

  static show = async (req: Request, res: Response) => {
    const modalityService = Container.get(ModalityService);
    const id: number = Number(req.params.id);
    const modality = await modalityService.findById(id);
    if (!modality) {
      res.status(404).json({ message: 'Modalidad no encontrada '});
      return;
    }
    res.status(200).send(modality);
  }

  static destroy = async (req: Request, res: Response) => {
    const modalityService = Container.get(ModalityService);
    const id: number = Number(req.params.id);
    const modality = await modalityService.findById(id);
    if (!modality) {
      res.status(404).json({ message: 'Modalidad no encontrada '});
      return;
    }
    await modalityService.delete(id);
    res.status(204).send();
  }
}

export default ModalityController;
