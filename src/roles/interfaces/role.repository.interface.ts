import { SearchOptions } from '@localrepo/lib_data_access_elasticsearch';
import { LookupParams } from '@localrepo/lib_data_access_mongodb';

export interface RoleRepositoryI {
  listAll(
    options: SearchOptions,
    companyPrefix: string,
    references?: any[],
    isModuleQuery?: boolean,
  ): Promise<any>;

  listAllWithPagination(
    options: SearchOptions,
    companyPrefix: string,
    references?: any[],
  ): Promise<any>;

  getItem(
    id: string,
    companyPrefix: string,
    references?: LookupParams[],
  ): Promise<any>;

  createItem(params: any, companyPrefix: string): Promise<any>;

  updateItem(id: string, params: any, companyPrefix: string): Promise<any>;

  deleteItem(id: string, companyPrefix: string): Promise<any>;

  isUnique(
    conditions: Record<string, any>,
    companyPrefix: string,
  ): Promise<any>;
}
