import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Modulo } from './../entities/Modulo';

class ModuloController {
    static listAll = async (req: Request, res: Response) => {
        const moduloRepository = getRepository(Modulo);
        const modulos = await moduloRepository.find({
        });

        res.status(200).send({ Modulos: modulos })
    }

    static getOneById = async (req: Request, res: Response) => {
        const modulo_id: number = Number(req.params.id);
        const sedeRepository = getRepository(Modulo);

        try {
            const modulo = await sedeRepository.findOneOrFail(modulo_id, {
            });
            res.status(200).send(modulo);
        } catch (error) {
            res.status(404).json({
                message: 'Modulo not found',
            });
            return;
        }
    }

    static newModulo = async (req: Request, res: Response) => {
        let { numero_mod } = req.body;
        let modulo = new Modulo();
        modulo.numero_mod=numero_mod;

        const errors = await validate(modulo);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        const moduloRepository = getRepository(Modulo);
        try {
            await moduloRepository.save(modulo);
        } catch (error) {
            res.status(409).send('Unkown error');
            return;
        }

        //If everything is ok, send 201 response
        res.status(201).send('Modulo created');
    }

    static editModulo = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id = req.params.id;
    
        //Get values from the body
        let { numero_mod } = req.body;
    
        //Try to find user on database
        const moduloRepository = getRepository(Modulo);
        let modulo;
        try {
          modulo = await moduloRepository.findOneOrFail(id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send('Modulo not found');
          return;
        }
    
        // Validate the new values on model
        modulo.numero_mod = numero_mod;

        const errors = await validate(Modulo);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }
    
        try {
          await moduloRepository.save(modulo);
        } catch (error) {
          res.status(409).send('Something wrong');
          return;
        }

        res.status(204).send();
      };
}

export default ModuloController;