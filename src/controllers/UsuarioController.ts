import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Materia } from './../entities/Materia';
import { Persona } from './../entities/Persona';
import { Sede } from './../entities/Sede';
import { Usuario } from './../entities/Usuario';
import { Rol } from './../entities/Rol';

class UsuarioController {
    static listAll = async (req: Request, res: Response) => {
        const UsuarioRepository = getRepository(Usuario);
        const Usuarios = await UsuarioRepository.find({
            relations: ["persona", "persona.sede", "materia"]
        });

        res.status(200).send({ Usuarios: Usuarios })
    }

    static getOneById = async (req: Request, res: Response) => {
        const usuario_id: number = Number(req.params.id);
        const UsuarioRepository = getRepository(Usuario);

        try {
            const usuario = await UsuarioRepository.findOneOrFail(usuario_id, {
                relations: ["persona", "persona.sede", "materia"]
            });
            res.status(200).send(usuario);
        } catch (error) {
            res.status(404).json({
                message: 'Usuario not found',
            });
            return;
        }
    }

    static newUsuario = async (req: Request, res: Response) => {
        let { sede_id, usuario_name, nombres, apellidos, numero, correo, numero_alt,
            estado, password, rol_id, materia_id } = req.body;
        let persona = new Persona();
        let usuario = new Usuario();

        persona.nombres = nombres;
        persona.usuario = usuario_name;
        persona.apellidos = apellidos;
        persona.numero = numero;
        persona.correo = correo;
        persona.numero_alt = numero_alt;
        persona.estado = estado;

        usuario.password = password;
        
        const errors = await validate(persona);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        
        const materiaRepository = getRepository(Materia);
        const RolRepository = getRepository(Rol);
        const sedeRepository = getRepository(Sede);
        const personaRepository = getRepository(Persona);
        const usuarioRepository = getRepository(Usuario);

        try {

            const rol = await RolRepository.findOneOrFail(rol_id);
            usuario.rol = rol;

            const sede = await sedeRepository.findOneOrFail(sede_id);
            persona.sede = sede;
            usuario.persona = persona;

            const materia = await materiaRepository.findOneOrFail(materia_id, {
                relations: ["grado"]
            });
            usuario.materia = materia;
            await personaRepository.save(persona);
            await usuarioRepository.save(usuario);
            res.status(200).send(usuario);
        } catch (error) {
            res.status(404).json({
                message: 'No se pudo ingresar el Usuario',
            });
            return;
        }
    }

    static deleteById = async (req: Request, res: Response) => {
        const usuario_id: number = Number(req.params.id);
        const UsuarioRepository = getRepository(Usuario);
        const personaRepository = getRepository(Persona);
        try {
            const usuario = await UsuarioRepository.findOneOrFail(usuario_id, {
                relations: ["persona", "persona.sede", "materia"]
            });
            const persona=usuario.persona;
            UsuarioRepository.delete(usuario);
            personaRepository.delete(persona);
            res.status(200).send('Se ha borrado con exito');
        } catch (error) {
            res.status(404).json({
                message: 'Usuario not found',
            });
            return;
        }
    }
}

export default UsuarioController;