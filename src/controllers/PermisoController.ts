import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Permiso } from './../entities/Permiso';

class PermisoContPermisoler {
  static listAll = async (req: Request, res: Response) => {
    const permisoRepository = getRepository(Permiso);
    const permisos = await permisoRepository.find({ relations: ["permisos"] });

    res.status(200).send({ Permisos: permisos })
  }

  static getOneById = async (req: Request, res: Response) => {
    const permiso_id: number = Number(req.params.id);
    const permisoRepository = getRepository(Permiso);

    try {
      const permiso = await permisoRepository.findOneOrFail(permiso_id)
      res.status(200).send(permiso);
    } catch (error) {
      res.status(404).json({
        message: 'Permiso not found',
      });
      return;
    }
  }

  static newPermiso = async (req: Request, res: Response) => {
    let { nombre } = req.body;
    let permiso = new Permiso();
    permiso.permiso_name = nombre;

    const errors = await validate(Permiso);

    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    const permisoRepository = getRepository(Permiso);
    try {
      await permisoRepository.save(permiso);
    } catch (error) {
      res.status(409).send('Unkown error');
      return;
    }

    //If everything is ok, send 201 response
    res.status(201).send('Permiso created');
  }

  static editPermiso = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { nombre } = req.body;

    //Try to find user on database
    const permisoRepository = getRepository(Permiso);
    let permiso;
    try {
      permiso = await permisoRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send('Permiso not found');
      return;
    }

    // Validate the new values on model
    permiso.permiso_name = nombre;
    const errors = await validate(permiso);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await permisoRepository.save(permiso);
    } catch (error) {
      res.status(409).send('Email already in use');
      return;
    }

    res.status(204).send();
  };
}

export default PermisoContPermisoler;