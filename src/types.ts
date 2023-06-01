export type User = {
    name: string;
    password: string;
    email: string;
}

export type Profile = {
    username: string;
    sub: number;
    iat: number;
    exp: number;
}

export type LoginUser = {
    name: string;
    password: string;
}

export type ProductDB = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    cart: {
        id: number;
        quantity: number;
    }
    description: string;
    images: Image[];
    category: Category;
}

export type Category = {
    id: number;
    name: string;
    products: ProductDB[];
}

export type Image = {
    name: string;
    content: any;
}

export type OrderDB = {
    id: number;
    product: ProductDB;
    quantity: number;
}

export type UserDB ={
    id: number;

    name: string;

    password: string;

    email: string;

    cart: CartDB;

}

export type CartDB= {
    id: number;
    quantity: number;
    orders: OrderDB[];
}

export type Card = {
    name: string;
    number: string;
    expirationDate: string;
    cvv: string;
}