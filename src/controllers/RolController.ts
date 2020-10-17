import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Rol } from './../entities/Rol';
import { Permiso } from './../entities/Permiso';

class RolController {
  static listAll = async (req: Request, res: Response) => {
    const RolRepository = getRepository(Rol);
    const Rols = await RolRepository.find({ relations: ["permisos"] });

    res.status(200).send({ Rols: Rols })
  }

  static getOneById = async (req: Request, res: Response) => {
    const rol_id: number = Number(req.params.id);
    const RolRepository = getRepository(Rol);

    try {
      const Rol = await RolRepository.findOneOrFail(rol_id, { relations: ["permisos"] });
      res.status(200).send(Rol);
    } catch (error) {
      res.status(404).json({
        message: 'Rol not found',
      });
      return;
    }
  }

  static newRol = async (req: Request, res: Response) => {
    let { nombre, tipo , permisos} = req.body;
    let rol = new Rol();
    rol.rol_nombre = nombre;
    rol.tipo = tipo;

    const errors = await validate(Rol);

    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    const RolRepository = getRepository(Rol);
    const permisoRepository = getRepository(Permiso);
    try {
      const Permisos= await permisoRepository.findByIds(permisos);
      rol.permisos=Permisos;
      await RolRepository.save(rol);
    } catch (error) {
      res.status(409).send('Unkown error');
      return;
    }

    //If everything is ok, send 201 response
    res.status(201).send('Rol created');
  }

  static editRol = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { nombre } = req.body;

    //Try to find user on database
    const RolRepository = getRepository(Rol);
    let rol;
    try {
      rol = await RolRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send('Rol not found');
      return;
    }

    // Validate the new values on model
    rol.Rol_nombre = nombre;
    const errors = await validate(Rol);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await RolRepository.save(rol);
    } catch (error) {
      res.status(409).send('Email already in use');
      return;
    }

    res.status(204).send();
  };
}

export default RolController;