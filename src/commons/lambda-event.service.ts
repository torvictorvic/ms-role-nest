import { Injectable } from '@nestjs/common';

@Injectable()
export class LambdaEventService {
  private static event: any;

  static setEvent(event: any) {
    this.event = event;
  }

  static getEvent(): any {
    return this.event;
  }
}
