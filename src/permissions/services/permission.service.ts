import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PermissionServiceI } from '../interfaces/permission.service.interface';
import {
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND,
  RequestI,
  ResponseI,
} from '@/utils/constants.util';
import { LookupParams, SearchOptions } from '@localrepo/lib_data_access_mongodb';
import { PermissionRepositoryI } from '../interfaces/permission.repository.interface';
import { errorResponse, generateIndex, saveLog } from '@/utils/helpers.util';

@Injectable()
export class PermissionService implements PermissionServiceI {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private readonly repository: PermissionRepositoryI,
  ) {}

  async listAll(params: RequestI): Promise<ResponseI> {
    try {
      const relations: LookupParams[] = this.handleRelation(
        params.companyPrefix,
      );

      const options: SearchOptions = {
        sourceInclude: ['_id', 'roleId', 'moduleId', 'createdAt'],
        sort: [{ createdAt: 'asc' }],
      };

      const { responseBody, status } = await this.repository.listAll(
        options,
        params.companyPrefix,
        relations,
      );

      if (status === HTTP_INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException(responseBody);
      }

      return {
        result: responseBody,
        statusCode: status,
      };
    } catch (error) {
      saveLog('ERROR', error, 'PermissionService_getAll', params.companyPrefix);
      return errorResponse(error.message, error.status);
    }
  }

  async listAllWithPagination(params: RequestI): Promise<ResponseI> {
    try {
      const relations: LookupParams[] = this.handleRelation(
        params.companyPrefix,
      );

      const options: SearchOptions = {
        from: Number(params.from),
        size: Number(params.size),
        word: params.word ?? '',
        sort: [{ createdAt: 'asc' }],
        sourceInclude: ['_id', 'roleId', 'moduleId', 'createdAt'],
      };

      const { responseBody, status, totalCount } =
        await this.repository.listAllWithPagination(
          options,
          params.companyPrefix,
          relations,
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
        'PermissionService_listAllWithPagination',
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
        params.id ?? '',
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
      saveLog(
        'ERROR',
        error,
        'PermissionService_getItem',
        params.companyPrefix,
      );
      return errorResponse(error.message, error.status);
    }
  }

  async createItem(params: RequestI): Promise<ResponseI> {
    try {
      // Se valida si el role ya existe
      const options: SearchOptions = {
        sourceInclude: ['_id', 'name'],
        conditions: [
          {
            moduleId: params.body.moduleId,
            roleId: params.body.roleId,
          },
        ],
      };

      const { responseBody: isUnique, status: code } =
        await this.repository.listAll(options, params.companyPrefix);

      if (code === HTTP_INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException(isUnique);
      }

      if (isUnique.length > 0) {
        throw new ConflictException('The permission already exists');
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
      saveLog(
        'ERROR',
        error,
        'PermissionService_createItem',
        params.companyPrefix,
      );
      return errorResponse(error.message, error.status);
    }
  }

  async createMultiItems(params: RequestI): Promise<ResponseI> {
    try {
      const data = params.body.permissions.map((permission: any) => {
        return {
          ...permission,
          actions: permission.fullAccess ? permission.actions : [],
        };
      });
      
      const { responseBody, status } = await this.repository.createMultiItems(
        params.body.roleId,
        data,
        params.companyPrefix,
      );

      if (status === HTTP_INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException(responseBody);
      }

      return {
        result: responseBody,
        statusCode: status,
      };
    } catch (error: any) {
      saveLog(
        'ERROR',
        error,
        'PermissionService_createMultiItems',
        params.companyPrefix,
      );
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
      saveLog(
        'ERROR',
        error,
        'PermissionService_updateItem',
        params.companyPrefix,
      );
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
      saveLog(
        'ERROR',
        error,
        'PermissionService_deleteItem',
        params.companyPrefix,
      );
      return errorResponse(error.message, error.status);
    }
  }

  private handleRelation(companyPrefix: string): LookupParams[] {
    const relations = [
      {
        datasource: 'roles',
        field: 'roleId',
        alias: 'roleId',
        enableUnwind: true,
      },
      {
        datasource: 'module',
        field: 'moduleId',
        foreign: 'moduleId',
        alias: 'moduleId',
        enableUnwind: true,
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
