export interface Order {
    clientId: number;
    date: Date;
    direction: string;
    products: Product[];
}

export interface Product {
    id: number;
    quantity: number;
    cost: number;
}

export interface CheckoutResponse {
    id: number;
    success: boolean;
    errorMessage: string;
}
