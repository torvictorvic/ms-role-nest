import { Injectable } from '@nestjs/common';
import { PermissionRepositoryI } from '../interfaces/permission.repository.interface';
import { SearchOptions } from '@localrepo/lib_data_access_elasticsearch';
import { LookupParams } from '@localrepo/lib_data_access_mongodb';
import { DbClients } from '@/utils/constants.util';

@Injectable()
export class PermissionRepository implements PermissionRepositoryI {
  protected client: DbClients;

  constructor(clients: DbClients) {
    this.client = clients;
  }

  private getIndex(companyPrefix: string): string {
    return `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${process.env.INDEX_PERMISSIONS_HOME}`;
  }

  async listAll(
    options: SearchOptions,
    companyPrefix: string,
    references?: any[],
  ): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.search(index, options, references);
  }

  async listAllWithPagination(
    options: SearchOptions,
    companyPrefix: string,
    references?: any[],
  ): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.search(index, options, references);
  }

  async getItem(
    id: string,
    companyPrefix: string,
    references?: LookupParams[],
  ): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.get(index, id, references);
  }

  async createItem(params: any, companyPrefix: string): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.create(index, params);
  }

  async createMultiItems(
    roleId: string,
    params: any,
    companyPrefix: string,
  ): Promise<any> {
    const index = this.getIndex(companyPrefix);
    await this.client.mongodb.deleteMany(index, [{ roleId: roleId }]);
    return this.client.mongodb.insertMany(index, params);
  }

  async updateItem(
    id: string,
    params: any,
    companyPrefix: string,
  ): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.update(index, id, params);
  }

  async deleteItem(id: string, companyPrefix: string): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.delete(index, id);
  }

  async isUnique(
    conditions: Record<string, any>,
    companyPrefix: string,
  ): Promise<any> {
    const index = this.getIndex(companyPrefix);
    return this.client.mongodb.isItemUnique(index, conditions);
  }
}
