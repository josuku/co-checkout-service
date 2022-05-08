import { Injectable, Logger } from '@nestjs/common';
import { CheckoutResponse, Order, Product } from './checkout.interface';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';
import { bill_ms_port, bill_ms_host, logistic_ms_host, logistic_ms_port, order_ms_host, order_ms_port } from 'src/config';

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

  private readonly orderService = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
        host: order_ms_host,
        port: order_ms_port as number
    }
  });

  public async checkoutOrder(order: Order): Promise<CheckoutResponse> {
    let result: CheckoutResponse = {
      id: 0,
      errorMessage: null
    };

    try {
      order.id = await this.saveOrder(order);

      order.total = await this.calculateTotal(order.products);

      await this.createSentOrder(order.id);

      await this.confirmOrder(order);
      
      result.id = order.id;
    }
    catch (error) {
      result.errorMessage = error;
    }

    return result;
  }

  public checkOrderIsValid(order: Order): boolean {
    if (!order.clientId || !order.date || !order.direction || !order.products || order.products.length === 0) {
      return false;
    }
    for (const product in order.products) {
      if (!order.products[product].productId || !order.products[product].cost || !order.products[product].quantity) {
        return false;
      }
    }
    return true;
  }

  async saveOrder(order: Order): Promise<number> {
    return new Promise((resolve, reject) => {
      order.confirmed = false;
      this.orderService.send('create', order).subscribe(async (result) => {
        if (result.errorMessage) {
          reject(result.errorMessage);
        } else {
          resolve(result.id);
        }
      });
    });
  }

  async confirmOrder(order: Order): Promise<boolean> {
    return new Promise((resolve, reject) => {
      order.confirmed = true;
      this.orderService.send('modify', order).subscribe(async (result) => {
        if (result.errorMessage) {
          reject(result.errorMessage);
        } else {
          resolve(true);
        }
      });
    });
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
