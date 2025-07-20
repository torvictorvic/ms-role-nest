import { createParamDecorator } from '@nestjs/common';
import { LambdaEventService } from '@/commons/lambda-event.service';
import { saveLog } from '@/utils/helpers.util';

export const EventLambda = createParamDecorator((field: string) => {
  try {
    const request = LambdaEventService.getEvent();

    if (process.env.STAGE === 'local') {
      request.requestContext.authorizer = {
        companyPrefix: 'organization', // ? MODIFIQUE A SU GUSTO EL COMPANY PREFIX SEGÚN SU NECESIDAD PARA PRUEBAS EN AMBIENTE LOCAL
      };
    }

    return field ? request.requestContext?.[field] : request.requestContext;
  } catch (error) {
    saveLog('ERROR', `@@@${error}`, 'EventLambda');
  }
});
