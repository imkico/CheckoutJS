import {Base} from './base';
import {_CHECKOUTJS, CONFIG, UTIL, POST, GET, SHOPPERAPI, PAYMENT_SERVICE, CARTDATA} from "./keywords";

/**
 * The owner data for the payment service.
 * @typedef OwnerDataObject
 * @memberOf PaymentService
 * @type {Object}
 * @property {Object} owner
 * @property {string} owner.firstName
 * @property {string} owner.lastName
 * @property {string} owner.email
 * @property {string} owner.phoneNumber
 * @property {string} [owner.organization]
 * @property {PaymentService.AddressDataObject} owner.address
 * @property {PaymentService.AdditionalAddressDataObject} [owner.additionalAddressInfo]
 * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/common-payment-objects#owner-object
 */
// eslint-disable-next-line no-unused-vars
const OwnerDataObject = {};

/**
 * The address data for the payment service.
 * @typedef AddressDataObject
 * @memberOf PaymentService
 * @type {Object}
 * @property {Object} address
 * @property {string} address.line1
 * @property {string} address.line2
 * @property {string} address.city
 * @property {string} address.state
 * @property {string} address.postalCode
 * @property {string} address.country
 * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/common-payment-objects#address-object
 */
// eslint-disable-next-line no-unused-vars
const AddressDataObject = {};

/**
 * The additional address data for the payment service.
 * @typedef AdditionalAddressDataObject
 * @memberOf PaymentService
 * @type {Object}
 * @property {Object} additionalAddressInfo
 * @property {string} additionalAddressInfo.division
 * @property {string} additionalAddressInfo.phoneticFirstName
 * @property {string} additionalAddressInfo.phoneticLastName
 * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/common-payment-objects#additional-address-information-object
 */
// eslint-disable-next-line no-unused-vars
const AdditionalAddressDataObject = {};

const apiRequestUrlBase = "https://api.digitalriver.com";

/**
 * @class PaymentService
 * @classdesc A collection of utilities for payment services.
 * @extends Base
 * @param {CheckoutJS} parent
 * @category Utility
 */
class PaymentService extends Base {

    constructor(parent) {
        super(parent, {
            excludeMethods: {constructor: true},
            writableMethods: {}
        });
    }

    /**
     * Creates the payment source from the payment service.
     * @param {PaymentRequestObject} data
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<PaymentSourceObject>}
     * @example checkoutJS.paymentService.createSource(source);
     */
    async createSource(data, params) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const options = await _shopperApi.getAPIOption({authentication: true});
        Object.assign(options.params, params);
        const drjsApiKey = _config.drjsApiKey ? _config.drjsApiKey : _config.apiKey;
        let token = 'bearer ' + drjsApiKey;
        if (drjsApiKey.indexOf('_') === -1) {
            token = 'Basic ' + _util.base64Encode(drjsApiKey);
        }
        options.headers['Authorization'] = token;
        let _data = _util.extend(data);
        const url = apiRequestUrlBase + "/payments/sources/"; //_cjs[CONFIG].apiRequestUrlBase + "/payments/sources/";
        options.method = POST;
        options.url = url;
        options.data = _data;
        options.api = PAYMENT_SERVICE;
        options.callby = 'createSource';
        return _util.APIRequest(options);
    }

    /**
     * Retrieves the payment source from the payment service.
     * @param {string} sourceId
     * @param {string} secret
     * @returns {Promise<PaymentSourceObject>}
     * @example checkoutJS.paymentService.retrieveSource('ffffffff-ffff-ffff-ffff-ffffffffffff',"ffffffff-ffff-ffff-ffff-ffffffffffff_ffffffff-ffff-ffff-ffff-ffffffffffff");
     */
    async retrieveSource(sourceId, secret) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const options = await _shopperApi.getAPIOption({authentication: true});
        Object.assign(options.params, {
            secret:secret
        });
        const drjsApiKey = _config.drjsApiKey ? _config.drjsApiKey : _config.apiKey;
        let token = 'bearer ' + drjsApiKey;
        if (drjsApiKey.indexOf('_') === -1) {
            token = 'Basic ' + _util.base64Encode(drjsApiKey);
        }
        options.headers['Authorization'] = token;

        const data = {};
        const url = apiRequestUrlBase + "/payments/sources/" + sourceId || '';//_cjs[CONFIG].apiRequestUrlBase + "/payments/sources/" + sourceId || '';
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = PAYMENT_SERVICE;
        options.callby = 'retrieveSource';
        return _util.APIRequest(options);
    }

    async getPaymentMethods(secret, params) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        const options = await _shopperApi.getAPIOption({authentication: true});
        Object.assign(options.params, params);
        if(cartData && cartData.cart.paymentSession && cartData.cart.paymentSession.id) {
            Object.assign(options.params, {
                sessionId:cartData.cart.paymentSession.id,
                locale:_config.locale,
            })
        }
        const drjsApiKey = _config.drjsApiKey ? _config.drjsApiKey : _config.apiKey;
        let token = 'bearer ' + drjsApiKey;
        if (drjsApiKey.indexOf('_') === -1) {
            token = 'Basic ' + _util.base64Encode(drjsApiKey);
        }
        options.headers['Authorization'] = token;


        const data = {};
        const url = apiRequestUrlBase + "/payments/payment-methods";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = 'paymentService';
        options.callby = 'getPaymentMethods';
        return _util.APIRequest(options);
    }
}
export {PaymentService};
