import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { RoleControllerI } from '../interfaces/role.controller.interface';
import { apiResponse, RequestI, ResponseI } from '@/utils/constants.util';
import { RoleServiceI } from '../interfaces/role.service.interface';
import { EventLambda } from '@/decorators/event-lambda/event-lambda.decorator';
import { PaginationDto } from '../dto/pagination.dto';
import { UpdateRoleDto, RoleDto } from '../dto/role.dto';
import { Response } from 'express';
import { QueryDto } from '../dto/query.dto';

@Controller('roles')
export class RoleController implements RoleControllerI {
  constructor(@Inject('ROLE_SERVICE') private readonly service: RoleServiceI) {}

  @Get('list-all')
  async listAll(
    @EventLambda('authorizer') event: any,
    @Query() query: PaginationDto,
    @Res() res: Response,
  ): Promise<ResponseI> {
    const params: RequestI = {
      ...query,
      companyPrefix: event.companyPrefix,
    };

    const response: ResponseI = await this.service.listAll(params);

    return apiResponse(res, response);
  }

  @Get('paginate')
  async listAllWithPagination(
    @EventLambda('authorizer') event: any,
    @Query() query: PaginationDto,
    @Res() res: Response,
  ): Promise<ResponseI> {
    const params: RequestI = {
      ...query,
      companyPrefix: event.companyPrefix,
    };

    const response: ResponseI =
      await this.service.listAllWithPagination(params);

    return apiResponse(res, response);
  }

  @Get('get')
  async getItem(
    @EventLambda('authorizer') event: any,
    @Query('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseI> {
    const params: RequestI = {
      id: id,
      companyPrefix: event.companyPrefix,
    };

    const response: ResponseI = await this.service.getItem(params);

    return apiResponse(res, response);
  }

  @Get('module-access')
  async getModuleAccess(
    @EventLambda('authorizer') event: any,
    @Query() query: QueryDto,
    @Res() res: Response,
  ): Promise<ResponseI> {
    const params: RequestI = {
      ...query,
      companyPrefix: event.companyPrefix,
    };

    const response: ResponseI = await this.service.getModuleAccess(params);

    return apiResponse(res, response);
  }

  @Post('create')
  async createItem(
    @EventLambda('authorizer') event: any,
    @Body() payload: RoleDto,
    @Res() res: Response,
  ): Promise<ResponseI> {
    const params: RequestI = {
      body: payload,
      companyPrefix: event.companyPrefix,
    };

    const response: ResponseI = await this.service.createItem(params);

    return apiResponse(res, response);
  }

  @Put('update')
  async updateItem(
    @EventLambda('authorizer') event: any,
    @Query('id') id: string,
    @Body() payload: UpdateRoleDto,
    @Res() res: Response,
  ): Promise<ResponseI> {
    const params: RequestI = {
      id: id,
      body: payload,
      companyPrefix: event.companyPrefix,
    };

    const response: ResponseI = await this.service.updateItem(params);

    return apiResponse(res, response);
  }

  @Delete('delete')
  async deleteItem(
    @EventLambda('authorizer') event: any,
    @Query('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseI> {
    const params: RequestI = {
      id: id,
      companyPrefix: event.companyPrefix,
    };

    const response: ResponseI = await this.service.deleteItem(params);

    return apiResponse(res, response);
  }
}
