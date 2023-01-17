import {Payment,PaymentRequestPayload} from './payment';
import {_CHECKOUTJS, CONFIG, PAYMENTS, REQUESTPAYLOAD, UTIL} from "../keywords";
import {extend} from "../util";

const name = 'msts';

/**
 * @class Msts
 * @classdesc Msts
 * @extends Payment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @returns {PayPal}
 * @category PaymentMethods
 * @private
 */
class Msts extends Payment{
    constructor(parent,collection) {
        super(parent,collection,name);
        this[REQUESTPAYLOAD] =  new MstsPaymentRequestPayload(parent,{}, name, this);
    }
}

/**
 * @class MstsPaymentRequestPayload
 * @classdesc The request payload for Msts.
 * @extends PaymentRequestPayload
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} paymentType
 * @returns {MstsPaymentRequestPayload}
 * @category PaymentMethods
 */
class MstsPaymentRequestPayload extends PaymentRequestPayload {

    constructor(parent,collection, name, payment) {
        super(parent,extend({
            writableMethods: {
                getPoNumber: true,
                getNotes: true,
            }
        },collection), name, payment);
    }

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
        const poNumber = await _this.getPoNumber() || '';
        const notes = await _this.getNotes() || '';
        const paymentRequestData = {
            type:_type,
            upstreamId: cartData.cart.id,
            owner: owner,
            amount: cartData.cart.pricing.orderTotal.value,
            currency: _cjs[CONFIG].currency,
            [_type]: {
                notes: notes,
                poNumber: poNumber,
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

    async getPoNumber() {
    }

    async getNotes() {
    }
}
export {
    Msts,
    MstsPaymentRequestPayload,
};
