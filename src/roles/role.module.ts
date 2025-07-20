import { Module } from '@nestjs/common';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { RoleRepository } from './repositories/role.repository';
import { DbService } from '@/config/databases.config';

@Module({
  imports: [],
  controllers: [RoleController],
  providers: [
    {
      provide: 'ROLE_SERVICE',
      useClass: RoleService,
    },
    {
      provide: 'ROLE_REPOSITORY',
      useFactory: (dbService: DbService) => {
        const dbClients = dbService.dbClients();
        return new RoleRepository(dbClients);
      },
      inject: [DbService],
    },
    DbService,
  ],
  exports: ['ROLE_SERVICE', 'ROLE_REPOSITORY', DbService],
})
export class RoleModule {}
