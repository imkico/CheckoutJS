import {StorefrontPayment} from "../payment";
import {
    REQUESTPAYLOAD,
} from "../../keywords";
import {CcavenuePaymentRequestPayload} from "../../payments/ccavenue";

const name = 'ccavenue';

/**
 * @class CcavenueWeb
 * @classdesc Ccavenue for web storefronts.
 * @extends StorefrontPayment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType='ccavenue'] - e.g. 'ccavenue'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {CcavenueWeb}
 * @category PaymentMethods
 */
class CcavenueWeb extends StorefrontPayment {

    constructor(parent, collection, _name, storefront) {
        super(parent, collection, name, storefront);
        /**
         * The CcavenuePaymentRequestPayload created for Ccavenue.
         * @name requestPayload
         * @type CcavenuePaymentRequestPayload
         * @memberof CcavenueWeb
         * @instance
         */
        this[REQUESTPAYLOAD] = new CcavenuePaymentRequestPayload(parent, {}, name, this);
    }
}

export {
    CcavenueWeb
}
