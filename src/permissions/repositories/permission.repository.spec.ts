import { PermissionRepository } from './permission.respository';
import { DbClients } from '@/utils/constants.util';
import { SearchOptions } from '@localrepo/lib_data_access_elasticsearch';
import { LookupParams } from '@localrepo/lib_data_access_mongodb';

describe('PermissionRepository', () => {
  let permissionRepository: PermissionRepository;
  let mockClient: DbClients;

  beforeEach(() => {
    mockClient = {
      mongodb: {
        search: jest.fn(),
        get: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        isItemUnique: jest.fn(),
        deleteMany: jest.fn(),
        insertMany: jest.fn(),
      },
    } as any;

    permissionRepository = new PermissionRepository(mockClient);
  });

  describe('getIndex', () => {
    it('should return the correct index based on companyPrefix', () => {
      const companyPrefix = 'testCompany';
      const expectedIndex = `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_PERMISSIONS}`;

      const result = (permissionRepository as any).getIndex(companyPrefix);

      expect(result).toBe(expectedIndex);
    });
  });

  describe('listAll', () => {
    it('should call client.mongodb.search with correct arguments', async () => {
      const options: SearchOptions = {};
      const companyPrefix = 'testCompany';
      const references: any[] = [];
      const index = 'test_index';

      jest
        .spyOn(permissionRepository as any, 'getIndex')
        .mockReturnValue(index);

      await permissionRepository.listAll(options, companyPrefix, references);

      expect(mockClient.mongodb.search).toHaveBeenCalledWith(
        index,
        options,
        references,
      );
    });
  });

  describe('listAllWithPagination', () => {
    it('should call client.mongodb.search with correct arguments', async () => {
      const options: SearchOptions = {};
      const companyPrefix = 'testCompany';
      const references: any[] = [];
      const index = 'test_index';

      jest
        .spyOn(permissionRepository as any, 'getIndex')
        .mockReturnValue(index);

      await permissionRepository.listAllWithPagination(
        options,
        companyPrefix,
        references,
      );

      expect(mockClient.mongodb.search).toHaveBeenCalledWith(
        index,
        options,
        references,
      );
    });
  });

  describe('getItem', () => {
    it('should call client.mongodb.get with correct arguments', async () => {
      const id = 'testId';
      const companyPrefix = 'testCompany';
      const references: LookupParams[] = [];
      const index = 'test_index';

      jest
        .spyOn(permissionRepository as any, 'getIndex')
        .mockReturnValue(index);

      await permissionRepository.getItem(id, companyPrefix, references);

      expect(mockClient.mongodb.get).toHaveBeenCalledWith(
        index,
        id,
        references,
      );
    });
  });

  describe('createItem', () => {
    it('should call client.mongodb.create with correct arguments', async () => {
      const params = { name: 'testPermission' };
      const companyPrefix = 'testCompany';
      const index = 'test_index';

      jest
        .spyOn(permissionRepository as any, 'getIndex')
        .mockReturnValue(index);

      await permissionRepository.createItem(params, companyPrefix);

      expect(mockClient.mongodb.create).toHaveBeenCalledWith(index, params);
    });
  });

  describe('updateItem', () => {
    it('should call client.mongodb.update with correct arguments', async () => {
      const id = 'testId';
      const params = { name: 'updatedPermission' };
      const companyPrefix = 'testCompany';
      const index = 'test_index';

      jest
        .spyOn(permissionRepository as any, 'getIndex')
        .mockReturnValue(index);

      await permissionRepository.updateItem(id, params, companyPrefix);

      expect(mockClient.mongodb.update).toHaveBeenCalledWith(index, id, params);
    });
  });

  describe('deleteItem', () => {
    it('should call client.mongodb.delete with correct arguments', async () => {
      const id = 'testId';
      const companyPrefix = 'testCompany';
      const index = 'test_index';

      jest
        .spyOn(permissionRepository as any, 'getIndex')
        .mockReturnValue(index);

      await permissionRepository.deleteItem(id, companyPrefix);

      expect(mockClient.mongodb.delete).toHaveBeenCalledWith(index, id);
    });
  });

  describe('isUnique', () => {
    it('should call client.mongodb.isItemUnique with correct arguments', async () => {
      const conditions = { name: 'testPermission' };
      const companyPrefix = 'testCompany';
      const index = 'test_index';

      jest
        .spyOn(permissionRepository as any, 'getIndex')
        .mockReturnValue(index);

      await permissionRepository.isUnique(conditions, companyPrefix);

      expect(mockClient.mongodb.isItemUnique).toHaveBeenCalledWith(
        index,
        conditions,
      );
    });
  });

  describe('createMultiItems', () => {
    it('should call client.mongodb.deleteMany an insertMany with correct arguments', async () => {
      const roleId = '1';
      const params = [
        {
          roleId: roleId,
          moduleId: '1',
          fullAccess: true,
          actions: ['create', 'update', 'delete'],
        },
        {
          roleId: roleId,
          moduleId: '1',
          fullAccess: false,
          actions: ['create', 'update', 'show', 'delete', 'detail'],
        },
      ];
      const companyPrefix = 'testCompany';
      const index = 'test_index';

      jest
        .spyOn(permissionRepository as any, 'getIndex')
        .mockReturnValue(index);

      await permissionRepository.createMultiItems(
        roleId,
        params,
        companyPrefix,
      );

      expect(mockClient.mongodb.deleteMany).toHaveBeenCalledWith(index, [
        { roleId: roleId },
      ]);
      expect(mockClient.mongodb.insertMany).toHaveBeenCalledWith(index, params);
    });
  });
});
