import {Payment,PaymentRequestPayload} from './payment';
import {_CHECKOUTJS, CONFIG, PAYMENTS, REQUESTPAYLOAD, UTIL} from "../keywords";

const name = 'payPal';

/**
 * @class PayPal
 * @classdesc PayPal
 * @extends Payment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @returns {PayPal}
 * @category PaymentMethods
 * @private
 */
class PayPal extends Payment{
    constructor(parent,collection) {
        super(parent,collection,name);
        this[REQUESTPAYLOAD] =  new PayPalPaymentRequestPayload(parent,{}, name, this);
    }
}

/**
 * @class PayPalPaymentRequestPayload
 * @classdesc The request payload for PayPal.
 * @extends PaymentRequestPayload
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} paymentType
 * @returns {PayPalPaymentRequestPayload}
 * @category PaymentMethods
 */
class PayPalPaymentRequestPayload extends PaymentRequestPayload {

    constructor(parent,collection, name, payment) {
        super(parent,collection, name, payment);
    }

    async getOwner(cartData) {
        let address = cartData.cart.shippingAddress;
        if(!address){
            address = cartData.cart.billingAddress;
        }
        if(address) {
            return ({
                recipient: (address.firstName || '') + " " + (address.lastName  || ''),
                email: address.emailAddress || '',
                phoneNumber: address.phoneNumber || '',
                address: {
                    line1: address.line1 || '',
                    line2: address.line2 || '',
                    city: address.city || '',
                    state: address.countrySubdivision || '',
                    postalCode: address.postalCode || '',
                    country: address.country || ''
                }
            });
        }else{
            return ({});
        }
    }

    async displayItems(cartData) {
        //const _cjs = this[_CHECKOUTJS];
        const lineItems = [];
        if(cartData && cartData.cart.lineItems && cartData.cart.lineItems.lineItem) {
            for (let i = 0; i < cartData.cart.lineItems.lineItem.length; i++) {
                const lineItem = cartData.cart.lineItems.lineItem[i];
                lineItems.push({
                    name : lineItem.product.displayName,
                    quantity : lineItem.pricing.salePriceWithQuantity.value,
                    unitAmount: lineItem.pricing.salePrice.value
                });
            }
        }
        return (lineItems);
    }

    async createObject(cartData) {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _configPayment = _config[PAYMENTS][_name];
        const owner = await this.getOwner(cartData);
        const shippingOptions = await this.shippingOptions(cartData);
        const displayItems = await this.displayItems(cartData);
        const returnUrl = await this._payment.getReturnUrl();
        const cancelUrl = await this._payment.getCancelUrl();
        let _type = _name;
        const useRecurringPayment = await _util.useRecurringPayment(cartData);
        if(useRecurringPayment && _configPayment.recurringName){
            _type = _configPayment.recurringName;
        }
        const paymentRequestData = {
            type:_type,
            upstreamId: cartData.cart.id,
            amount: cartData.cart.pricing.orderTotal.value,
            currency: _cjs[CONFIG].currency,
            [_type]: {
                returnUrl: returnUrl,
                cancelUrl: cancelUrl,
                items: displayItems,
                taxAmount: cartData.cart.pricing.tax.value,
                amountsEstimated: true,
                requestShipping: shippingOptions.length>0,
                shippingAmount: cartData.cart.pricing.shippingAndHandling.value,
            }
        };
        if(cartData && cartData.cart.paymentSession){
            paymentRequestData['sessionId'] = cartData.cart.paymentSession.id;
        }
        if( Object.keys(owner).length !==0 && owner.address.country.trim().length ){
            paymentRequestData.owner = owner;
            if(owner.phoneNumber.trim().length && owner.recipient.trim().length) {
                paymentRequestData[_type].shipping = owner;
            }
        }
        _util.extend(paymentRequestData,_configPayment.source);
        return (paymentRequestData);
    }
}
export {
    PayPal,
    PayPalPaymentRequestPayload,
};
