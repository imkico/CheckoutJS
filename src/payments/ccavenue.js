import {Payment,PaymentRequestPayload} from './payment';
import {_CHECKOUTJS, CONFIG, PAYMENTS, REQUESTPAYLOAD, UTIL} from "../keywords";
import {extend} from "../util";

const name = 'ccavenue';

/**
 * @class Ccavenue
 * @classdesc Ccavenue
 * @extends Payment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @returns {Ccavenue}
 * @category PaymentMethods
 * @private
 */
class Ccavenue extends Payment{
    constructor(parent,collection) {
        super(parent,collection,name);
        this[REQUESTPAYLOAD] =  new CcavenuePaymentRequestPayload(parent,{}, name, this);
    }
}

/**
 * @class CcavenuePaymentRequestPayload
 * @classdesc The request payload for Ccavenue.
 * @extends PaymentRequestPayload
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} paymentType
 * @returns {CcavenuePaymentRequestPayload}
 * @category PaymentMethods
 */
class CcavenuePaymentRequestPayload extends PaymentRequestPayload {
    async createObject(cartData) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _configPayment = _config[PAYMENTS][_name];
        const owner = await _this.getOwner(cartData);
        const returnUrl = await _this._payment.getReturnUrl();
        const cancelUrl = await _this._payment.getCancelUrl();
        let _type = _name;
        const useRecurringPayment = await _util.useRecurringPayment(cartData);
        if(useRecurringPayment && _configPayment.recurringName){
            _type = _configPayment.recurringName;
        }
        const paymentRequestData = {
            type:_type,
            upstreamId: cartData.cart.id,
            owner: owner,
            amount: cartData.cart.pricing.orderTotal.value,
            currency: _cjs[CONFIG].currency,
            [_type]: {
                returnUrl: returnUrl,
                cancelUrl: cancelUrl,
            }
        };
        if(cartData && cartData.cart.paymentSession){
            paymentRequestData['sessionId'] = cartData.cart.paymentSession.id;
        }
        _util.extend(paymentRequestData,_configPayment.source);
        return (paymentRequestData);
    }
}
export {
    Ccavenue,
    CcavenuePaymentRequestPayload,
};
