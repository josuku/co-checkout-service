import { BadRequestException, Body, Controller, Logger, Post } from '@nestjs/common';
import { CheckoutResponse, Order } from './checkout.interface';
import { CheckoutService } from './checkout.service';

@Controller()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('checkout')
  public async checkoutOrder(@Body() body: Order): Promise<CheckoutResponse> {
    Logger.log('received checkout request', 'checkout')
    if (!this.checkoutService.checkOrderIsValid(body)) {
      Logger.error('Bad Request');
      throw new BadRequestException();
    }
    return this.checkoutService.checkoutOrder(body);
  }
}
