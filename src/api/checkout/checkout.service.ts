import { Injectable, Logger } from '@nestjs/common';
import { CheckoutResponse, Order, Product } from './checkout.interface';
import { ClientOptions, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { randomInt } from 'crypto';
import { bill_ms_port, bill_ms_host, logistic_ms_host, logistic_ms_port } from 'src/config';

@Injectable()
export class CheckoutService {

  private readonly logisticService = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
        host: logistic_ms_host,
        port: logistic_ms_port as number
    }
  });

  private readonly billService = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
        host: bill_ms_host,
        port: bill_ms_port as number
    }
  });

  public async checkoutOrder(order: Order): /*Promise<*/Promise</*Promise<*/ CheckoutResponse /*>*/>/*>*/ {
    let result: CheckoutResponse = {
      id: 1,
      success: true,
      errorMessage: null
    };

    // 1. SAVE ORDER (OrderService)
    const orderId = randomInt(1000);

    await this.calculateTotal(order.products);

    await this.createSentOrder(orderId);

    // 4. CONFIRM ORDER

    return result;
  }

  public checkOrderIsValid(order: Order): boolean {
    if (!order.clientId || !order.date || !order.products || order.products.length === 0) {
      return false;
    }
    for (const product in order.products) {
      if (!order.products[product].id || !order.products[product].cost || !order.products[product].quantity) {
        return false;
      }
    }
    return true;
  }

  async calculateTotal(products: Product[]) {
    this.billService.send('calculateTotal', products).subscribe(async (result) => {
        console.log('calculateTotal -> ', result)
    });
  }

  async createSentOrder(orderId: number) {
    this.logisticService.send('createSentOrder', orderId).subscribe(async (result) => {
        console.log('createSentOrder -> ', result)
    });
  }
}
