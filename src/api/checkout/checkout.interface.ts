export interface Order {
    clientId: number;
    date: Date;
    direction: string;
    products: Product[];
    confirmed: boolean;
    id: number;
    total: number;
    logisticId: number;
}

export interface Product {
    id: number;
    quantity: number;
    cost: number;
}

export interface CheckoutResponse {
    id: number;
    errorMessage: string;
}
