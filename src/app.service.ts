import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'This is wodo demo service as a template to create NodeJS based modules and services.';
  }
}
