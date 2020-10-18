import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Persona } from './../entities/Persona';
import { Sede } from './../entities/Sede';
import { Alumno } from './../entities/Alumno';
import { Modalidad } from '../entities/Modalidad';
import { Seccion } from '../entities/Seccion';
import { Grado } from '../entities/Grado';

class AlumnoController {
    static listAll = async (req: Request, res: Response) => {
        const alumnoRepository = getRepository(Alumno);
        const Alumnos = await alumnoRepository.find({
            relations: ["persona", "persona.sede", "seccion", "modalidad", "grado"]
        });

        res.status(200).send({ Alumnos: Alumnos })
    }

    static getOneById = async (req: Request, res: Response) => {
        const alumno_id: number = Number(req.params.id);
        const alumnoRepository = getRepository(Alumno);

        try {
            const alumno = await alumnoRepository.findOneOrFail(alumno_id, {
                relations: ["persona", "persona.sede", "seccion", "modalidad", "grado", "calificaciones"]
            });
            res.status(200).send(alumno);
        } catch (error) {
            res.status(404).json({
                message: 'Alumno not found',
            });
            return;
        }
    }

    static newAlumno = async (req: Request, res: Response) => {
        let { sede_id, usuario, nombres, apellidos, numero, correo, numero_alt,
            estado, anno, boleta ,modalidad_id,seccion_id,grado_id,aprovado,
            promedio_final,promedio_insti,codigo,firsttime} = req.body;
        let persona = new Persona();
        let alumno = new Alumno();

        persona.nombres = nombres;
        persona.usuario = usuario;
        persona.apellidos = apellidos;
        persona.numero = numero;
        persona.correo = correo;
        persona.numero_alt = numero_alt;
        persona.estado = estado;

        alumno.anno = anno;
        alumno.boleta = boleta;
        alumno.aprovado=aprovado;
        alumno.promedio_final=promedio_final;
        alumno.promedio_insti=promedio_insti;
        alumno.codigo=codigo;
        alumno.firsttime=firsttime;

        const errors = await validate(persona);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const sedeRepository = getRepository(Sede);
        const personaRepository = getRepository(Persona);
        const alumnoRepository = getRepository(Alumno);
        const modalidadRepository = getRepository(Modalidad);
        const seccionRepository = getRepository(Seccion);
        const gradoRepository = getRepository(Grado);

        try {
            const sede = await sedeRepository.findOneOrFail(sede_id);
            persona.sede = sede;
            alumno.persona = persona;

            const modalidad = await modalidadRepository.findOneOrFail(modalidad_id);
            alumno.modalidad=modalidad;

            const seccion = await seccionRepository.findOneOrFail(seccion_id);
            alumno.seccion=seccion;

            const grado = await gradoRepository.findOneOrFail(grado_id);
            alumno.grado=grado;

            await personaRepository.save(persona);
            await alumnoRepository.save(alumno);
            res.status(200).send(alumno);
        } catch (error) {
            res.status(404).json({
                message: 'No se pudo ingresar el Alumno',
            });
            return;
        }
    }

    static deleteById = async (req: Request, res: Response) => {
        const alumno_id: number = Number(req.params.id);
        const alumnoRepository = getRepository(Alumno);
        const personaRepository = getRepository(Persona);
        try {
            const alumno = await alumnoRepository.findOneOrFail(alumno_id, {
                relations: ["persona"]
            });
            const persona = alumno.persona;
            alumnoRepository.delete(alumno);
            personaRepository.delete(persona);
            res.status(200).send('Se ha borrado con exito');
        } catch (error) {
            res.status(404).json({
                message: 'Alumno not found',
            });
            return;
        }
    }
}

export default AlumnoController;