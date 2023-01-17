import {StorefrontPayment} from "../payment";
import {Global} from "../../util";
import {
    LOGGING,
    _CHECKOUTJS,
    DRJS,
    CONFIG,
    UTIL,
    SHOPPERAPI,
    PAYMENTS,
    REQUESTPAYLOAD,
    PAYMENT,
    CARTDATA
} from "../../keywords";
import {KlarnaCreditPaymentRequestPayload} from "../../payments/klarnaCredit";

const document = Global.document;
const name = 'klarnaCredit';

/**
 * @class KlarnaCreditWeb
 * @classdesc Klarna Credit for web storefronts.
 * @extends StorefrontPayment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType='klarnaCredit'] - e.g. 'klarnaCredit'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {KlarnaCreditWeb}
 * @category PaymentMethods
 */
class KlarnaCreditWeb extends StorefrontPayment {

    constructor(parent, collection, _name, storefront) {
        super(parent, collection, name, storefront);
        /**
         * The KlarnaCreditPaymentRequestPayload created for Klarna Credit.
         * @name requestPayload
         * @type KlarnaCreditPaymentRequestPayload
         * @memberof KlarnaCreditWeb
         * @instance
         */
        this[REQUESTPAYLOAD] = new KlarnaCreditPaymentRequestPayload(parent, {}, name, this);
    }
}

export {
    KlarnaCreditWeb
}
