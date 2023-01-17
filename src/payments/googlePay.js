import {Payment} from './payment';
import {LOGGING, DRJS, _CHECKOUTJS, UTIL, SHOPPERAPI, UNDEFINED, FAIL_TO_APPLY_SOURCE} from '../keywords'

const name = 'googlePay';

/**
 * @class GooglePay
 * @classdesc GooglePay desc
 * @extends Payment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @returns {GooglePay}
 * @category PaymentMethods
 */
class GooglePay extends Payment {
    constructor(parent,collection) {
        super(parent,collection,name);
    }

    async applySourceId() {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const event = arguments[0];
        if (event) {
            const source = event.source;
            _cjs.emit(LOGGING,{
                id: _util.getTime(),
                api:DRJS,
                method:'createSource',
                type:'options',
                payment: name,
                options: source,
            });
            if (source && source.id) {
                const address = await Promise.all([
                    _shopperApi.convertPaymentRequestAddressToShopperApiAddress(Object.assign(event.billingAddress, event.contactInformation), 'billingAddress'),
                    _shopperApi.convertPaymentRequestAddressToShopperApiAddress(event.shippingAddress, 'shippingAddress')
                ]);

                await _shopperApi.applyAddressToCart(address[0], address[1]);
                const response = await _shopperApi.applySourceToCart(source.id);
                if (response && response.cart && typeof response.cart.paymentMethod !== UNDEFINED) {
                    return ([source, response]);
                } else {
                    return Promise.reject(FAIL_TO_APPLY_SOURCE);
                }
            } else if (event.error) {
                return Promise.reject(event.error);
            }
        }
    }
}

export {GooglePay};
