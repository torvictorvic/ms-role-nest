import {
  initializeRepository as initializeRepositoryMongoDB,
  RepositoryI as DataLayerMongo,
} from '@localrepo/lib_data_access_mongodb';
import {
  initializeRepository as initializeRepositoryElasticsearch,
  RepositoryI as DataLayerElastic,
} from '@localrepo/lib_data_access_elasticsearch';
import { Injectable } from '@nestjs/common';
import { DbClients } from '@/utils/constants.util';

const CONFIG_PERSISTENCE_ELASTISEARCH = `cloudId=${process.env.CLOUD_ID}|username=${process.env.USERNAME}|password=${process.env.PASSWORD}`;
const CONFIG_PERSISTENCE_MONGODB = `url=${process.env.MONGODB_URL}|dbName=${process.env.MONGODB_DATABASE}`;

@Injectable()
export class DbService {
  private elasticClient: DataLayerElastic;
  private mongoClient: DataLayerMongo;

  constructor() {
    this.elasticClient = initializeRepositoryElasticsearch(
      CONFIG_PERSISTENCE_ELASTISEARCH,
    );
    this.mongoClient = initializeRepositoryMongoDB(CONFIG_PERSISTENCE_MONGODB);
  }

  dbClients(): DbClients {
    return {
      elastic: this.elasticClient,
      mongodb: this.mongoClient,
    };
  }
}
