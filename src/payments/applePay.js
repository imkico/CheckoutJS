import {Payment} from './payment';

const name = 'applePay';

/**
 * @class ApplePay
 * @classdesc ApplePay desc
 * @extends Payment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @returns {ApplePay}
 * @category PaymentMethods
 */
class ApplePay extends Payment{
    constructor(parent,collection) {
        super(parent,collection,name);
    }
}

export {ApplePay};
