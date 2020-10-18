import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Modalidad } from './../entities/Modalidad';

class ModalidadController {
    static listAll = async (req: Request, res: Response) => {
        const modalidadRepository = getRepository(Modalidad);
        const modalidades = await modalidadRepository.find();

        res.status(200).send({ modalidades: modalidades })
    }

    static getOneById = async (req: Request, res: Response) => {
        const modalidad_id: number = Number(req.params.id);
        const modalidadRepository = getRepository(Modalidad);

        try {
            const modalidad = await modalidadRepository.findOneOrFail(modalidad_id);
            res.status(200).send(modalidad);
        } catch (error) {
            res.status(404).json({
                message: 'Modalidad not found',
            });
            return;
        }
    }

    static newModalidad = async (req: Request, res: Response) => {
        let { tipo } = req.body;
        let modalidad = new Modalidad();
        modalidad.tipo_modalidad = tipo;

        const errors = await validate(modalidad);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        const modalidadRepository = getRepository(Modalidad);
        try {
            await modalidadRepository.save(modalidad);
            res.status(201).send('Modalidad created');
        } catch (error) {
            res.status(409).send('Unkown error');
            return;
        }

        //If everything is ok, send 201 response

    }

    static editModalidad = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        const { tipo } = req.body;

        //Try to find user on database
        const ModalidadRepository = getRepository(Modalidad);
        let modalidad;
        try {
            modalidad = await ModalidadRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send('Modalidad not found');
            return;
        }

        // Validate the new values on model
        modalidad.tipo_modalidad = tipo;
        const errors = await validate(modalidad);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await ModalidadRepository.save(modalidad);
        } catch (error) {
            res.status(409).send('Email already in use');
            return;
        }

        res.status(204).send();
    };
}

export default ModalidadController;