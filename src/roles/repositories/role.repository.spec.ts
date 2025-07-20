import { RoleRepository } from './role.repository';
import { DbClients } from '@/utils/constants.util';
import { SearchOptions } from '@localrepo/lib_data_access_elasticsearch';
import { LookupParams } from '@localrepo/lib_data_access_mongodb';

describe('RoleRepository', () => {
  let roleRepository: RoleRepository;
  let mockDbClients: jest.Mocked<DbClients>;

  beforeEach(() => {
    mockDbClients = {
      elastic: {
        search: jest.fn(),
      },
      mongodb: {
        search: jest.fn(),
        get: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        isItemUnique: jest.fn(),
      },
    } as unknown as jest.Mocked<DbClients>;

    roleRepository = new RoleRepository(mockDbClients);
  });

  it('should be defined', () => {
    expect(roleRepository).toBeDefined();
  });

  describe('listAll', () => {
    it('should search in the elastic client when isModuleQuery is true', async () => {
      const options: SearchOptions = { size: 10, from: 0 };
      const companyPrefix = 'test_company';
      const mockResponse = { hits: [] };
      (mockDbClients.elastic.search as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await roleRepository.listAll(
        options,
        companyPrefix,
        [],
        true,
      );

      expect(mockDbClients.elastic.search).toHaveBeenCalledWith(
        `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_MODULE}`,
        options,
        false,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should search in the mongodb client when isModuleQuery is false', async () => {
      const options: SearchOptions = { size: 10, from: 0 };
      const companyPrefix = 'test_company';
      const references: any[] = [];
      const mockResponse = { data: [] };
      (mockDbClients.mongodb.search as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await roleRepository.listAll(
        options,
        companyPrefix,
        references,
        false,
      );

      expect(mockDbClients.mongodb.search).toHaveBeenCalledWith(
        `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_ROLES}`,
        options,
        references,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('listAllWithPagination', () => {
    it('should search in the mongodb client with pagination', async () => {
      const options: SearchOptions = { size: 10, from: 0 };
      const companyPrefix = 'test_company';
      const references: any[] = [];
      const mockResponse = { data: [] };
      (mockDbClients.mongodb.search as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await roleRepository.listAllWithPagination(
        options,
        companyPrefix,
        references,
      );

      expect(mockDbClients.mongodb.search).toHaveBeenCalledWith(
        `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_ROLES}`,
        options,
        references,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getItem', () => {
    it('should get an item from mongodb', async () => {
      const id = '123';
      const companyPrefix = 'test_company';
      const references: LookupParams[] = [];
      const mockResponse = { id };
      (mockDbClients.mongodb.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await roleRepository.getItem(
        id,
        companyPrefix,
        references,
      );

      expect(mockDbClients.mongodb.get).toHaveBeenCalledWith(
        `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_ROLES}`,
        id,
        references,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createItem', () => {
    it('should create an item in mongodb', async () => {
      const params = { name: 'test' };
      const companyPrefix = 'test_company';
      const mockResponse = { id: '123' };
      (mockDbClients.mongodb.create as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await roleRepository.createItem(params, companyPrefix);

      expect(mockDbClients.mongodb.create).toHaveBeenCalledWith(
        `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_ROLES}`,
        params,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateItem', () => {
    it('should update an item in mongodb', async () => {
      const id = '123';
      const params = { name: 'updated' };
      const companyPrefix = 'test_company';
      const mockResponse = { id, ...params };
      (mockDbClients.mongodb.update as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await roleRepository.updateItem(id, params, companyPrefix);

      expect(mockDbClients.mongodb.update).toHaveBeenCalledWith(
        `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_ROLES}`,
        id,
        params,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteItem', () => {
    it('should delete an item in mongodb', async () => {
      const id = '123';
      const companyPrefix = 'test_company';
      const mockResponse = { success: true };
      (mockDbClients.mongodb.delete as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await roleRepository.deleteItem(id, companyPrefix);

      expect(mockDbClients.mongodb.delete).toHaveBeenCalledWith(
        `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_ROLES}`,
        id,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('isUnique', () => {
    it('should check if an item is unique in mongodb', async () => {
      const conditions = { name: 'uniqueName' };
      const companyPrefix = 'test_company';
      const mockResponse = { isUnique: true };
      (mockDbClients.mongodb.isItemUnique as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await roleRepository.isUnique(conditions, companyPrefix);

      expect(mockDbClients.mongodb.isItemUnique).toHaveBeenCalledWith(
        `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_ROLES}`,
        conditions,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
