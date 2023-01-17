import {StorefrontPayment} from "../payment";
import {
    REQUESTPAYLOAD,
} from "../../keywords";
import {AlipayPaymentRequestPayload} from "../../payments/alipay";

const name = 'alipay';

/**
 * @class AlipayWeb
 * @classdesc Alipay for web storefronts.
 * @extends StorefrontPayment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType='alipay'] - e.g. 'alipay'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {AlipayWeb}
 * @category PaymentMethods
 */
class AlipayWeb extends StorefrontPayment {

    constructor(parent, collection, _name, storefront) {
        super(parent, collection, name, storefront);
        /**
         * The AlipayPaymentRequestPayload created for Alipay.
         * @name requestPayload
         * @type AlipayPaymentRequestPayload
         * @memberof AlipayWeb
         * @instance
         */
        this[REQUESTPAYLOAD] = new AlipayPaymentRequestPayload(parent, {}, name, this);
    }
}

export {
    AlipayWeb
}
