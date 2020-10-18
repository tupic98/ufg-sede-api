import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Materia } from './../entities/Materia';
import { Calificacion } from './../entities/Calificacion';
import { Alumno } from '../entities/Alumno';
import { Modulo } from '../entities/Modulo';

class CalificacionController {
    static listAll = async (req: Request, res: Response) => {
        const calificacionRepository = getRepository(Calificacion);
        const calificaciones = await calificacionRepository.find({
            relations: ["alumno", "modulo", "materia", "materia.grado"]
        });

        res.status(200).send({ calificaciones: calificaciones })
    }

    static getById = async (req: Request, res: Response) => {
        const alumno_id: number = Number(req.params.id);
        const calificacionRepository = getRepository(Calificacion);

        try {
            const calificacion = await calificacionRepository.find({
                where: { alumno: {alumno_id:alumno_id} },
                relations: ["alumno", "modulo", "materia", "materia.grado"]
            });
            res.status(200).send(calificacion);
        } catch (error) {
            res.status(404).json({
                message: 'Calificacion not found',
            });
            return;
        }
    }

    static newCalificacion = async (req: Request, res: Response) => {
        let { nota, aprobado, link_rec, rec_habilitada, prueba_ext,
            usuario_id, modulo_id, materia_id, alumno_id } = req.body;
        let calificacion = new Calificacion();

        calificacion.nota = nota;
        calificacion.aprobado = aprobado;
        calificacion.link_rec = link_rec;
        calificacion.rec_habilitada = rec_habilitada;
        calificacion.prueba_ext = prueba_ext;
        calificacion.updated_by = usuario_id;

        const errors = await validate(calificacion);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const materiaRepository = getRepository(Materia);
        const moduloRepository = getRepository(Modulo);
        const alumnoRepository = getRepository(Alumno);
        const calificacionRepository = getRepository(Calificacion);

        try {

            const modulo = await moduloRepository.findOneOrFail(modulo_id);
            calificacion.modulo = modulo;

            const alumno = await alumnoRepository.findOneOrFail(alumno_id);
            calificacion.alumno = alumno;

            const materia = await materiaRepository.findOneOrFail(materia_id);
            calificacion.materia = materia;
            await calificacionRepository.save(calificacion);
            res.status(200).send(calificacion);
        } catch (error) {
            res.status(404).json({
                message: 'No se pudo ingresar la Calificacion',
            });
            return;
        }
    }

    static editCalificacion = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        let { nota, aprobado, link_rec, rec_habilitada, prueba_ext,
            usuario_id } = req.body;

        //Try to find user on database
        const calificacionRepository = getRepository(Calificacion);
        let calificacion;
        try {
            calificacion = await calificacionRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send('Calificacion not found');
            return;
        }

        // Validate the new values on model
        calificacion.nota = nota;
        calificacion.aprobado = aprobado;
        calificacion.link_rec = link_rec;
        calificacion.rec_habilitada = rec_habilitada;
        calificacion.prueba_ext = prueba_ext;
        calificacion.updated_by = usuario_id;
        const errors = await validate(calificacion);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await calificacionRepository.save(calificacion);
        } catch (error) {
            res.status(409).send('Error in name of seccion');
            return;
        }

        res.status(204).send();
    };
}

export default CalificacionController;