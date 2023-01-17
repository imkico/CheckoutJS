import {Payment,PaymentRequestPayload} from './payment';
import {_CHECKOUTJS, CONFIG, PAYMENTS, REQUESTPAYLOAD, UTIL} from "../keywords";

const name = 'alipay';

/**
 * @class Alipay
 * @classdesc Alipay
 * @extends Payment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @returns {PayPal}
 * @category PaymentMethods
 * @private
 */
class Alipay extends Payment{
    constructor(parent,collection) {
        super(parent,collection,name);
        this[REQUESTPAYLOAD] =  new AlipayPaymentRequestPayload(parent,{}, name, this);
    }
}

/**
 * @class AlipayPaymentRequestPayload
 * @classdesc The request payload for Alipay.
 * @extends PaymentRequestPayload
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} paymentType
 * @returns {AlipayPaymentRequestPayload}
 * @category PaymentMethods
 */
class AlipayPaymentRequestPayload extends PaymentRequestPayload {

    constructor(parent,collection, name, payment) {
        super(parent,collection, name, payment);
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
                    unitAmount: lineItem.pricing.salePrice.value,
                    sku: lineItem.product.sku,

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
        const displayItems = await this.displayItems(cartData);
        const returnUrl = await this._payment.getReturnUrl();
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
                items: displayItems,
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
    Alipay,
    AlipayPaymentRequestPayload,
};
