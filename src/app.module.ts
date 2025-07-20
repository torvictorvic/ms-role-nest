import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import CipherMiddleware from './middleware/http-cipher.middleware';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './roles/role.module';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundFilter } from './filters/not-found.filter';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    RoleModule,
    PermissionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    process.env.STAGE = 'local';
    if (process.env.STAGE != 'local') {
      consumer.apply(CipherMiddleware).forRoutes('*');
    }
  }
}
