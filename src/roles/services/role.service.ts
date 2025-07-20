import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RoleServiceI } from '../interfaces/role.service.interface';
import {
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND,
  RequestI,
  ResponseI,
} from '@/utils/constants.util';
import { LookupParams, SearchOptions } from '@localrepo/lib_data_access_mongodb';
import { RoleRepositoryI } from '../interfaces/role.repository.interface';
import { errorResponse, generateIndex, saveLog } from '@/utils/helpers.util';

@Injectable()
export class RoleService implements RoleServiceI {
  constructor(
    @Inject('ROLE_REPOSITORY') private readonly repository: RoleRepositoryI,
  ) {}

  async listAll(params: RequestI): Promise<ResponseI> {
    try {
      const options: SearchOptions = {
        sort: [{ createdAt: 'asc' }],
      };

      const { responseBody, status } = await this.repository.listAll(
        options,
        params.companyPrefix,
      );

      if (status === HTTP_INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException(responseBody);
      }

      return {
        result: responseBody,
        statusCode: status,
      };
    } catch (error) {
      saveLog('ERROR', error, 'RoleService_getAll', params.companyPrefix);
      return errorResponse(error.message, error.status);
    }
  }

  async listAllWithPagination(params: RequestI): Promise<ResponseI> {
    try {
      const options: SearchOptions = {
        from: Number(params.from),
        size: Number(params.size),
        word: params.word ?? '',
        sort: [{ createdAt: 'asc' }],
      };

      const { responseBody, status, totalCount } =
        await this.repository.listAllWithPagination(
          options,
          params.companyPrefix,
        );

      if (status === HTTP_INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException(responseBody);
      }

      return {
        totalCount: totalCount,
        result: responseBody,
        statusCode: status,
      };
    } catch (error) {
      saveLog(
        'ERROR',
        error,
        'RoleService_listAllWithPagination',
        params.companyPrefix,
      );
      return errorResponse(error.message, error.status);
    }
  }

  async getItem(params: RequestI): Promise<ResponseI> {
    try {
      const relations: LookupParams[] = this.handleRelation(
        params.companyPrefix,
      );

      const { responseBody, status } = await this.repository.getItem(
        params.id!,
        params.companyPrefix,
        relations,
      );

      if (status === HTTP_INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException(responseBody);
      }

      return {
        result: responseBody,
        statusCode: responseBody ? status : HTTP_NOT_FOUND,
      };
    } catch (error) {
      saveLog('ERROR', error, 'RoleService_getItem', params.companyPrefix);
      return errorResponse(error.message, error.status);
    }
  }

  async getModuleAccess(params: RequestI): Promise<ResponseI> {
    try {
      // Obtengo el role con sus permisos a los modulos asociados
      const { result: roles, statusCode } = await this.getItem(params);

      // Obtengo el listado de modulos
      const options: SearchOptions = {
        from: 0,
        size: 500,
        sort: [{ createdAt: 'asc' }],
      };

      if (params.fields) {
        const fields = JSON.parse(decodeURIComponent(params.fields));
        options.sourceInclude = fields;
      }

      if (params.filters) {
        const filters = JSON.parse(decodeURIComponent(params.filters));
        options.conditions = filters;
      }

      const { responseBody: modules, status: modulesStatus } =
        await this.repository.listAll(options, params.companyPrefix, [], true);

      if (modulesStatus === HTTP_INTERNAL_SERVER_ERROR) {
        throw new Error(modules);
      }

      const permissions = roles[0].permissions;

      // Filtra cada uno de los modulos con los permisos de acceso asociados a un role
      const permissionMap = new Map<
        string,
        { moduleId: string; fullAccess: boolean }
      >(
        permissions.map((permission: any) => [permission.moduleId, permission]),
      );

      const consolidated = modules.map((module: any) => {
        const { actions } = module.view;

        const activeActions = Object.keys(actions || {}).filter(
          (key: string) => actions[key] === true,
        );

        const permission = permissionMap.get(module._id);

        delete module.view;

        return {
          ...module,
          fullAccess: permission?.fullAccess ?? false,
          actions: activeActions,
        };
      });

      return {
        result: consolidated,
        statusCode: consolidated ? statusCode : HTTP_NOT_FOUND,
      };
    } catch (error) {
      saveLog(
        'ERROR',
        error,
        'RoleService_getModuleAccess',
        params.companyPrefix,
      );
      return errorResponse(error.message, error.status);
    }
  }

  async createItem(params: RequestI): Promise<ResponseI> {
    try {
      const name = params.body.name.toLowerCase();
      params.body.name = name;

      // Se valida si el role ya existe
      const options: SearchOptions = {
        sourceInclude: ['_id', 'name'],
        conditions: [{ name: name }],
      };

      const { responseBody: isUnique, status: code } =
        await this.repository.listAll(options, params.companyPrefix);

      if (code === HTTP_INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException(isUnique);
      }

      if (isUnique.length > 0) {
        throw new ConflictException('The role already exists');
      }

      const data = {
        ...params.body,
      };

      const { responseBody, status } = await this.repository.createItem(
        data,
        params.companyPrefix,
      );

      if (status === HTTP_INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException(responseBody);
      }

      return {
        id: responseBody.id,
        result: responseBody,
        statusCode: status,
      };
    } catch (error) {
      saveLog('ERROR', error, 'RoleService_createItem', params.companyPrefix);
      return errorResponse(error.message, error.status);
    }
  }

  async updateItem(params: RequestI): Promise<ResponseI> {
    try {
      const { responseBody, status } = await this.repository.updateItem(
        params.id ?? '',
        params.body,
        params.companyPrefix,
      );

      if (status === HTTP_INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException(responseBody);
      }

      return {
        id: responseBody.id,
        result: responseBody.result,
        statusCode: status,
      };
    } catch (error) {
      saveLog('ERROR', error, 'RoleService_updateItem', params.companyPrefix);
      return errorResponse(error.message, error.status);
    }
  }

  async deleteItem(params: RequestI): Promise<ResponseI> {
    try {
      const { responseBody, status } = await this.repository.deleteItem(
        params.id ?? '',
        params.companyPrefix,
      );

      if (status === HTTP_INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException(responseBody);
      }

      return {
        id: responseBody.id,
        result: responseBody.result,
        statusCode: status,
      };
    } catch (error) {
      saveLog('ERROR', error, 'RoleService_deleteItem', params.companyPrefix);
      return errorResponse(error.message, error.status);
    }
  }

  private handleRelation(companyPrefix: string): LookupParams[] {
    const relations = [
      {
        datasource: 'permissions',
        field: '_id',
        foreign: 'roleId',
        alias: 'permissions',
        enableUnwind: false,
      },
    ];

    return relations.map((reference) => {
      return {
        datasource: reference.datasource,
        field: reference.field,
        alias: reference.alias,
        foreign: reference.foreign,
        from: `${generateIndex(reference.datasource, companyPrefix, true)}`,
        enableUnwind: reference.enableUnwind,
      };
    });
  }
}
