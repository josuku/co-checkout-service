import { BadRequestException, Body, Controller, HttpCode, InternalServerErrorException, Logger, Post, Res } from '@nestjs/common';
import { CheckoutResponse, Order } from './checkout.interface';
import { CheckoutService } from './checkout.service';

@Controller()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('checkout')
  public async checkoutOrder(@Body() body: Order): Promise<CheckoutResponse> {
    Logger.log('body:',body)
    if (!this.checkoutService.checkOrderIsCorrect(body)) {
      Logger.log('Bad Request', body);
      throw new BadRequestException();
    }
    return this.checkoutService.checkoutOrder(body);
  }
}