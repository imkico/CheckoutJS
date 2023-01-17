import {Payment,PaymentRequestPayload} from './payment';
import {_CHECKOUTJS, CONFIG, REQUESTPAYLOAD, UTIL, PAYMENTS, SHOPPERAPI} from "../keywords";

const name = 'klarnaCredit';

/**
 * @class KlarnaCredit
 * @classdesc Klarna Credit
 * @extends Payment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @returns {KlarnaCredit}
 * @category PaymentMethods
 */
class KlarnaCredit extends Payment{
    constructor(parent,collection) {
        super(parent,collection,name);
        this[REQUESTPAYLOAD] =  new KlarnaCreditPaymentRequestPayload(parent,{}, name, this);
    }
}

/**
 * @class KlarnaCreditPaymentRequestPayload
 * @classdesc The request payload for Klarna Credit.
 * @extends PaymentRequestPayload
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} paymentType
 * @returns {KlarnaCreditPaymentRequestPayload}
 * @category PaymentMethods
 */
class KlarnaCreditPaymentRequestPayload extends PaymentRequestPayload {

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

    async displayItems(cartData) {
        //const _cjs = this[_CHECKOUTJS];
        const lineItems = [];
        if(cartData && cartData.cart.lineItems && cartData.cart.lineItems.lineItem) {
            for (let i = 0; i < cartData.cart.lineItems.lineItem.length; i++) {
                const lineItem = cartData.cart.lineItems.lineItem[i];
                lineItems.push({
                    name : lineItem.product.displayName,
                    quantity : lineItem.quantity,
                    unitAmount: lineItem.pricing.salePrice.value,
                    sku: lineItem.product.sku,
                    imageUrl: lineItem.product.thumbnailImage,
                    taxRate: lineItem.pricing.taxRate
                });
            }
        }
        return (lineItems);
    }

    async createObject(cartData) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        const owner = await _this.getOwner(cartData);
        const shippingOptions = await _this.shippingOptions(cartData);
        const displayItems = await _this.displayItems(cartData);
        const returnUrl = await _this._payment.getReturnUrl();
        const cancelUrl = await _this._payment.getCancelUrl();
        let _type = _name;
        const useRecurringPayment = await _util.useRecurringPayment(cartData);
        if(useRecurringPayment && _config[PAYMENTS][_name].recurringName){
            _type = _config[PAYMENTS][_name].recurringName;
        }
        const paymentRequestData = {
            type:_type,
            upstreamId: cartData.cart.id,
            owner: owner,
            amount: cartData.cart.pricing.orderTotal.value,
            currency: _config.currency,
        };

        const custom = {
            returnUrl: returnUrl,
            cancelUrl: cancelUrl,
        };

        if(cartData && cartData.cart.paymentSession){
            paymentRequestData['sessionId'] = cartData.cart.paymentSession.id;
        }else{

            _util.extend(custom, {
                items: displayItems,
                locale: _config.locale,
                taxAmount: cartData.cart.pricing.tax.value,
                discountAmount: cartData.cart.pricing.discount.value,
            });

            if (shippingOptions.length > 0) {
                custom['shippingAmount'] = cartData.cart.pricing.shippingAndHandling.value;
                const shippingOwner = await _this.getShippingOwner(cartData);
                custom['shipping'] = shippingOwner;
            }

            const tokenInfo = await _shopperApi.getTokenInfo();
            if(tokenInfo){
                custom["accountId"] = tokenInfo.userId;
                custom["accountCreatedDate"] = tokenInfo.createdOn;
                custom["accountUpdatedDate"] = tokenInfo.lastAccessed;
            }

            let hasPaidBefore = false;
            const orders = await _shopperApi.getOrders();
            if(orders && orders.orders && orders.orders.totalResults>0){
                hasPaidBefore = true;
            }
            custom["hasPaidBefore"] = hasPaidBefore;

            let autoRenewal = false;
            let subscriptionDescription = "";
            cartData.cart.lineItems.lineItem.forEach((lineItem) => {
                lineItem.product.customAttributes.attribute.forEach((attribute) => {
                    if(attribute.name === "subscriptionSource") {
                        subscriptionDescription = lineItem.product.displayName;
                    }
                    if(attribute.name === "isAutomatic" && attribute.value === "true") {
                        autoRenewal = true;
                    }
                });
            });
            custom["autoRenewal"] = autoRenewal;
            custom["subscriptionDescription"] = subscriptionDescription;

            // "subscriptionDescription": "New Sub",
            //     "subscriptionStartDate": "2015-08-10T07:45:00Z",
            //     "subscriptionEndDate": "2015-08-10T07:45:00Z",
            //     "autoRenewal": true,

        }

        paymentRequestData[_type] = custom;
        _util.extend(paymentRequestData,_configPayment.source);
        return (paymentRequestData);
    }
}
export {
    KlarnaCredit,
    KlarnaCreditPaymentRequestPayload,
};
