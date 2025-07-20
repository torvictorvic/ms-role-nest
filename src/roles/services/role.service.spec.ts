import { Test, TestingModule } from '@nestjs/testing';
import {
  HTTP_CONFLICT,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_OK,
  RequestI,
} from '@/utils/constants.util';
import { RoleService } from './role.service';
import { RoleRepositoryI } from '../interfaces/role.repository.interface';

const mockRoleRepository = () => ({
  listAll: jest.fn(),
  listAllWithPagination: jest.fn(),
  getItem: jest.fn(),
  createItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn(),
});

describe('RoleService', () => {
  let service: RoleService;
  let repository: RoleRepositoryI;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: 'ROLE_REPOSITORY', useFactory: mockRoleRepository },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    repository = module.get<RoleRepositoryI>('ROLE_REPOSITORY');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listAll', () => {
    it('should return a mapped list of roles', async () => {
      const mockResponse = [
        { _id: '1', name: 'example', description: 'example' },
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
            name: 'example',
            description: 'example',
          },
        ],
        statusCode: HTTP_OK,
      });
    });

    it('should throw an InternalServerErrorException when status is 500', async () => {
      (repository.listAll as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: 500,
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
        { _id: '1', name: 'example', description: 'example' },
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
        result: [
          {
            _id: '1',
            name: 'example',
            description: 'example',
          },
        ],
        totalCount: 1,
        statusCode: HTTP_OK,
      });
    });

    it('should throw an InternalServerErrorException when status is 500', async () => {
      (repository.listAllWithPagination as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: 500,
      });

      const result = await service.listAllWithPagination({} as RequestI);

      expect(result).toEqual({
        result: 'Error',
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('getItem', () => {
    it('should return a role by id', async () => {
      const mockRole = { _id: '1', name: 'example', description: 'example' };
      (repository.getItem as jest.Mock).mockResolvedValue({
        responseBody: mockRole,
        status: HTTP_OK,
      });

      const result = await service.getItem({ id: '1' } as RequestI);
      expect(result).toEqual({
        result: { _id: '1', name: 'example', description: 'example' },
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
    it('should create a new role and return the created role', async () => {
      let name: string = 'Role1';
      const mockResponse = { id: '1', name: 'role1' };
      (repository.listAll as jest.Mock).mockResolvedValue({
        responseBody: [],
        status: HTTP_OK,
      });

      (repository.createItem as jest.Mock).mockResolvedValue({
        responseBody: mockResponse,
        status: 201,
      });

      name = name.toLowerCase();

      const result = await service.createItem({
        body: { name: name, description: 'TC' },
      } as RequestI);
      expect(result).toEqual({
        id: '1',
        result: mockResponse,
        statusCode: 201,
      });
    });

    it('should throw a ConflictException if a role with the same domain or prefix exists', async () => {
      (repository.listAll as jest.Mock).mockResolvedValue({
        responseBody: [{ _id: '1', name: 'example', description: 'example' }],
        status: HTTP_OK,
      });

      const result = await service.createItem({
        body: { name: 'example', description: 'example' },
      } as RequestI);

      expect(result).toEqual({
        result: 'The role already exists',
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
        body: { name: 'example', description: 'example' },
      } as RequestI);

      expect(result).toEqual({
        result: 'Error',
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('updateItem', () => {
    it('should update and return the updated role', async () => {
      const mockResponse = { id: '1', result: 'UpdatedRole' };
      (repository.updateItem as jest.Mock).mockResolvedValue({
        responseBody: mockResponse,
        status: HTTP_OK,
      });

      const result = await service.updateItem({
        id: '1',
        body: {},
      } as RequestI);
      expect(result).toEqual({
        id: '1',
        result: 'UpdatedRole',
        statusCode: HTTP_OK,
      });
    });

    it('should throw an InternalServerErrorException when status is 500', async () => {
      (repository.updateItem as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: 500,
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
    it('should delete a role and return the result', async () => {
      const mockResponse = { id: '1', result: 'DeletedRole' };
      (repository.deleteItem as jest.Mock).mockResolvedValue({
        responseBody: mockResponse,
        status: HTTP_OK,
      });

      const result = await service.deleteItem({ id: '1' } as RequestI);
      expect(result).toEqual({
        id: '1',
        result: 'DeletedRole',
        statusCode: HTTP_OK,
      });
    });

    it('should throw an InternalServerErrorException when status is 500', async () => {
      (repository.deleteItem as jest.Mock).mockResolvedValue({
        responseBody: 'Error',
        status: 500,
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

  describe('getModuleAccess', () => {
    it('should return consolidated module access when modules and roles are found', async () => {
      const mockParams: RequestI = {
        companyPrefix: 'test_company',
        filters: '',
        fields: '',
      };

      const mockModules = [
        { _id: 'module1', name: 'Module 1', permissions: [] },
        { _id: 'module2', name: 'Module 2', permissions: [] },
      ];

      (repository.listAll as jest.Mock).mockResolvedValue({
        responseBody: mockModules,
        status: 200,
      });

      await service.getModuleAccess(mockParams);

      // expect(service.getItem).toHaveBeenCalledWith(mockParams);
      expect(repository.listAll).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 0,
          size: 500,
          sort: [{ createdAt: 'asc' }],
        }),
        mockParams.companyPrefix,
        [],
        true,
      );

      // expect(result).toEqual({
      //   result: [
      //     { _id: 'module1', name: 'Module 1', fullAccess: true },
      //     { _id: 'module2', name: 'Module 2', fullAccess: false },
      //   ],
      //   statusCode: 200,
      // });
    });

    it('should throw an error when listAll returns an internal server error', async () => {
      const mockParams: RequestI = {
        companyPrefix: 'test_company',
        filters: '',
        fields: '',
      };

      (repository.listAll as jest.Mock).mockResolvedValue({
        responseBody: 'Internal Server Error',
        status: HTTP_INTERNAL_SERVER_ERROR,
      });

      const result = await service.getModuleAccess(mockParams);

      expect(result).toEqual({
        result: 'Internal Server Error',
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
    });

    it('should return an error response if an exception occurs', async () => {
      const mockParams: RequestI = {
        companyPrefix: 'test_company',
        filters: '',
        fields: '',
      };

      jest.spyOn(service, 'getItem').mockRejectedValue(new Error('Error'));

      const result = await service.getModuleAccess(mockParams);

      expect(result).toEqual({
        result: 'Error',
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
    });

    it('should decode filters and fields from the params', async () => {
      const mockParams: RequestI = {
        companyPrefix: 'test_company',
        filters: encodeURIComponent(
          JSON.stringify([
            { type: 'board' },
            { status: 'active' },
            { location: 'SIDEBAR_SETTING' },
          ]),
        ),
        fields: encodeURIComponent(JSON.stringify(['name', 'type'])),
      };

      const mockModules = [
        {
          _id: 'module1',
          name: 'Module 1',
          permissions: [{ moduleId: 'module1', fullAccess: true }],
        },
      ];

      (repository.listAll as jest.Mock).mockResolvedValue({
        responseBody: mockModules,
        status: 200,
      });

      await service.getModuleAccess(mockParams);

      expect(repository.listAll).toHaveBeenCalledWith(
        expect.objectContaining({
          conditions: [
            { type: 'board' },
            { status: 'active' },
            { location: 'SIDEBAR_SETTING' },
          ],
          sourceInclude: ['name', 'type'],
        }),
        mockParams.companyPrefix,
        [],
        true,
      );

      // expect(result).toEqual({
      //   result: [{ _id: 'module1', name: 'Module 1', fullAccess: true }],
      //   statusCode: 200,
      // });
    });
  });
});
