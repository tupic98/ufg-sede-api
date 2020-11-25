import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ModuleService } from '../services/ModuleService';
import { Module } from '../entities/Module';
import { validate } from 'class-validator';

class ModuleController {
  static fetch = async (req: Request, res: Response) => {
    const moduleService = Container.get(ModuleService);
    const modules = await moduleService.findAll();
    res.status(200).send(modules);
  }

  static store = async (req: Request, res: Response) => {
    const moduleService = Container.get(ModuleService);
    const { moduleNumber }: { moduleNumber: number } = req.body;

    const module = new Module();
    module.moduleNumber = moduleNumber;

    const moduleErrors = await validate(module);
    if (moduleErrors.length > 0) {
      res.status(400).send(moduleErrors);
      return;
    }

    try {
      await moduleService.create(module);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el módulo '})
    }

    res.status(201).json({ message: 'Modulo creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const moduleService = Container.get(ModuleService);
    const id: number = Number(req.params.id);
    const { moduleNumber }: { moduleNumber: number } = req.body;

    const module = await moduleService.findById(id);
    if (!module) {
      res.status(404).json({ message: 'Modulo no encontrado'});
      return;
    }

    module.moduleNumber = moduleNumber;

    const moduleErrors = await validate(module);
    if (moduleErrors.length > 0) {
      res.status(400).send(moduleErrors);
      return;
    }

    try {
      await moduleService.update(module);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el módulo' });
      return;
    }

    res.status(200).json({ message: 'Modulo actualizado' });
  }

  static show = async (req: Request, res: Response) => {
    const moduleService = Container.get(ModuleService);
    const id: number = Number(req.params.id);

    const module = await moduleService.findById(id);
    if (!module) {
      res.status(404).json({ message: 'Modulo no encontrado' });
      return;
    }
    res.status(200).send(module);
  }

  static destroy = async (req: Request, res: Response) => {
    const moduleService = Container.get(ModuleService);
    const id: number = Number(req.params.id);
    const module = await moduleService.findById(id);
    if (!module) {
      res.status(404).json({ message: 'Modulo no encontrado' });
      return;
    }
    await moduleService.delete(id);
    res.status(204).send();
  }
}

export default ModuleController;
