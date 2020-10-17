import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Persona } from './../entities/Persona';
import { Sede } from './../entities/Sede';

class PersonaController {
    static listAll = async (req: Request, res: Response) => {
        const PersonaRepository = getRepository(Persona);
        const Personas = await PersonaRepository.find({
            relations:["sede"],
            select: ['persona_id', 'usuario', 'nombres', 'apellidos','numero','correo','numero_alt','estado']
        });

        res.status(200).send({ Personas: Personas })
    }

    static getOneById = async (req: Request, res: Response) => {
        const persona_id: number = Number(req.params.id);
        const PersonaRepository = getRepository(Persona);

        try {
            const Persona = await PersonaRepository.findOneOrFail(persona_id, {
                relations:["sede"],
                select: ['persona_id', 'usuario', 'nombres', 'apellidos','numero','correo','numero_alt','estado']
            });
            res.status(200).send(Persona);
        } catch (error) {
            res.status(404).json({
                message: 'Persona not found',
            });
            return;
        }
    }

    static newPersona = async (req: Request, res: Response) => {
        let {sede_id, usuario,nombres, apellidos, numero, correo, numero_alt,estado} = req.body;
        let persona = new Persona();
        
        persona.nombres = nombres;
        persona.usuario = usuario;
        persona.apellidos = apellidos;
        persona.numero = numero;
        persona.correo=correo;
        persona.numero_alt=numero_alt;
        persona.estado=estado;

        const errors = await validate(Persona);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const sedeRepository = getRepository(Sede);
        const PersonaRepository = getRepository(Persona);

        try {
            const sede = await sedeRepository.findOneOrFail(sede_id, {
                select: ['sede_id', 'sede_nombre', 'logo', 'dir'],
            });
            persona.sede=sede;
            await PersonaRepository.save(persona);
            res.status(200).send(persona);
        } catch (error) {
            res.status(404).json({
                message: 'Persona not saved',
            });
            return;
        }
    }
}

export default PersonaController;