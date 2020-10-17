import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Grado } from './../entities/Grado';

class GradoController {
    static listAll = async (req: Request, res: Response) => {
        const gradoRepository = getRepository(Grado);
        const grados = await gradoRepository.find({
        });

        res.status(200).send({ grados: grados })
    }

    static getOneById = async (req: Request, res: Response) => {
        const grado_id: number = Number(req.params.id);
        const sedeRepository = getRepository(Grado);

        try {
            const grado = await sedeRepository.findOneOrFail(grado_id, {
            });
            res.status(200).send(grado);
        } catch (error) {
            res.status(404).json({
                message: 'Sede not found',
            });
            return;
        }
    }

    static newGrado = async (req: Request, res: Response) => {
        let { grado_n, institucional, externo } = req.body;
        let grado = new Grado();
        grado.grado = grado_n;
        grado.perc_inst=institucional;
        grado.perc_ext=externo;

        const errors = await validate(grado);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        const gradoRepository = getRepository(Grado);
        try {
            await gradoRepository.save(grado);
        } catch (error) {
            res.status(409).send('Unkown error');
            return;
        }

        //If everything is ok, send 201 response
        res.status(201).send('Grado created');
    }

    static editGrado = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        let { grado_n, institucional, externo } = req.body;
    
        //Try to find user on database
        const gradoRepository = getRepository(Grado);
        let grado;
        try {
          grado = await gradoRepository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send('Grado not found');
          return;
        }
    
        // Validate the new values on model
        grado.grado = grado_n;
        grado.perc_ext=externo;
        grado.perc_inst=institucional;

        const errors = await validate(grado);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }
    
        try {
          await gradoRepository.save(grado);
        } catch (error) {
          res.status(409).send('Something wrong');
          return;
        }

        res.status(204).send();
      };
}

export default GradoController;