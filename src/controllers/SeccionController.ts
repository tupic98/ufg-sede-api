import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Seccion } from './../entities/Seccion';

class SeccionController {
    static listAll = async (req: Request, res: Response) => {
        const SeccionRepository = getRepository(Seccion);
        const Secciones = await SeccionRepository.find();

        res.status(200).send({ Secciones: Secciones })
    }

    static getOneById = async (req: Request, res: Response) => {
        const seccion_id: number = Number(req.params.id);
        const seccionRepository = getRepository(Seccion);

        try {
            const seccion = await seccionRepository.findOneOrFail(seccion_id);
            res.status(200).send(seccion);
        } catch (error) {
            res.status(404).json({
                message: 'Seccion not found',
            });
            return;
        }
    }

    static newSeccion = async (req: Request, res: Response) => {
        let { nombre } = req.body;
        let seccion = new Seccion();
        seccion.nombre_seccion = nombre;

        const errors = await validate(seccion);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        const SeccionRepository = getRepository(Seccion);
        try {
            await SeccionRepository.save(seccion);
            res.status(201).send('Seccion created');
        } catch (error) {
            res.status(409).send('Unkown error');
            return;
        }

        //If everything is ok, send 201 response

    }

    static editSeccion = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        const { tipo } = req.body;

        //Try to find user on database
        const seccionRepository = getRepository(Seccion);
        let seccion;
        try {
            seccion = await seccionRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send('Seccion not found');
            return;
        }

        // Validate the new values on model
        seccion.nombre_seccion = tipo;
        const errors = await validate(seccion);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await seccionRepository.save(seccion);
        } catch (error) {
            res.status(409).send('Error in name of seccion');
            return;
        }

        res.status(204).send();
    };
}

export default SeccionController;