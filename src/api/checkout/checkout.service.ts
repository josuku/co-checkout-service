import { Injectable, Logger } from '@nestjs/common';
import { CheckoutResponse, Order } from './checkout.interface';

@Injectable()
export class CheckoutService {
  public checkoutOrder(order: Order): /*Promise<*/CheckoutResponse/*>*/ {
    let result: CheckoutResponse = {
      id: 1,
      success: true,
      errorMessage: null
    };

    // 1. SAVE ORDER (OrderService)

    // 2. PROCESS BILL (BillService)

    // 3. PROCESS LOGISTIC (LogisticService)

    // 4. CONFIRM ORDER

    return result;
  }

  public checkOrderIsCorrect(order: Order): boolean {
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
}
