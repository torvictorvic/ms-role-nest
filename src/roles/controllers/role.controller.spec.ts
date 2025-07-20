import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { apiResponse, HTTP_CREATED, HTTP_OK } from '@/utils/constants.util';
import { RoleController } from '@/roles/controllers/role.controller';
import { RoleServiceI } from '@/roles/interfaces/role.service.interface';
import { PaginationDto } from '@/roles/dto/pagination.dto';
import { RoleDto, UpdateRoleDto } from '@/roles/dto/role.dto';
import { QueryDto } from '../dto/query.dto';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleServiceI;

  const mockService = {
    listAll: jest.fn(),
    listAllWithPagination: jest.fn(),
    getItem: jest.fn(),
    createItem: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
    getModuleAccess: jest.fn(),
  };

  const mockRes = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: 'ROLE_SERVICE',
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleServiceI>('ROLE_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listAll', () => {
    it('should call service.listAll and return a response', async () => {
      const event = { companyPrefix: 'company1' };
      const query: PaginationDto = { from: 1, size: 10 };
      const serviceResponse = { result: [], statusCode: HTTP_OK };
      mockService.listAll.mockResolvedValue(serviceResponse);

      const result = await controller.listAll(event, query, mockRes);

      expect(service.listAll).toHaveBeenCalledWith({
        ...query,
        companyPrefix: event.companyPrefix,
      });
      expect(result).toEqual(apiResponse(mockRes, serviceResponse));
    });
  });

  describe('listAllWithPagination', () => {
    it('should call service.listAllWithPagination and return a response', async () => {
      const event = { companyPrefix: 'company1' };
      const query: PaginationDto = { from: 1, size: 10 };
      const serviceResponse = { result: [], statusCode: HTTP_OK };
      mockService.listAllWithPagination.mockResolvedValue(serviceResponse);

      const result = await controller.listAllWithPagination(
        event,
        query,
        mockRes,
      );

      expect(service.listAllWithPagination).toHaveBeenCalledWith({
        ...query,
        companyPrefix: event.companyPrefix,
      });
      expect(result).toEqual(apiResponse(mockRes, serviceResponse));
    });
  });

  describe('getItem', () => {
    it('should call service.getItem and return a response', async () => {
      const event = { companyPrefix: 'company1' };
      const id = '123';
      const serviceResponse = { result: {}, statusCode: HTTP_OK };
      mockService.getItem.mockResolvedValue(serviceResponse);

      const result = await controller.getItem(event, id, mockRes);

      expect(service.getItem).toHaveBeenCalledWith({
        id,
        companyPrefix: event.companyPrefix,
      });
      expect(result).toEqual(apiResponse(mockRes, serviceResponse));
    });
  });

  describe('createItem', () => {
    it('should call service.createItem and return a response', async () => {
      const event = { companyPrefix: 'company1' };
      const payload: RoleDto = {
        name: '',
        description: '',
      };
      const serviceResponse = {
        result: { statusCode: HTTP_CREATED },
        statusCode: HTTP_CREATED,
      };
      mockService.createItem.mockResolvedValue(serviceResponse);

      const result = await controller.createItem(event, payload, mockRes);

      expect(service.createItem).toHaveBeenCalledWith({
        body: payload,
        companyPrefix: event?.companyPrefix,
      });
      expect(result).toEqual(apiResponse(mockRes, serviceResponse));
    });
  });

  describe('updateItem', () => {
    it('should call service.updateItem and return a response', async () => {
      const event = { companyPrefix: 'company1' };
      const id = '123';
      const payload: UpdateRoleDto = { name: 'Updated Company' };
      const serviceResponse = {
        result: {
          statusCode: HTTP_OK,
        },
        statusCode: HTTP_OK,
      };
      mockService.updateItem.mockResolvedValue(serviceResponse);

      const result = await controller.updateItem(event, id, payload, mockRes);

      expect(service.updateItem).toHaveBeenCalledWith({
        id,
        body: payload,
        companyPrefix: event?.companyPrefix,
      });
      expect(result).toEqual(apiResponse(mockRes, serviceResponse));
    });
  });

  describe('deleteItem', () => {
    it('should call service.deleteItem and return a response', async () => {
      const event = { companyPrefix: 'company1' };
      const id = '123';
      const serviceResponse = {
        result: {
          statusCode: HTTP_OK,
        },
        statusCode: HTTP_OK,
      };
      mockService.deleteItem.mockResolvedValue(serviceResponse);

      const result = await controller.deleteItem(event, id, mockRes);

      expect(service.deleteItem).toHaveBeenCalledWith({
        id,
        companyPrefix: event.companyPrefix,
      });
      expect(result).toEqual(apiResponse(mockRes, serviceResponse));
    });
  });

  describe('getModuleAccess', () => {
    it('should call service.getModuleAccess and return a response', async () => {
      const event = { companyPrefix: 'company1' };
      const query: QueryDto = {
        filters:
          '%5B%7B%22type%22%3A%22board%22%7D%2C%7B%22status%22%3A%22active%22%7D%5D',
        fields: '%5B%22name%22%2C%22view%22%2C%22type%22%5D',
        id: '1',
      };
      const serviceResponse = { result: [], statusCode: HTTP_OK };
      mockService.getModuleAccess.mockResolvedValue(serviceResponse);

      const result = await controller.getModuleAccess(event, query, mockRes);

      expect(service.getModuleAccess).toHaveBeenCalledWith({
        ...query,
        companyPrefix: event.companyPrefix,
      });
      expect(result).toEqual(apiResponse(mockRes, serviceResponse));
    });
  });
});
