import { IBuyer, TPayment } from '../../types';

export class Buyer {
    private payment: TPayment | null = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    setPayment(payment: TPayment): void {
        this.payment = payment;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    getData(): IBuyer {
        return {
            address: this.address,
            email: this.email,
            payment: this.payment,
            phone: this.phone,
        };
    }

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
    };
}