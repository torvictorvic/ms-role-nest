import { Module } from '@nestjs/common';
import { DbService } from '@/config/databases.config';
import { PermissionController } from './controllers/permission.controller';
import { PermissionService } from './services/permission.service';
import { PermissionRepository } from './repositories/permission.respository';

@Module({
  imports: [],
  controllers: [PermissionController],
  providers: [
    {
      provide: 'PERMISSION_SERVICE',
      useClass: PermissionService,
    },
    {
      provide: 'PERMISSION_REPOSITORY',
      useFactory: (dbService: DbService) => {
        const dbClients = dbService.dbClients();
        return new PermissionRepository(dbClients);
      },
      inject: [DbService],
    },
    DbService,
  ],
  exports: ['PERMISSION_SERVICE', 'PERMISSION_REPOSITORY', DbService],
})
export class PermissionsModule {}
