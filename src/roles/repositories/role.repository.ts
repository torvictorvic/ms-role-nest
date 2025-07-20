import { Injectable } from '@nestjs/common';
import { RoleRepositoryI } from '../interfaces/role.repository.interface';
import { SearchOptions } from '@localrepo/lib_data_access_elasticsearch';
import { LookupParams } from '@localrepo/lib_data_access_mongodb';
import { DbClients } from '@/utils/constants.util';

@Injectable()
export class RoleRepository implements RoleRepositoryI {
  protected client: DbClients;

  constructor(clients: DbClients) {
    this.client = clients;
  }

  private getIndex(companyPrefix: string): Record<string, string> {
    return {
      roles: `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_ROLES}`,
      modules: `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_MODULE}`,
    };
  }

  async listAll(
    options: SearchOptions,
    companyPrefix: string,
    references?: any[],
    isModuleQuery?: boolean,
  ): Promise<any> {
    const index = this.getIndex(companyPrefix);
    if (isModuleQuery) {
      return this.client.elastic.search(index.modules, options, false);
    }

    return this.client.mongodb.search(index.roles, options, references);
  }

  async listAllWithPagination(
    options: SearchOptions,
    companyPrefix: string,
    references?: any[],
  ): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.search(index.roles, options, references);
  }

  async getItem(
    id: string,
    companyPrefix: string,
    references?: LookupParams[],
  ): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.get(index.roles, id, references);
  }

  async createItem(params: any, companyPrefix: string): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.create(index.roles, params);
  }

  async updateItem(
    id: string,
    params: any,
    companyPrefix: string,
  ): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.update(index.roles, id, params);
  }

  async deleteItem(id: string, companyPrefix: string): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.delete(index.roles, id);
  }

  async isUnique(
    conditions: Record<string, any>,
    companyPrefix: string,
  ): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.isItemUnique(index.roles, conditions);
  }
}
