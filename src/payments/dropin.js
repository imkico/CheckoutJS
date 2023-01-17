import {Payment,PaymentRequestPayload} from './payment';
import {_CHECKOUTJS, CONFIG, REQUESTPAYLOAD, UTIL, PAYMENTS, SHOPPERAPI} from "../keywords";

const name = 'dropin';

/**
 * @class Dropin
 * @classdesc Dropin
 * @extends Payment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @returns {Dropin}
 * @category PaymentMethods
 */
class Dropin extends Payment{
    constructor(parent,collection) {
        super(parent,collection,name);
        this[REQUESTPAYLOAD] =  new DropinPaymentRequestPayload(parent,{}, name, this);
    }
}

/**
 * @class DropinPaymentRequestPayload
 * @classdesc The request payload for Dropin.
 * @extends PaymentRequestPayload
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} paymentType
 * @returns {DropinPaymentRequestPayload}
 * @category PaymentMethods
 */
class DropinPaymentRequestPayload extends PaymentRequestPayload {

    constructor(parent,collection, name, payment) {
        super(parent,collection, name, payment);
    }

    async getShippingOwner(cartData) {
        let address = cartData.cart.shippingAddress;
        if(Object.keys(address).length===0 ) {
            address = cartData.cart.billingAddress;
        }
        if(Object.keys(address).length > 0 ) {
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

    async createObject(cartData) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const country = (!!cartData && !!cartData.cart.billingAddress.country) ? cartData.cart.billingAddress.country : _config.country;
        const currency = (!!cartData && !!cartData.cart.pricing.orderTotal.currency) ? cartData.cart.pricing.orderTotal.currency : _config.currency;
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        const owner = await _this.getOwner(cartData);
        const total = await this.total(cartData);

        const paymentRequestData = {
            type: _name,
            upstreamId: cartData.cart.id,
            currency: currency,
            amount: total.amount,
            options: _configPayment.options,
            billingAddress: owner,
            paymentMethodConfiguration: {
                style: _configPayment.style
            }
        };

        if(cartData && cartData.cart.paymentSession){
            paymentRequestData['sessionId'] = cartData.cart.paymentSession.id;
        }else{
            _configPayment.supported = false;
        }
        return (paymentRequestData);
    }
}
export {
    Dropin,
    DropinPaymentRequestPayload,
};
