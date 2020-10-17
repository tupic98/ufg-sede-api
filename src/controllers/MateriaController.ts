import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Materia } from './../entities/Materia';
import { Grado } from './../entities/Grado';

class MateriaController {
    static listAll = async (req: Request, res: Response) => {
        const materiaRepository = getRepository(Materia);
        const materias = await materiaRepository.find({
            relations: ["grado"]
        });

        res.status(200).send({ Materias: materias })
    }

    static getOneById = async (req: Request, res: Response) => {
        const materia_id: number = Number(req.params.id);
        const materiaRepository = getRepository(Materia);

        try {
            const materia = await materiaRepository.findOneOrFail(materia_id, {
                relations: ["grado"]
            });
            res.status(200).send(materia);
        } catch (error) {
            res.status(404).json({
                message: 'Materia not found',
            });
            return;
        }
    }

    static newMateria = async (req: Request, res: Response) => {
        let { nombre, grado_id } = req.body;
        let materia = new Materia();
        materia.materia_nombre = nombre;

        const errors = await validate(Materia);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        const materiaRepository = getRepository(Materia);
        const gradoRepository = getRepository(Grado);
        try {
            const grado = await gradoRepository.findOneOrFail(grado_id
            );
            materia.grado = grado;

            await materiaRepository.save(materia);
        } catch (error) {
            res.status(409).send('Unkown error');
            return;
        }

        //If everything is ok, send 201 response
        res.status(201).send('Materia created');
    }

    static editMateria = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        const { nombre } = req.body;

        //Try to find user on database
        const materiaRepository = getRepository(Materia);
        let materia;
        try {
            materia = await materiaRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send('Materia not found');
            return;
        }

        // Validate the new values on model
        materia.materia_nombre = nombre;
        const errors = await validate(materia);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await materiaRepository.save(materia);
        } catch (error) {
            res.status(409).send('Email already in use');
            return;
        }

        res.status(204).send();
    };
}

export default MateriaController;