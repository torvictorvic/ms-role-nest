import { Test, TestingModule } from '@nestjs/testing';
import {
  HTTP_CONFLICT,
  HTTP_CREATED,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_OK,
  RequestI,
} from '@/utils/constants.util';
import { PermissionService } from './permission.service';
import { PermissionRepositoryI } from '../interfaces/permission.repository.interface';

const mockPermissionRepository = () => ({
  listAll: jest.fn(),
  listAllWithPagination: jest.fn(),
  getItem: jest.fn(),
  createItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn(),
  createMultiItems: jest.fn(),
});

describe('PermissionService', () => {
  let service: PermissionService;
  let repository: PermissionRepositoryI;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: 'PERMISSION_REPOSITORY',
          useFactory: mockPermissionRepository,
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    repository = module.get<PermissionRepositoryI>('PERMISSION_REPOSITORY');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listAll', () => {
    it('should return a mapped list of permissions', async () => {
      const mockResponse = [
        { _id: '1', roleId: 'exampleId', moduleId: 'exampleId' },
      ];
      (repository.listAll as jest.Mock).mockResolvedValue({
        responseBody: mockResponse,
        status: HTTP_OK,
      });

      const result = await service.listAll({} as RequestI);
      expect(result).toEqual({
        result: [
          {
            _id: '1',
            roleId: 'exampleId',
            moduleId: 'exampleId',
          },
        ],
        statusCode: HTTP_OK,
      });
    });

    it('should throw an InternalServerErrorException when status is 500', async () => {
      (repository.listAll as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: HTTP_INTERNAL_SERVER_ERROR,
      });
      const result = await service.listAll({} as RequestI);

      expect(result).toEqual({
        result: 'Error',
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('listAllWithPagination', () => {
    it('should return a paginated list of companies', async () => {
      const mockResponse = [
        { _id: '1', roleId: 'exampleId', moduleId: 'exampleId' },
      ];
      (repository.listAllWithPagination as jest.Mock).mockResolvedValue({
        responseBody: mockResponse,
        status: HTTP_OK,
        totalCount: 1,
      });

      const result = await service.listAllWithPagination({
        from: 1,
        size: 10,
      } as RequestI);

      expect(result).toEqual({
        result: [{ _id: '1', roleId: 'exampleId', moduleId: 'exampleId' }],
        totalCount: 1,
        statusCode: HTTP_OK,
      });
    });

    it('should throw an InternalServerErrorException when status is 500', async () => {
      (repository.listAllWithPagination as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: HTTP_INTERNAL_SERVER_ERROR,
      });

      const result = await service.listAllWithPagination({} as RequestI);

      expect(result).toEqual({
        result: 'Error',
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('getItem', () => {
    it('should return a permission by id', async () => {
      const mockPermission = {
        _id: '1',
        roleId: 'exampleId',
        moduleId: 'exampleId',
        actions: ['action'],
      };
      (repository.getItem as jest.Mock).mockResolvedValue({
        responseBody: mockPermission,
        status: HTTP_OK,
      });

      const result = await service.getItem({ id: '1' } as RequestI);
      expect(result).toEqual({
        result: {
          _id: '1',
          roleId: 'exampleId',
          moduleId: 'exampleId',
          actions: ['action'],
        },
        statusCode: HTTP_OK,
      });
    });

    it('should throw an InternalServerErrorException when status is 500', async () => {
      (repository.getItem as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: HTTP_INTERNAL_SERVER_ERROR,
      });

      const result = await service.getItem({ id: '1' } as RequestI);

      expect(result).toEqual({
        result: 'Error',
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('createItem', () => {
    it('should create a new permission and return the created permission', async () => {
      const mockResponse = {
        result: 'created',
        statusCode: HTTP_CREATED,
      };
      (repository.listAll as jest.Mock).mockResolvedValue({
        responseBody: [],
        status: HTTP_OK,
      });

      (repository.createItem as jest.Mock).mockResolvedValue({
        responseBody: mockResponse,
        status: HTTP_CREATED,
      });

      const result = await service.createItem({
        body: {
          roleId: 'exampleId',
          moduleId: 'exampleId',
          actions: ['action'],
        },
      } as RequestI);
      expect(result).toEqual({
        result: mockResponse,
        statusCode: HTTP_CREATED,
      });
    });

    it('should throw a ConflictException if a permission exists', async () => {
      (repository.listAll as jest.Mock).mockResolvedValue({
        responseBody: [
          {
            _id: '1',
            roleId: 'exampleId',
            moduleId: 'exampleId',
          },
        ],
        status: HTTP_OK,
      });

      const result = await service.createItem({
        body: {
          roleId: 'exampleId',
          moduleId: 'exampleId',
          actions: ['action'],
        },
      } as RequestI);

      expect(result).toEqual({
        result: 'The permission already exists',
        statusCode: HTTP_CONFLICT,
      });
    });

    it('should throw an InternalServerErrorException when status is 500', async () => {
      (repository.createItem as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: HTTP_INTERNAL_SERVER_ERROR,
      });

      (repository.listAll as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: HTTP_INTERNAL_SERVER_ERROR,
      });

      const result = await service.createItem({
        body: {
          roleId: 'exampleId',
          moduleId: 'exampleId',
          actions: ['action'],
        },
      } as RequestI);

      expect(result).toEqual({
        result: 'Error',
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('createMultiItems', () => {
    it('should map permissions and create multiple items successfully', async () => {
      const params: RequestI = {
        companyPrefix: 'testCompany',
        body: {
          roleId: '123',
          permissions: [
            { name: 'perm1', fullAccess: true, actions: ['read'] },
            { name: 'perm2', fullAccess: false, actions: ['write'] },
          ],
        },
      };
      const mockResponse = {
        responseBody: [{ id: 'perm1' }, { id: 'perm2' }],
        status: HTTP_OK,
      };

      (repository.createMultiItems as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await service.createMultiItems(params);

      expect(result).toEqual({
        result: mockResponse.responseBody,
        statusCode: mockResponse.status,
      });
      expect(repository.createMultiItems).toHaveBeenCalledWith(
        params.body.roleId,
        [
          { name: 'perm1', fullAccess: true, actions: ['read'] },
          { name: 'perm2', fullAccess: false, actions: [] },
        ],
        params.companyPrefix,
      );
    });

    it('should throw InternalServerErrorException if status is 500', async () => {
      (repository.createMultiItems as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: HTTP_INTERNAL_SERVER_ERROR,
      });

      const params: RequestI = {
        companyPrefix: 'testCompany',
        body: {
          roleId: '123',
          permissions: [{ name: 'perm1', fullAccess: true, actions: ['read'] }],
        },
      };

      const result = await service.createMultiItems(params as RequestI);

      expect(result).toEqual({
        result: 'Error',
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('updateItem', () => {
    it('should update and return the updated permission', async () => {
      const mockResponse = {
        result: 'updated',
        statusCode: HTTP_OK,
      };
      (repository.updateItem as jest.Mock).mockResolvedValue({
        responseBody: mockResponse,
        status: HTTP_OK,
      });

      const result = await service.updateItem({
        id: '1',
        body: {
          actions: ['action'],
        },
      } as RequestI);
      expect(result).toEqual({
        result: 'updated',
        statusCode: HTTP_OK,
      });
    });

    it('should throw an InternalServerErrorException when status is 500', async () => {
      (repository.updateItem as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: HTTP_INTERNAL_SERVER_ERROR,
      });

      const result = await service.updateItem({
        id: '1',
        body: {},
      } as RequestI);

      expect(result).toEqual({
        result: 'Error',
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('deleteItem', () => {
    it('should delete a permission and return the result', async () => {
      const mockResponse = { id: '1', result: 'updated' };
      (repository.deleteItem as jest.Mock).mockResolvedValue({
        responseBody: mockResponse,
        status: HTTP_OK,
      });

      const result = await service.deleteItem({ id: '1' } as RequestI);
      expect(result).toEqual({
        id: '1',
        result: 'updated',
        statusCode: HTTP_OK,
      });
    });

    it('should throw an InternalServerErrorException when status is 500', async () => {
      (repository.deleteItem as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: HTTP_INTERNAL_SERVER_ERROR,
      });

      const result = await service.deleteItem({
        id: '1',
      } as RequestI);

      expect(result).toEqual({
        result: 'Error',
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
    });
  });
});
