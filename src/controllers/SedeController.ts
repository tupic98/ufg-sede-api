import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Sede } from './../entities/Sede';

class SedeController {
    static listAll = async (req: Request, res: Response) => {
        const sedeRepository = getRepository(Sede);
        const sedes = await sedeRepository.find({
            select: ['sede_id', 'sede_nombre', 'logo', 'dir'],
        });

        res.status(200).send({ sedes: sedes })
    }

    static getOneById = async (req: Request, res: Response) => {
        const sede_id: number = Number(req.params.id);
        const sedeRepository = getRepository(Sede);

        try {
            const sede = await sedeRepository.findOneOrFail(sede_id, {
                select: ['sede_id', 'sede_nombre', 'logo', 'dir'],
            });
            res.status(200).send(sede);
        } catch (error) {
            res.status(404).json({
                message: 'Sede not found',
            });
            return;
        }
    }

    static newSede = async (req: Request, res: Response) => {
        let { nombre, logo, dir } = req.body;
        let sede = new Sede();
        sede.sede_nombre = nombre;
        sede.logo = logo;
        sede.dir = dir;

        const errors = await validate(sede);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        const sedeRepository = getRepository(Sede);
        try {
            await sedeRepository.save(sede);
        } catch (error) {
            res.status(409).send('Unkown error');
            return;
        }

        //If everything is ok, send 201 response
        res.status(201).send('Sede created');
    }

    static editSede = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        const { nombre, logo, dir } = req.body;
    
        //Try to find user on database
        const sedeRepository = getRepository(Sede);
        let sede;
        try {
          sede = await sedeRepository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send('Sede not found');
          return;
        }
    
        // Validate the new values on model
        sede.sede_nombre = nombre;
        sede.logo = logo;
        sede.dir = dir;
        const errors = await validate(sede);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }
    
        try {
          await sedeRepository.save(sede);
        } catch (error) {
          res.status(409).send('Email already in use');
          return;
        }

        res.status(204).send();
      };
}

export default SedeController;