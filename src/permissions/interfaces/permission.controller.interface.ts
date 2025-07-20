import { PaginationDto } from '../dto/pagination.dto';
import { UpdatePermissionDto, PermissionDto } from '../dto/permission.dto';
import { Response } from 'express';

export interface PermissionControllerI {
  listAll(event: any, query: PaginationDto, res: Response): Promise<any>;

  listAllWithPagination(
    event: any,
    query: PaginationDto,
    res: Response,
  ): Promise<any>;

  getItem(event: any, id: string, res: Response): Promise<any>;

  createItem(event: any, payload: PermissionDto, res: Response): Promise<any>;

  updateItem(
    event: any,
    id: string,
    payload: UpdatePermissionDto,
    res: Response,
  ): Promise<any>;

  deleteItem(event: any, id: string, res: Response): Promise<any>;
}
