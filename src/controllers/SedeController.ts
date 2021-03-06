import { SedeService } from './../services/SedeService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { Sede } from '../entities/Sede';
import { validate } from 'class-validator';

class SedeController {
  static fetch = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const sedeList = await sedeService.findAll();
    res.status(200).send(sedeList);
  }

  static list = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const sedeList = await sedeService.listAll();
    res.status(200).send(sedeList);
  }

  static store = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const { name, logo, code, address, active }: { name: string, logo: string, code: string, address: string, active: boolean } = req.body;

    const sede = new Sede();
    sede.name = name;
    sede.logo = logo;
    sede.code = code;
    sede.address = address;
    sede.active = active;

    const sedeErrors = await validate(sede);
    if (sedeErrors.length > 0) {
      res.status(400).send(sedeErrors);
      return;
    }

    if (active) {
      const currentActive = await sedeService.findActive();
      if (currentActive && currentActive.active) {
        currentActive.active = false;

        await sedeService.update(currentActive);
      }
    }

    try {
      await sedeService.create(sede);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear la sede'});
      return;
    }
    res.status(201).json({ message: 'Sede creada correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const id: number = Number(req.params.id);
    const { name, logo, code, address, active }: { name: string, logo: string, code: string, address: string, active: boolean } = req.body;

    const sede = await sedeService.findById(id);
    if (!sede) {
      res.status(404).json({ message: 'Sede no encontrada '});
      return;
    }

    sede.name = name;
    sede.logo = logo;
    sede.code = code;
    sede.address = address;
    sede.active = active;

    const sedeErrors = await validate(sede);
    if (sedeErrors.length > 0) {
      res.status(400).send(sedeErrors);
      return;
    }

    if (active) {
      const currentActive = await sedeService.findActive();
      if (currentActive && currentActive.active) {
        currentActive.active = false;

        await sedeService.update(currentActive);
      }
    }

    try {
      await sedeService.update(sede);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar la sede'});
      return;
    }

    res.status(200).json({ message: 'Sede actualizada' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const sedeService = Container.get(SedeService);
    const sede = await sedeService.findById(id);
    if (!sede) {
      res.status(404).json({ message: 'Sede no encontrada '});
      return;
    }
    res.status(200).send(sede);
  }

  static sedeInformation = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const sede = await sedeService.findActive();
    if (!sede) {
      res.status(404).json({ message: 'Sede no encontrada' });
      return;
    }
    res.status(200).send(sede);
  }

  static destroy = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const id: number = Number(req.params.id);
    const sede = await sedeService.findById(id);
    if (!sede) {
      res.status(404).json({ message: 'Sede no encontrada'});
      return;
    }
    await sedeService.delete(id);
    res.status(204).send();
  }
}

export default SedeController;
