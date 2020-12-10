import { Request, Response } from 'express';
import { PermissionService } from "../services/PermissionService";
import { Role } from '../entities/Role';
import { validate } from 'class-validator';
import { RoleService } from '../services/RoleService';
import { Container } from "typedi";

class RoleController {
  static fetch = async (req: Request, res: Response) => {
    const roleService = Container.get(RoleService);
    const roles = await roleService.findAll();
    res.status(200).send(roles);
  }

  static list = async (req: Request, res: Response) => {
    const roleService = Container.get(RoleService);
    const roles = await roleService.listAll();
    res.status(200).send(roles);
  }

  static store = async (req: Request, res: Response) => {
    const permissionService = Container.get(PermissionService);
    const roleService = Container.get(RoleService);
    const {
      name,
      type,
      permissionId
    }: {
      name: string;
      type: string;
      permissionId: Array<number>
    } = req.body;

    //Getting permissionInformation
    const permissions = await permissionService.findByIds(permissionId);
    if (type === 'tutor' && (!permissions || permissions.length <= 0)) {
      res.status(400).json({ message: 'No se puede asignar un rol sin permisos' })
      return;
    }

    const role = new Role();
    role.name = name;
    role.type = type;
    role.permissions = permissions;

    const roleErrors = await validate(role);
    if (roleErrors.length > 0) {
      res.status(400).send(roleErrors);
      return;
    }

    try {
      await roleService.create(role);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el rol '});
      return;
    }

    res.status(201).json({ message: 'Rol creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const permissionService = Container.get(PermissionService);
    const roleService = Container.get(RoleService);
    const id = Number(req.params.id);

    const { name, type, permissionId }: { name: string, type: string, permissionId: Array<number> } = req.body;

    const role = await roleService.findById(id);
    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado' })
      return;
    }

    const permissions = await permissionService.findByIds(permissionId);
    if (type === 'tutor' && (!permissions || permissions.length <= 0)) {
      res.status(400).json({ message: 'No se puede asiginar un rol sin permisos '});
      return;
    }

    role.name = name;
    role.type = type;
    role.permissions = permissions;

    const roleErrors = await validate(role);
    if (roleErrors.length > 0) {
      res.status(400).send(roleErrors);
      return;
    }

    try {
        await roleService.update(role);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el rol '});
      return;
    }

    res.status(200).json({ message: 'Rol actualizado correctamente' });
  }

  static show = async (req: Request, res: Response) => {
    const roleService = Container.get(RoleService);
    const id: number = Number(req.params.id);

    const role = await roleService.findByIdWithRelations(id);
    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado '});
      return;
    }
    res.status(200).send(role);
  }

  static destroy = async (req: Request, res: Response) => {
    const roleService = Container.get(RoleService);
    const id: number = Number(req.params.id);

    const role = await roleService.findById(id);
    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado' })
    }

    await roleService.delete(id);
    res.status(204).send();
  }
}

export default RoleController;
