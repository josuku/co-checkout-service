import { Injectable, Logger } from '@nestjs/common';
import { CheckoutResponse, Order, Product } from './checkout.interface';
import { ClientOptions, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { randomInt } from 'crypto';
import { bill_ms_port, bill_ms_host, logistic_ms_host, logistic_ms_port } from 'src/config';
import { resolve } from 'path';

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

  public async checkoutOrder(order: Order): Promise<CheckoutResponse> {
    let result: CheckoutResponse = {
      id: 1,
      success: true,
      errorMessage: null,
      total: 0,
      sentOrderId: 0
    };

    // 1. SAVE ORDER (OrderService)
    result.id = randomInt(1000);

    result.total = await this.calculateTotal(order.products);

    result.sentOrderId = await this.createSentOrder(result.id);

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

  async calculateTotal(products: Product[]): Promise<number> {
    return new Promise((resolve, reject) => {
      this.billService.send('calculateTotal', products).subscribe(async (result) => {
        if (result.errorMessage) {
          reject(result.errorMessage);
        } else {
          resolve(result.total);
        }
      });
    });
  }

  async createSentOrder(orderId: number): Promise<number>  {
    return new Promise((resolve, reject) => {
      this.logisticService.send('createSentOrder', orderId).subscribe(async (result) => {
        if (result.errorMessage) {
          reject(result.errorMessage);
        } else {
          resolve(result.id);
        }
      });
    });
  }
}
