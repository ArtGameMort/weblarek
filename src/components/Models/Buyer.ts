import {IBuyer, TBuyerErrors, TPayment} from '../../types';

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

    validate(): TBuyerErrors{
        const errors: TBuyerErrors = {};
        if (!this.payment){
            errors.payment = "выбери способ оплаты"
        }
        if (!this.email){
            errors.email = "Укажите email"
        }
        if (!this.phone){
            errors.phone = "Укажите phone"
        }
        if (!this.address){
            errors.address = "Укажите address"
        }
        return errors;
    }
}