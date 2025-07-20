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
import { PermissionControllerI } from '../interfaces/permission.controller.interface';
import { apiResponse, RequestI, ResponseI } from '@/utils/constants.util';
import { PermissionServiceI } from '../interfaces/permission.service.interface';
import { EventLambda } from '@/decorators/event-lambda/event-lambda.decorator';
import { PaginationDto } from '../dto/pagination.dto';
import {
  UpdatePermissionDto,
  PermissionDto,
  MultiPermissionDTO,
} from '../dto/permission.dto';
import { Response } from 'express';

@Controller('permissions')
export class PermissionController implements PermissionControllerI {
  constructor(
    @Inject('PERMISSION_SERVICE') private readonly service: PermissionServiceI,
  ) {}

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

  @Post('create')
  async createItem(
    @EventLambda('authorizer') event: any,
    @Body() payload: PermissionDto,
    @Res() res: Response,
  ): Promise<ResponseI> {
    const params: RequestI = {
      body: payload,
      companyPrefix: event.companyPrefix,
    };

    const response: ResponseI = await this.service.createItem(params);

    return apiResponse(res, response);
  }

  @Post('multi-create')
  async createMultiItems(
    @EventLambda('authorizer') event: any,
    @Body() payload: MultiPermissionDTO,
    @Res() res: Response,
  ): Promise<ResponseI> {
    const params: RequestI = {
      body: payload,
      companyPrefix: event.companyPrefix,
    };

    const response: ResponseI = await this.service.createMultiItems(params);
    /*
    const response: ResponseI = {
      id: "12345",
      totalCount: "10",
      result: {
        data: [
          { name: "Item 1", value: "Value 1" },
          { name: "Item 2", value: "Value 2" }
        ]
      },
      errors: null,
      statusCode: 200
    };*/

    return apiResponse(res, response);
  }

  @Put('update')
  async updateItem(
    @EventLambda('authorizer') event: any,
    @Query('id') id: string,
    @Body() payload: UpdatePermissionDto,
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
