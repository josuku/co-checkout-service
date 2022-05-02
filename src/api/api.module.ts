import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout/checkout.controller';
import { CheckoutService } from './checkout/checkout.service';

@Module({
  imports: [],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class ApiModule {}
