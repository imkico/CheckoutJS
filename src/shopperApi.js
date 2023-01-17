import {Base} from './base';
import {Global} from './util';
import {LOGGING, GET, POST, SHOPPERAPI, _CHECKOUTJS, CONFIG, UTIL, SHOPPER, UNDEFINED, CARTDATA} from './keywords';

const document = Global.document;

/**
 * The cart object.
 * @typedef CartDataObject
 * @memberOf ShopperApi
 * @type {Object}
 * @property {Object} cart
 * @property {string} cart.id - Requisition/Cart id
 * @property {string} cart.businessEntityCode
 * @property {int} cart.totalItemsInCart
 * @property {ShopperApi.AddressObject} cart.billingAddress
 * @property {ShopperApi.AddressObject} cart.shippingAddress
 * @property {Object} cart.lineItems
 * @property {ShopperApi.LineItemObject[]} cart.lineItems.lineItem
 * @property {Object} cart.shippingOptions
 * @property {Object} cart.pricing
 * @property {string} cart.termsOfSalesAcceptance - "true"
 * @property {string} cart.sendEmail - "false"
 * @property {string} cart.testOrder - "false"
 */
// eslint-disable-next-line no-unused-vars
const CartDataObject = {};

/**
 * The query parameters.
 * @typedef QueryParams
 * @memberOf ShopperApi
 * @type {Object.<string, string>}
 * @example params: {
    productID: 12345
  }
 */
// eslint-disable-next-line no-unused-vars
const QueryParams = {};

/**
 * The address object.
 * @typedef AddressObject
 * @memberOf ShopperApi
 * @type {Object}
 * @property {string} id - The address type, e.g. 'billingAddress', 'shippingAddress'.
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} line1 - Address line 1
 * @property {string} line2 - Address line 2
 * @property {string} line3 - Address line 3
 * @property {string} phoneNumber - Phone number
 * @property {string} city - City
 * @property {string} countrySubdivision - State
 * @property {string} postalCode - Zip code
 * @property {string} country - Two-digit country code
 * @property {string} emailAddress - E-mail address
 * @property {string} phoneticFirstName - Phonetic first name
 * @property {string} phoneticLastName - Phonetic last name
 * @property {string} division - Division
 */
// eslint-disable-next-line no-unused-vars
const AddressObject = {};

/**
 * The shopper object.
 * @typedef ShopperObject
 * @memberOf ShopperApi
 * @type {Object}
 * @property {Object} shopper
 * @property {string} shopper.firstName - First name
 * @property {string} shopper.lastName - Last name
 * @property {string} shopper.emailAddress - Email address
 * @property {string} shopper.password - Password
 * @property {string} shopper.externalReferenceId - External reference id
 */
// eslint-disable-next-line no-unused-vars
const ShopperObject = {};

/**
 * The access token object.
 * @typedef AccessTokenObject
 * @memberOf ShopperApi
 * @type {Object}
 * @property {string} access_token - The access token.
 * @property {int} expires_in - The time in seconds until this token expires.
 * @property {string} refresh_token - Use the refresh token to obtain new access tokens.
 * @property {string} token_type - The type of token, e.g. "bearer".
 * @see https://commerceapi.digitalriver.com/reference#access-tokens
 * @example
 * {
 *  access_token: "d93f132d7c61582472ada8caec64936e05ad0cd1b7a5802bd1…94c5286c825b189a0992c758abe0b860eb66bf36cd6289301",
 *  token_type: "bearer",
 *  expires_in: 86399,
 *  refresh_token:"d93f132d7c61582472ada8caec64936e05ad0cd1b7a5802bd1…2c0161a20099edca1ad68bd4d97820f62970fd08553656ac4",
 *  token_type: "bearer"
 * }
 */
// eslint-disable-next-line no-unused-vars
const AccessTokenObject = {};

/**
 * The Axios options.
 * @typedef AxiosOptions
 * @memberOf ShopperApi
 * @type {Object}
 * @see https://github.com/axios/axios#request-config
 * @example {
 *  params: {},
 *  headers: {},
 *  data: {},
 *  auth: {}
 * }
 */
// eslint-disable-next-line no-unused-vars
const AxiosOptions = {}

/**
 * @class ShopperApi
 * @classdesc A collection of Commerce API (Shopper API) calls using the public key.
 * @extends Base
 * @param {CheckoutJS} parent
 * @returns {Promise<ShopperApi>}
 * @see https://commerceapi.digitalriver.com/reference
 * @category CommerceAPI
 */
class ShopperApi extends Base {

    constructor(parent) {
        super(parent, {
            excludeMethods: {constructor: true},
            writableMethods: {}
        });
    }

    /**
     * Retrieves the value of the specified text key - URI> GET /v1/site/text-attributes/{text}
     * @param {string} text - The text string attribute
     * @param {ShopperApi.QueryParams} [params]
     * @example
     * checkoutJS.shopperApi.getText('BTN_BUY');
     * @returns {Promise<{attribute:{}}>}
     */
    async getText(text, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({apiKey: true, authentication:true});
        Object.assign(options.params, params);
        const data = {};
        const _text = text || '';
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/site/text-attributes/" + _text ;
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getText';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getText',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:GET,
        //     url:url
        // };
        //
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    async getTexts(texts, params) {
        const _cjs = this[_CHECKOUTJS];
        const array = [];
        if(texts && Array.isArray(texts)) {
            for(let i=0;i<texts.length;i++){
                try {
                    const data = await _cjs[SHOPPERAPI].getText(texts[i], params);
                    array.push(data);
                }catch(e){

                }
            }
        }
        return array;
    }

    /**
     * Retrieves the site data - URI> GET /v1/shoppers/site
     * @param {ShopperApi.QueryParams} [params]
     * @example
     * checkoutJS.shopperApi.getSiteInfo();
     * @returns {Promise<{site:{}}>}
     */
    async getSiteInfo(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption();
        Object.assign(options.params, params);
        const data = {};
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/site";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getSiteInfo';
        return _cjs[UTIL].APIRequest(options);
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getSiteInfo',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves the value of the specified site setting key - URI> GET /v1/site/settings/{text}
     * @param {string} [text] - The site setting attribute
     * @param {ShopperApi.QueryParams} [params]
     * @example
     * checkoutJS.shopperApi.getSiteSettings('CUST_SERVICE_URL');
     * @returns {Promise<{settings:{}}>}
     */
    async getSiteSettings(text, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({apiKey:true});
        Object.assign(options.params, params);
        const data = {};
        const _text = text || '';
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/site/settings/" + _text ;
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getSiteSettings';
        return _cjs[UTIL].APIRequest(options);
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getSiteSettings',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    async getCartPageLink() {
        const _cjs = this[_CHECKOUTJS];
        const url = _cjs[UTIL].parseURL(_cjs[CONFIG].drUrl);
        const newUrl = _cjs[UTIL].format(_cjs[CONFIG].url.cart, {
            domain: url.hostname,
            siteId: _cjs[CONFIG].siteId
        });
        return newUrl;
    }

    async getInfoPageLink() {
        const _cjs = this[_CHECKOUTJS];
        const url = _cjs[UTIL].parseURL(_cjs[CONFIG].drUrl);
        const newUrl = _cjs[UTIL].format(_cjs[CONFIG].url.info, {
            domain: url.hostname,
            siteId: _cjs[CONFIG].siteId
        });
        return newUrl;
    }

    async getConfirmOrderPageLink() {
        const _cjs = this[_CHECKOUTJS];
        const url = _cjs[UTIL].parseURL(_cjs[CONFIG].drUrl);
        const newUrl = _cjs[UTIL].format(_cjs[CONFIG].url.confirmOrder, {
            domain: url.hostname,
            siteId: _cjs[CONFIG].siteId
        });
        return newUrl;
    }

    async getThankYouPageLink(requisitionId) {
        const _cjs = this[_CHECKOUTJS];
        const url = _cjs[UTIL].parseURL(_cjs[CONFIG].drUrl);
        const newUrl = _cjs[UTIL].format(_cjs[CONFIG].url.thankYou, {
            domain: url.hostname,
            siteId: _cjs[CONFIG].siteId,
            requisitionId: requisitionId
        });
        return newUrl;
    }

    /**
     * Retrieves Axios options.
     * @param {Object} [setting]
     * @param {Boolean} [setting.authentication] - Set to true if access token is required.
     * @param {Boolean} [setting.apiKey] - Set to true to append the API key.
     * @param {Boolean} [setting.authorization] - Set to false to not apply the authorization header.
     * @returns {Promise<AxiosOptions>}
     */
    async getAPIOption(setting={}) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[UTIL].extend({
            params: {
            }
        }, _cjs[CONFIG].apiOption);
        if(setting.authorization!==false) {
            const _token = await _cjs[SHOPPER].getAccessToken(setting);
            if (_token) {
                _config.headers['Authorization'] = 'bearer ' + _token;
            } else {
                setting.apiKey = true;
            }
        }
        if(setting.apiKey){
            _config.params.apiKey = _cjs[CONFIG].apiKey;
        }
        return _config;
    }

    /**
     * Applies the source ID to the cart - URI> POST /v1/shoppers/me/carts/active/apply-payment-method
     * @param {string} sourceId - The payment source ID.
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.CartDataObject>}
     * @example
     * checkoutJS.shopperApi.applySourceToCart("ffffffff-ffff-ffff-ffff-ffffffffffff");
     */
    async applySourceToCart(sourceId, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        Object.assign(options.params, params);
        const data = {
            "paymentMethod": {
                "sourceId": sourceId
            }
        };
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active/apply-payment-method";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'applySourceToCart';
        return _cjs[UTIL].APIRequest(options,async(log)=>{
            await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
            _cjs.emit('cartUpdated', log.responseBody);
        });
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'applySourceToCart',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, data, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
        //         _cjs.emit('cartUpdated', log.responseBody);
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Applies a payment to the cart - URI> POST /v1/shoppers/me/carts/active/apply-payment-method
     * @param {Object} data - The payment data, for non-DigitalRiver.js payments.
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.CartDataObject>}
     * @deprecated
     * @example
     * checkoutJS.shopperApi.applyPaymentToCart({type:"wireTransfer"});
     */
    async applyPaymentToCart(data, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active/apply-payment-method";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'applyPaymentToCart';
        return _cjs[UTIL].APIRequest(options,async(log)=>{
            await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
            _cjs.emit('cartUpdated', log.responseBody);
        });
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'applyPaymentToCart',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, data, options);
        //     if (response) {
        //         await _cjs[UTIL].setValue(CARTDATA, response.data);
        //         _cjs.emit('cartUpdated', response.data);
        //         return (response.data);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Applies the shopper's addresses to the cart - URI> POST /v1/shoppers/me/carts/active
     * @param {ShopperApi.AddressObject} [billingAddress] - The billing address.
     * @param {ShopperApi.AddressObject} [shippingAddress] - The shipping address.
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.CartDataObject>}
     * @example
     * checkoutJS.shopperApi.applyAddressToCart({country:'US'});
     */
    async applyAddressToCart(billingAddress, shippingAddress, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {
            "cart": {}
        };
        if (billingAddress) {
            data.cart['billingAddress'] = billingAddress;
        }
        if (shippingAddress) {
            data.cart['shippingAddress'] = shippingAddress;
        }
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'applyAddressToCart';
        return _cjs[UTIL].APIRequest(options,async(log)=>{
            await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
            _cjs.emit('cartUpdated', log.responseBody);
        });
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'applyAddressToCart',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, data, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
        //         _cjs.emit('cartUpdated', log.responseBody);
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Updates the shipping method of the cart - URI> POST /v1/shoppers/me/carts/active/apply-shipping-option
     * @param {string} shippingMethodId
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.CartDataObject>}
     * @example
     * checkoutJS.shopperApi.updateSelectedShippingMethodOnCart('123456');
     */
    async updateSelectedShippingMethodOnCart(shippingMethodId,params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        options.params.shippingOptionId = shippingMethodId;
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active/apply-shipping-option";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'updateSelectedShippingMethodOnCart';
        return _cjs[UTIL].APIRequest(options,async(log)=>{
            await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
            _cjs.emit('cartUpdated', log.responseBody);
        });
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'updateSelectedShippingMethodOnCart',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, data, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
        //         _cjs.emit('cartUpdated', log.responseBody);
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Submits the cart - URI> POST /v1/shoppers/me/carts/active/submit-cart
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{submitCart:{}}>}
     * @example
     * checkoutJS.shopperApi.submitCart();
     */
    async submitCart(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active/submit-cart";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'submitCart';
        return _cjs[UTIL].APIRequest(options);
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'submitCart',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, data, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves the session token - URI> GET https://{gc-domain}/store/{siteId}/SessionToken
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<string>}
     * @example
     * checkoutJS.shopperApi.getSessionToken();
     */
    async getSessionToken(params) {
        const _cjs = this[_CHECKOUTJS];
        if(_cjs[CONFIG].drUrl.length) {
            const url = _cjs[UTIL].parseURL(_cjs[CONFIG].drUrl);
            const options = _cjs[UTIL].extend({
                headers: {}
            }, _cjs[CONFIG].apiOption);

            await _cjs[SHOPPER].applyHeaders(options);
            Object.assign(options.params, params);
            const requestUrl = "https://" + url.hostname + "/store/" + _cjs[CONFIG].siteId + "/SessionToken";
            let response;
            if (options.params.format === 'jsonp') {
                response = await _cjs[UTIL].jsonp(requestUrl, options);
                if (response) {
                    await _cjs[SHOPPER].setShopper({
                        sessionToken: response
                    });
                }
            } else {
                response = await _cjs[UTIL].axios.get(requestUrl, options);
                if (response) {
                    await _cjs[SHOPPER].setShopper({
                        sessionToken: response.data,
                        gcCookies: response.headers ? response.headers["set-cookie"] : null
                    });
                }
            }
            return (_cjs[SHOPPER].sessionToken);
        }
    }

    /**
     * Retrieves the shopper access token - URI> GET /v1/shoppers/token
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.AccessTokenObject>}
     * @example
     * checkoutJS.shopperApi.getShopperAccessToken();
     */
    async getShopperAccessToken(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:false});
        const data = { };
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/token";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getShopperAccessToken';
        return _cjs[UTIL].APIRequest(options,async(log,response)=>{
            await _cjs[SHOPPER].setShopper({
                sessionToken: response.data
            });
        });
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getShopperAccessToken',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         await _cjs[SHOPPER].setShopper({
        //             sessionToken: response.data
        //         });
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Creates an OAuth Token - URI> POST /oauth20/token
     * @param {Object} data
     * @param {Object} data.grant_type - Available types are 'password' or 'client_credentials'.
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.AccessTokenObject>}
     * @example
     * checkoutJS.shopperApi.createOAuthToken({
            grant_type:'password',
            username:'guest',
            password:'BASE64_PASSWORD'
        });
     */
    async createOAuthToken(data={grant_type:'password'}, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        if(data.grant_type === 'client_credentials') {
            headers['Authorization'] = 'Basic '+ _cjs[UTIL].base64Encode(_cjs[CONFIG].authUserName + ':' + _cjs[CONFIG].authPassword);
        }

        Object.assign(options.headers, headers);

        const _data = Object.entries(data)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join('&');

        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/oauth20/token";
        options.method = POST;
        options.url = url;
        options.data = _data;
        options.api = SHOPPERAPI;
        options.callby = 'createOAuthToken';
        return _cjs[UTIL].APIRequest(options,async(log,response)=>{
            await _cjs[SHOPPER].setShopper({
                sessionToken: response.data,
                gcCookies: response.headers ? response.headers["set-cookie"] : null
            });
            await _cjs[SHOPPERAPI].getShopper();
        });
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'createOAuthToken',
        //     requestParams: options.params,
        //     requestBody: _data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, _data, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         await _cjs[SHOPPER].setShopper({
        //             sessionToken: response.data,
        //             gcCookies: response.headers ? response.headers["set-cookie"] : null
        //         });
        //         await _cjs[SHOPPERAPI].getShopper();
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Deletes the access token - URI> DELETE /oauth20/access-tokens
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<void>}
     * @example
     * checkoutJS.shopperApi.deleteToken();
     */
    async deleteToken(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:false});
        const data = {};
        Object.assign(options.params, params, {token: _cjs[SHOPPER].sessionToken.access_token});
        const url = _cjs[CONFIG].apiRequestUrlBase + "/oauth20/access-tokens";
        options.method = 'delete';
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'deleteToken';
        return _cjs[UTIL].APIRequest(options);
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'deleteToken',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:'delete',
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.delete(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves the access token - URI> GET /oauth20/access-tokens
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<Object>}
     * @example
     * checkoutJS.shopperApi.getTokenInfo();
     */
    async getTokenInfo(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params, {token: _cjs[SHOPPER].sessionToken.access_token});
        const url = _cjs[CONFIG].apiRequestUrlBase + "/oauth20/access-tokens";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getTokenInfo';
        return _cjs[UTIL].APIRequest(options,async(log,response)=>{
            await _cjs[SHOPPER].setShopper({
                locale: response.data['locale'],
                currency: response.data['currency'],
                tokenInfo: response.data,
                isAuthenticated: ('true' === response.data['authenticated'])
            });
        });
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getTokenInfo',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         await _cjs[SHOPPER].setShopper({
        //             locale: response.data['locale'],
        //             currency: response.data['currency'],
        //             tokenInfo: response.data,
        //             isAuthenticated: ('true' === response.data['authenticated'])
        //         });
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Refreshes the access token - URI> POST /oauth20/token
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.AccessTokenObject>}
     * @example
     * checkoutJS.shopperApi.refreshToken();
     */
    async refreshToken(params) {
        const _cjs = this[_CHECKOUTJS];
        const _shopper = _cjs[SHOPPER];
        const _config = _cjs[CONFIG];
        if(_shopper.sessionToken && _shopper.sessionToken.refresh_token) {
            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    expand: 'all',
                    format: 'json'
                },
                skipError: true,
            };
            const data = Object.entries({
                client_id: _config.apiKey,
                refresh_token: _shopper.sessionToken.refresh_token || '',
                grant_type: 'refresh_token'
            }).map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
                .join('&');
            Object.assign(options.params, params);
            const url = _config.apiRequestUrlBase + "/oauth20/token";
            options.method = POST;
            options.url = url;
            options.data = data;
            options.api = SHOPPERAPI;
            options.callby = 'refreshToken';
            return _cjs[UTIL].APIRequest(options,async(log)=>{
                await _shopper.setShopper({
                    sessionToken: log.responseBody
                });
            });
        }
    }

    /**
     * Redirects a shopper to a Global Commerce hosted checkout experience - URI> GET /v1/shoppers/me/carts/active/web-checkout
     * @param {ShopperApi.QueryParams} [params]
     * @param {string} [params.externalReferenceId]
     * @param {string} [params.productId]
     * @param {string} [params.themeId]
     * @returns {Promise<string>}
     * @example
     * checkoutJS.shopperApi.webCheckout();
     */
    async webCheckout(params) {
        const _cjs = this[_CHECKOUTJS];
        //const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:false});
        //const data = {};
        const _params = Object.assign({token:await _cjs[SHOPPER].getAccessToken({authentication:true})}, params);
        const _query = Object.entries(_params)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join('&');
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active/web-checkout?"+_query;
        const log = {
            id: _cjs[UTIL].getTime(),
            api:SHOPPERAPI,
            method:'webCheckout',
            requestParams: params,
            requestBody: {},
            type:GET,
            url:url
        };
        _cjs.emit(LOGGING,log);
        return url;
        /*
         * not work for browser
        if(isBrowser){
            _cjs[UTIL].formHelper(options.url,options.params);
        }else {
            try {
                const response = await _cjs[UTIL].axios(options);
                if (response) {
                    const fetchedUrls = response.request.response.fetchedUrls;
                    _cjs[UTIL].log('shopperApi:webCheckout', fetchedUrls);
                    return Promise.resolve(fetchedUrls);
                }
            } catch (ex) {
                if (302 === ex.response.status) {
                    return Promise.resolve(ex.response.headers.location);
                } else {
                    throw ex;
                }
            }
        }
        return Promise.resolve();

        */
    }

    async createWebCheckout(data,params) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:false});
        Object.assign(options.params, params);
        const url = _config.apiRequestUrlBase + "/v1/shoppers/me/carts/active/web-checkout";
        let _data = _cjs[UTIL].extend(data);
        if (_data && _data.cart) {
            if(_data.cart.password){
                _data.cart.password = _cjs[UTIL].base64Encode(_data.cart.password);
            }
            if(_config.encryptionKey.length){
                _data = await _cjs[UTIL].encryptPayload(_data);
                options.headers['Content-Type'] = 'application/json';
            }else {
                if (_data.cart.lineItems && _data.cart.lineItems.lineItem) {
                    let items = _data.cart.lineItems.lineItem;
                    items.forEach(function (lineItem) {
                        if( _config.encryptionKey.length === 0 ) {
                            delete lineItem.pricing;
                            delete lineItem.customAttributes;
                        }
                    });
                }
            }
        }
        options.method = POST;
        options.url = url;
        options.data = _data;
        options.api = SHOPPERAPI;
        options.callby = 'createWebCheckout';
        return _cjs[UTIL].APIRequest(options,async(log)=>{
            await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
            _cjs.emit('cartUpdated', log.responseBody);
        });
    }

    /**
     * Retrieves the cart - URI> GET /v1/shoppers/me/carts/active
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.CartDataObject>}
     * @example
     * checkoutJS.shopperApi.getCart();
     */
    async getCart(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active";
        options.method = GET;
        options.url = url;
        options.data = {};
        options.api = SHOPPERAPI;
        options.callby = 'getCart';
        return _cjs[UTIL].APIRequest(options,async(log)=>{
            await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
            _cjs.emit('cartUpdated', log.responseBody);
        });

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getCart',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response && response.data) {
        //         log.responseBody = response.data;
        //         await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
        //         _cjs.emit('cartUpdated', log.responseBody);
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Updates the cart - URI> GET /v1/shoppers/me/carts/active
     * @param {ShopperApi.CartDataObject} data
     * @param {ShopperApi.QueryParams} [params]
     * @param {string} [params.externalReferenceId] - The external reference ID.
     * @param {string} [params.offerId] - The offer ID.
     * @param {string} [params.productId] - The product ID.
     * @param {string} [params.quantity] - The number of products.
     * @param {string} [params.promoCode] - The promotional code.
     * @param {string} [params.termId] - The finance term ID.
     * @returns {Promise<ShopperApi.CartDataObject>}
     * @example
     * checkoutJS.shopperApi.updateCart({
     *     cart:{
     *         testOrder:true
     *     }
     * });
     */
    async updateCart(data, params) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        Object.assign(options.params, params);
        const url = _config.apiRequestUrlBase + "/v1/shoppers/me/carts/active";
        let _data = _cjs[UTIL].extend(data);

        if (_data && _data.cart) {
            if(_data.cart.password){
                _data.cart.password = _cjs[UTIL].base64Encode(_data.cart.password);
            }
            if(_config.encryptionKey.length){
                _data = await _cjs[UTIL].encryptPayload(_data);
                options.headers['Content-Type'] = 'application/json';
            }else {
                if (_data.cart.lineItems && _data.cart.lineItems.lineItem) {
                    let items = _data.cart.lineItems.lineItem;
                    items.forEach(function (lineItem) {
                        if( _config.encryptionKey.length === 0 ) {
                            delete lineItem.pricing;
                            delete lineItem.customAttributes;
                        }
                    });
                }
            }
        }
        options.method = POST;
        options.url = url;
        options.data = _data;
        options.api = SHOPPERAPI;
        options.callby = 'updateCart';
        return _cjs[UTIL].APIRequest(options,async(log)=>{
            await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
            _cjs.emit('cartUpdated', log.responseBody);
        });

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'updateCart',
        //     requestParams: options.params,
        //     requestBody: _data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, _data, options);
        //     if (response && response.data) {
        //         log.responseBody = response.data;
        //         await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
        //         _cjs.emit('cartUpdated', log.responseBody);
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Adds a product to cart - URI> GET /v1/shoppers/me/carts/active<br/>
     * Looks up the &lt;input name='productID'/&gt; or &lt;input name='externalReferenceId'/&gt; fields to use as parameters.
     * @param {ShopperApi.QueryParams} [params]
     * @param {string} [params.productID]
     * @param {string} [params.externalReferenceId]
     * @returns {Promise<ShopperApi.CartDataObject>}
     * @example
     * checkoutJS.shopperApi.addToCart({productID:'1234'});
     * checkoutJS.shopperApi.addToCart({externalReferenceId:'1234'});
     */
    async addToCart(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = Object.assign({}, params);

        if (!params) {
            let x = document.getElementsByName("productID");
            if (x && x.length) {
                data.productID = x[0].value;
            }
            let y = document.getElementsByName("externalReferenceId");
            if (y && y.length) {
                data.externalReferenceId = y[0].value;
            }
        }
        Object.assign(options.params, data);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'addToCart';
        return _cjs[UTIL].APIRequest(options,async(log)=>{
            await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
            _cjs.emit('cartUpdated', log.responseBody);
        });
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'addToCart',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, data, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
        //         _cjs.emit('cartUpdated', log.responseBody);
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    async clearCart(params) {
        const _cjs = this[_CHECKOUTJS];
        const cartData = await _cjs[UTIL].getValue(CARTDATA) || await this.getCart();
        if (cartData && cartData.cart.lineItems && cartData.cart.lineItems.lineItem) {
            for (let i = 0; i < cartData.cart.lineItems.lineItem.length; i++) {
                const lineItem = cartData.cart.lineItems.lineItem[i];
                lineItem.quantity = 0;
            }
        }
        return this.updateCart(cartData, params);
    }

    /**
     * Deletes the specified line item in the cart - URI> DELETE /v1/shoppers/me/carts/active/line-items/{lineItemId}
     * @param {string} lineItemId - The line item ID.
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.CartDataObject>}
     * @example
     * checkoutJS.shopperApi.deleteLineItem('2342342134');
     */
    async deleteLineItem(lineItemId, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active/line-items/" + lineItemId;
        options.method = 'delete';
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'deleteLineItem';
        return _cjs[UTIL].APIRequest(options,async(log)=>{
            await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
            _cjs.emit('cartUpdated', log.responseBody);
        });
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'deleteLineItem',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:'delete',
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.delete(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Applies a coupon code to the cart - URI> POST /v1/shoppers/me/carts/active
     * @param {ShopperApi.QueryParams|string} [params] - The coupon code.
     * @param {string} [params.promoCode] - The coupon code.
     * @returns {Promise<ShopperApi.CartDataObject>}
     * @example
     * checkoutJS.shopperApi.applyCouponToCart('COUPONCODE');
     * checkoutJS.shopperApi.applyCouponToCart({promoCode:'COUPONCODE'});
     */
    async applyCouponToCart(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};

        if(typeof params === 'string'){
            options.params.promoCode = params;
        }else if(typeof params === 'object') {
            Object.assign(options.params, params);
        }

        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'applyCouponToCart';
        return _cjs[UTIL].APIRequest(options,async(log)=>{
            await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
            _cjs.emit('cartUpdated', log.responseBody);
        });
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'applyCouponToCart',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, data, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         await _cjs[UTIL].setValue(CARTDATA, log.responseBody);
        //         _cjs.emit('cartUpdated', log.responseBody);
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }


    async getTaxRegistrations(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        Object.assign(options.params, params);
        const cartData = await _cjs[UTIL].getValue(CARTDATA) || await this.getCart();
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/carts/"+cartData.cart.id+"/tax-registrations";
        options.method = GET;
        options.url = url;
        options.data = {};
        options.api = SHOPPERAPI;
        options.callby = 'getTaxRegistrations';
        return _cjs[UTIL].APIRequest(options);
    }


    /**
     * Retrieves the shopper data - URI> GET /v1/shoppers/me
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.CartDataObject>}
     * @example
     * checkoutJS.shopperApi.getShopper();
     */
    async getShopper(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getShopper';
        return _cjs[UTIL].APIRequest(options,async(log,response)=>{
            await _cjs[SHOPPER].setShopper({
                locale: response.data.shopper.locale,
                currency: response.data.shopper.currency,
                isAuthenticated: !!response.data.shopper.username,
            });
        });
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getShopper',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         await _cjs[SHOPPER].setShopper({
        //             locale: response.data.shopper.locale,
        //             currency: response.data.shopper.currency,
        //             isAuthenticated: !!response.data.shopper.username,
        //         });
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Creates an OAuth token for an authenticated shopper, i.e. shopper logs in.
     * @param {string} username
     * @param {string} password
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.AccessTokenObject>}
     * @example
     * checkoutJS.shopperApi.login('username','password');
     */
    async login(username, password, params) {
        const _cjs = this[_CHECKOUTJS];
        const _params = {
            grant_type:'password',
            username:username,
            password:_cjs[UTIL].base64Encode(password),
            dr_limited_token: (await _cjs[SHOPPER].getAccessToken()) || ''
        };

        try {
            const access_token = await this.createOAuthToken(_params,params);
            return access_token;
        }catch(ex){
            throw ex;
        }
    }

    /**
     * Deletes the access token for an authenticated shopper, i.e. shopper logs out.
     * @returns {Promise<void>}
     * @example
     * checkoutJS.shopperApi.logout();
     */
    async logout() {
        const _cjs = this[_CHECKOUTJS];
        await this.deleteToken();
        await _cjs[SHOPPER].destroy();
    }

    /**
     * Creates a shopper record - URI> POST /v1/shoppers
     * @param {ShopperApi.ShopperObject} data
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.AccessTokenObject>}
     * @example
     * checkoutJS.shopperApi.createShopper({
     *     shopper:{
     *         username: 'test@email.com',
     *         emailAddress: 'test@email.com',
     *         externalReferenceId: 'test',
     *         firstName: 'firstName',
     *         lastName: 'lastName',
     *         password: 'password',
     *     }
     * });
     */
    async createShopper(data, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption();
        const _data = _cjs[UTIL].extend({},data);
        Object.assign(options.params, params);
        if(_data.shopper && _data.shopper.password) {
            _data.shopper.password = _cjs[UTIL].base64Encode(_data.shopper.password);
        }
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'createShopper';
        return _cjs[UTIL].APIRequest(options,async()=>{
            return this.login(data.shopper.username,data.shopper.password);
        });


        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'createShopper',
        //     requestParams: options.params,
        //     requestBody: _data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     await _cjs[UTIL].axios.post(url, _data, options);
        //     const response =  await this.login(data.shopper.username,data.shopper.password);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Updates the shopper record - URI> POST /v1/shoppers/me
     * @param {ShopperApi.ShopperObject} data
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.ShopperObject>}
     * @example
     * checkoutJS.shopperApi.updateShopper({
     *     shopper:{
     *         username: 'test@email.com',
     *         emailAddress: 'test@email.com',
     *         externalReferenceId: 'test',
     *         firstName: 'firstName',
     *         lastName: 'lastName',
     *         password: 'password',
     *     }
     * });
     */
    async updateShopper(data, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const _data = _cjs[UTIL].extend({},data);
        Object.assign(options.params, params);
        if(_data.shopper && _data.shopper.password) {
            _data.shopper.password = _cjs[UTIL].base64Encode(_data.shopper.password);
        }
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me";
        options.method = POST;
        options.url = url;
        options.data = _data;
        options.api = SHOPPERAPI;
        options.callby = 'updateShopper';
        return _cjs[UTIL].APIRequest(options,async()=>{
            return (await _cjs[SHOPPERAPI].getShopper() || {});
        });

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'updateShopper',
        //     requestParams: options.params,
        //     requestBody: _data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, _data, options);
        //     if (response) {
        //         log.responseBody = await _cjs[SHOPPERAPI].getShopper() || {};
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    async getPaymentOptions(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/payment-options";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getPaymentOptions';
        return _cjs[UTIL].APIRequest(options);
        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getPaymentOptions',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url: url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    async getPaymentOption(paymentOptionId, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/payment-options/"+paymentOptionId;
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getPaymentOption';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getPaymentOption',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url: url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    async updatePaymentOption(data, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication: true});
        const _data = _cjs[UTIL].extend({},data);
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/payment-options/" + data.paymentOption.id;
        options.method = POST;
        options.url = url;
        options.data = _data;
        options.api = SHOPPERAPI;
        options.callby = 'updatePaymentOption';
        return _cjs[UTIL].APIRequest(options);
    }

    async deletePaymentOption(paymentOptionId, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication: true});
        const _data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/payment-options/" + paymentOptionId;
        options.method = 'delete';
        options.url = url;
        options.data = _data;
        options.api = SHOPPERAPI;
        options.callby = 'deletePaymentOption';
        return _cjs[UTIL].APIRequest(options);
    }

    async getAddresses(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/addresses";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getAddresses';
        return _cjs[UTIL].APIRequest(options);
    }

    async updateAddress(data, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication: true});
        const _data = _cjs[UTIL].extend({},data);
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/addresses/" + data.address.id;
        options.method = POST;
        options.url = url;
        options.data = _data;
        options.api = SHOPPERAPI;
        options.callby = 'updateAddress';
        return _cjs[UTIL].APIRequest(options);
    }

    async deleteAddress(addressId, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication: true});
        const _data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/addresses/" + addressId;
        options.method = 'delete';
        options.url = url;
        options.data = _data;
        options.api = SHOPPERAPI;
        options.callby = 'deleteAddress';
        return _cjs[UTIL].APIRequest(options);
    }

    /**
     * Retrieves the account page URL - URI> GET /v1/shoppers/me/account
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<string>}
     * @example
     * checkoutJS.shopperApi.getShopperAccountPage().then(function(url){
     *     location.href=url;
     * });
     */
    async getShopperAccountPage(params) {
        const _cjs = this[_CHECKOUTJS];
        const _params = Object.assign({token:await _cjs[SHOPPER].getAccessToken({authentication:true})}, params);
        const _query = Object.entries(_params)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join('&');
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/account?"+_query;
        const log = {
            id: _cjs[UTIL].getTime(),
            api:SHOPPERAPI,
            method:'getShopperAccount',
            requestParams: _params,
            requestBody: {},
            type:GET,
            url:url
        };
        _cjs.emit(LOGGING,log);
        return (url);
    }

    /**
     * Applies the payment source to the shopper - URI> GET /v1/shoppers/me/account
     * @param {string} sourceId - The unique identifier for the payment option.
     * @param {string} nickName - The nickname associated with the payment option.
     * @param {string} isDefault - When this value is set to true, the payment option is the shopper's default payment option.
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<void>}
     * @example
     * checkoutJS.shopperApi.applySourceToShopper('ffffffff-ffff-ffff-ffff-ffffffffffff','My Visa','false');
     */
    async applySourceToShopper(sourceId, nickName, isDefault='false', params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {
            "paymentOption": {
                "nickName": nickName.toString(),
                "isDefault": isDefault.toString(),
                "sourceId": sourceId
            }
        };
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/payment-options";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'applySourceToShopper';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'applySourceToShopper',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, data, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Applies the shopper data to the cart - URI> GET /v1/shoppers/me/carts/active/apply-shopper
     * @param {ShopperApi.QueryParams} [params]
     * @param {string} [params.paymentOptionId] - The payment option ID.
     * @param {string} [params.billingAddressId] - The billing address ID.
     * @param {string} [params.shippingAddressId] - The shipping address ID.
     * @returns {Promise<void>}
     * @example
     * checkoutJS.shopperApi.applyShopperToCart({paymentOptionId:'10659974519'});
     */
    async applyShopperToCart(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active/apply-shopper";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'applyShopperToCart';
        return _cjs[UTIL].APIRequest(options);
    }

    /**
     * The generic API call method.
     * @param {string} uri - The URI of the request.
     * @param {string} data - The data to be sent with the request.
     * @param {string} method - The HTTP method to use for the request, e.g. 'get', 'post', 'delete'.
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<Object>}
     * @example
     * checkoutJS.shopperApi.applyUri('https://api.digitalriver.com/v1/shoppers/me/carts/active',{},'get');
     */
    async applyUri(uri, data, method, params) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        Object.assign(options.params, params);
        if(uri.startsWith('/')) {
            uri+= _config.apiRequestUrlBase + uri;
        }
        data = data || {};
        options.method = method ? method : GET;
        options.url = uri;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'applyUri';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'applyUri',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:options.method,
        //     url:options.url
        // };
        // _cjs.emit(_logging,log);
        //
        // try {
        //     const response = await _cjs[UTIL].axios(options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrives a list of all available payment methods for the cart - URI> GET /v1/shoppers/me/carts/active/payment-methods
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{paymentMethods:{}}>}
     * @example
     * checkoutJS.shopperApi.getPaymentMethods();
     */
    async getPaymentMethods(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active/payment-methods";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getPaymentMethods';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getPaymentMethods',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url: url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves the product data of the specified product - URI> GET /v1/shoppers/me/products/{productID}
     * @param {string} productID
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{product:{}}>}
     * @example
     * checkoutJS.shopperApi.getProduct('12345678');
     */
    async getProduct(productID, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption();
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/products/"+productID;
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getProduct';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getProduct',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves a list of all the products in the catalog - URI> GET /v1/shoppers/me/products
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{products:{}}>}
     * @example
     * checkoutJS.shopperApi.getProducts();
     */
    async getProducts(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption();
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/products";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getProducts';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getProducts',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves the product family attributes of the specified product - URI> GET /v1/shoppers/me/products/{productID}/family-attributes
     * @param {string} productID
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{familyAttributes:{}}>}
     * @example
     * checkoutJS.shopperApi.getProductsFamilyAttributes('12345678');
     */
    async getProductsFamilyAttributes(productID, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption();
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/products/"+productID+"/family-attributes";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getProductsFamilyAttributes';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getProducts',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves a list of the product categories or the specified category if the category ID is provided - URI> GET /v1/shoppers/me/categories
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{categories:{}}>}
     * @example
     * checkoutJS.shopperApi.getProductCategory('12345678');
     */
    async getCategories( params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption();
        Object.assign(options.params, params);
        const data = {};
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/categories";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getCategories';
        return _cjs[UTIL].APIRequest(options);
    }

    /**
     * Retrieves the product category data of the specified category - URI> GET /v1/shoppers/me/categories/{categoryId}
     * @param {string} categoryId
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{products:{}}>}
     * @example
     * checkoutJS.shopperApi.getProductCategory('12345678');
     */
    async getProductCategory(categoryId, params) {
        const _cjs = this[_CHECKOUTJS];
        if (categoryId) {
            const options = await _cjs[SHOPPERAPI].getAPIOption();
            Object.assign(options.params, params);
            const data = {};
            const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/categories/" + categoryId;
            options.method = GET;
            options.url = url;
            options.data = data;
            options.api = SHOPPERAPI;
            options.callby = 'getProductCategory';
            return _cjs[UTIL].APIRequest(options);

            // const log = {
            //     id: getTime(),
            //     api:SHOPPERAPI,
            //     method:'getProductCategory',
            //     requestParams: options.params,
            //     requestBody: {},
            //     type:GET,
            //     url:url
            // };
            // _cjs.emit(_logging,log);
            // try {
            //     const response = await _cjs[UTIL].axios.get(url, options);
            //     if (response) {
            //         log.responseBody = response.data;
            //         _cjs.emit(_logging,log);
            //         return (log.responseBody);
            //     }
            // }catch(ex){
            //     log.error = ex;
            //     _cjs.emit(_logging,log);
            //     throw ex;
            // }
        }
        return Promise.reject(new Error("categoryId could not null"));
    }

    /**
     * Retrieves the products of the specified category - URI> GET /v1/shoppers/me/categories/{categoryId}
     * @param {string} categoryId
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{products:{}}>}
     * @example
     * checkoutJS.shopperApi.getProductsInCategory('12345678');
     */
    async getProductsInCategory(categoryId,params) {
        const _cjs = this[_CHECKOUTJS];
        if (categoryId) {
            const options = await _cjs[SHOPPERAPI].getAPIOption();
            Object.assign(options.params, params);
            const data = {};
            const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/categories/" + categoryId + "/products";
            options.method = GET;
            options.url = url;
            options.data = data;
            options.api = SHOPPERAPI;
            options.callby = 'getProductsInCategory';
            return _cjs[UTIL].APIRequest(options);

            // const log = {
            //     id: getTime(),
            //     api:SHOPPERAPI,
            //     method:'getProductsInCategory',
            //     requestParams: options.params,
            //     requestBody: {},
            //     type:GET,
            //     url:url
            // };
            // _cjs.emit(_logging,log);
            // try {
            //     const response = await _cjs[UTIL].axios.get(url, options);
            //     if (response) {
            //         log.responseBody = response.data;
            //         _cjs.emit(_logging,log);
            //         return (log.responseBody);
            //     }
            // }catch(ex){
            //     log.error = ex;
            //     _cjs.emit(_logging,log);
            //     throw ex;
            // }
        }
        return Promise.reject(new Error("categoryId could not null"));
    }

    /**
     * Retrieves the data of the spcified offer - URI> GET /v1/shoppers/me/offers/{offerId}
     * @param {string} offerId
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{offer:{}}>}
     * @example
     * checkoutJS.shopperApi.getOffer('12345678');
     */
    async getOffer(offerId,params) {
        const _cjs = this[_CHECKOUTJS];
        if (offerId) {
            const options = await _cjs[SHOPPERAPI].getAPIOption();
            const data = {};
            Object.assign(options.params, params);
            const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/offers/" + offerId;
            options.method = GET;
            options.url = url;
            options.data = data;
            options.api = SHOPPERAPI;
            options.callby = 'getOffer';
            return _cjs[UTIL].APIRequest(options);

            // const log = {
            //     id: getTime(),
            //     api:SHOPPERAPI,
            //     method:'getOffer',
            //     requestParams: options.params,
            //     requestBody: {},
            //     type:GET,
            //     url:url
            // };
            // _cjs.emit(_logging,log);
            // try {
            //     const response = await _cjs[UTIL].axios.get(url, options);
            //     if (response) {
            //         log.responseBody = response.data;
            //         _cjs.emit(_logging,log);
            //         return (log.responseBody);
            //     }
            // }catch(ex){
            //     log.error = ex;
            //     _cjs.emit(_logging,log);
            //     throw ex;
            // }
        }
        return Promise.reject( new Error("offerId could not null"));
    }

    /**
     * Retrieves a list of the cart-specific point of promotions - URI> GET /v1/shoppers/me/carts/active/point-of-promotions
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{pointOfPromotions:{}}>}
     * @example
     * checkoutJS.shopperApi.getCartPointOfPromotions();
     */
    async getCartPointOfPromotions(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption();
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/carts/active/point-of-promotions";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getCartPointOfPromotions';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getCartPointOfPromotions',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves a list of point of promotions from the shopper - URI> GET /v1/shoppers/me/point-of-promotions
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{pointOfPromotions:{}}>}
     * @example
     * checkoutJS.shopperApi.getPointOfPromotions();
     */
    async getPointOfPromotions(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption();
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/point-of-promotions";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getPointOfPromotions';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getPointOfPromotions',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves the data of the specified point of promotion - URI> GET /v1/shoppers/me/carts/active/point-of-promotions/{popName}
     * @param {string} popName
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{pointOfPromotion:{}}>}
     * @example
     * checkoutJS.shopperApi.getPointOfPromotion('Banner_ShoppingCartLocal');
     */
    async getPointOfPromotion(popName,params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption();
        if (popName) {
            const data = {};
            Object.assign(options.params, params);
            const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/point-of-promotions/" + popName;
            options.method = GET;
            options.url = url;
            options.data = data;
            options.api = SHOPPERAPI;
            options.callby = 'getPointOfPromotion';
            return _cjs[UTIL].APIRequest(options);

            // const log = {
            //     id: getTime(),
            //     api:SHOPPERAPI,
            //     method:'getPointOfPromotion',
            //     requestParams: options.params,
            //     requestBody: {},
            //     type:GET,
            //     url:url
            // };
            // _cjs.emit(_logging,log);
            // try {
            //     const response = await _cjs[UTIL].axios.get(url, options);
            //     if (response) {
            //         log.responseBody = response.data;
            //         _cjs.emit(_logging,log);
            //         return (log.responseBody);
            //     }
            // }catch(ex){
            //     log.error = ex;
            //     _cjs.emit(_logging,log);
            //     throw ex;
            // }
        }
        return Promise.reject(new Error("popName could not null"));
    }

    /**
     * Retrieves a list of all the offers of the specified point of promotion - URI> GET /v1/shoppers/me/point-of-promotions/{popName}/offers
     * @param {string} popName
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{offers:{}}>}
     * @example
     * checkoutJS.shopperApi.getPointOfPromotionOffer('Banner_ShoppingCartLocal');
     */
    async getPointOfPromotionOffer(popName,params) {
        const _cjs = this[_CHECKOUTJS];
        let options = await _cjs[SHOPPERAPI].getAPIOption({});
        if (popName) {
            const data = {};
            Object.assign(options.params, params);
            const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/point-of-promotions/" + popName + "/offers";
            options.method = GET;
            options.url = url;
            options.data = data;
            options.api = SHOPPERAPI;
            options.callby = 'getPointOfPromotionOffer';
            return _cjs[UTIL].APIRequest(options);

            // const log = {
            //     id: getTime(),
            //     api:SHOPPERAPI,
            //     method:'getPointOfPromotion',
            //     requestParams: options.params,
            //     requestBody: {},
            //     type:GET,
            //     url:url
            // };
            // _cjs.emit(_logging,log);
            // try {
            //     const response = await _cjs[UTIL].axios.get(url, options);
            //     if (response) {
            //         log.responseBody = response.data;
            //         _cjs.emit(_logging,log);
            //         return (log.responseBody);
            //     }
            // }catch(ex){
            //     log.error = ex;
            //     _cjs.emit(_logging,log);
            //     throw ex;
            // }
        }
        return Promise.reject(new Error("popName could not null"));
    }

    /**
     * Retrieves the order data of the specified order - URI> GET /v1/shoppers/me/orders/{orderId}
     * @param {string} orderId
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{order:{}}>}
     * @example
     * checkoutJS.shopperApi.getOrder('12345678');
     */
    async getOrder(orderId,params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        if (orderId) {
            const data = {};
            Object.assign(options.params, params);
            const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/orders/" + orderId;
            options.method = GET;
            options.url = url;
            options.data = data;
            options.api = SHOPPERAPI;
            options.callby = 'getOrder';
            return _cjs[UTIL].APIRequest(options);

            // const log = {
            //     id: getTime(),
            //     api:SHOPPERAPI,
            //     method:'getOrder',
            //     requestParams: options.params,
            //     requestBody: {},
            //     type:GET,
            //     url:url
            // };
            // _cjs.emit(_logging,log);
            // try {
            //     const response = await _cjs[UTIL].axios.get(url, options);
            //     if (response) {
            //         log.responseBody = response.data;
            //         _cjs.emit(_logging,log);
            //         return (log.responseBody);
            //     }
            // }catch(ex){
            //     log.error = ex;
            //     _cjs.emit(_logging,log);
            //     throw ex;
            // }
        }
        return Promise.reject(new Error("orderId could not null"));
    }

    //TODO: under in develop
    async getOrderDetail(requisitionId, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        if (requisitionId) {
            const data = {};
            Object.assign(options.params, params);
            const _url = _cjs[UTIL].parseURL(_cjs[CONFIG].drUrl);
            const url = _cjs[UTIL].format(_cjs[CONFIG].url.orderDetail, {
                domain: _url.hostname,
                siteId: _cjs[CONFIG].siteId,
                requisitionId: requisitionId
            });
            options.method = GET;
            options.url = url;
            options.data = data;
            options.api = SHOPPERAPI;
            options.callby = 'getOrderDetail';
            return _cjs[UTIL].APIRequest(options);

            // const log = {
            //     id: getTime(),
            //     api:SHOPPERAPI,
            //     method:'getOrderDetail',
            //     requestParams: options.params,
            //     requestBody: {},
            //     type:GET,
            //     url:url
            // };
            // _cjs.emit(_logging,log);
            // try {
            //     const response = await _cjs[UTIL].axios.get(url, options);
            //     if (response) {
            //         log.responseBody = response.data;
            //         _cjs.emit(_logging,log);
            //         return (log.responseBody);
            //     }
            // }catch(ex){
            //     log.error = ex;
            //     _cjs.emit(_logging,log);
            //     throw ex;
            // }
        }
        return Promise.reject(new Error("orderId could not null"));
    }

    /**
     * Retrieves the history of orders for the shopper. - URI> GET /v1/shoppers/me/orders
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{orders:{}}>}
     * @example
     * checkoutJS.shopperApi.getOrders();
     */
    async getOrders(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/orders";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getOrders';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getOrders',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves the return data of the specified order. - URI> GET /v1/shoppers/me/orders/{orderId}/returns
     * @param {string} orderId
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{returns:{}}>}
     * @example
     * checkoutJS.shopperApi.getOrderReturns('12345678');
     */
    async getOrderReturns(orderId, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/orders/"+orderId+"/returns";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getOrderReturns';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getOrderReturns',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves a list of subscriptions - URI> GET /v1/shoppers/me/subscriptions
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{subscriptions:{}}>}
     * @example
     * checkoutJS.shopperApi.getSubscriptions();
     */
    async getSubscriptions(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/subscriptions";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getSubscriptions';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getSubscriptions',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves the subscription data of the specified subscription - URI> GET /v1/shoppers/me/subscriptions/{subscriptionId}
     * @param {string} subscriptionId
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{subscription:{}}>}
     * @example
     * checkoutJS.shopperApi.getSubscription('12345678');
     */
    async getSubscription(subscriptionId, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/subscriptions/"+subscriptionId;
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getSubscription';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getSubscription',
        //     requestParams: options.params,
        //     requestBody: {},
        //     type:GET,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.get(url, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    /**
     * Retrieves a shopper-specific private store - URI> GET /v1/shoppers/me/purchase-plan
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{purchasePlan:{}}>}
     * @example
     * checkoutJS.shopperApi.getPrivateStores();
     */
    async getPrivateStores(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/purchase-plan";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'getPrivateStores';
        return _cjs[UTIL].APIRequest(options);

    }

    /**
     * Retrieves a list of private stores via search parameters - URI> GET /v1/shoppers/me/purchase-plan/search
     * @param {ShopperApi.QueryParams} [params]
     * @param {string} [params.emailAddress] - The email address to use for the search.
     * @param {string} [params.emailDomain] - The email domain to use for the search.
     * @param {string} [params.emailInvitationAddress] - An email address associated with an invitation to a private store. When a private store shopper invites a friend to view a private store, the invitation email address is that of the inviter.
     * @param {string} [params.emailInvitationPin] - A PIN associated with an email invitation. If a private store shopper invites a friend to view a private store, the PIN is provided with the invitation. Note, Required only if emailInvitationAddress was provided.
     * @param {string} [params.genericIdentifier]
     * @param {string} [params.genericIdentifierPin]
     * @param {string} [params.ipAddress]
     * @param {string} [params.referralUrl]
     * @returns {Promise<{purchasePlan:{}}>}
     * @see https://commerceapi.digitalriver.com/reference#v1shoppersmepurchaseplansearchget
     * @example
     * checkoutJS.shopperApi.searchPrivateStores({
     *     emailDomain:"digitalriver.com"
     * });
     */
    async searchPrivateStores(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        const data = {};
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/purchase-plan/search";
        options.method = GET;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'searchPrivateStores';
        return _cjs[UTIL].APIRequest(options);

    }

    /**
     * Retrieves a shopper-specific private store - URI> GET /v1/shoppers/me/purchase-plan/authorize
     * @param {ShopperApi.QueryParams} data
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<{purchasePlan:{}}>}
     * @example
     * checkoutJS.shopperApi.authorizePrivateStore({
     *      "purchasePlanAuthorize": {
     *          "id": "878409610016",
     *          "targetMarketId": "878394610016",
     *          "emailDomain": "digitalriver.com"
     *      }
     *  });
     *  checkoutJS.shopperApi.authorizePrivateStore({
     *      "purchasePlanAuthorize": {
     *          "id": "878409610016",
     *          "targetMarketId": "878394610016",
     *          "emailAddress": "oiong@digitalriver.com"
     *      }
     *  })
     *  checkoutJS.shopperApi.authorizePrivateStore({
     *      "purchasePlanAuthorize": {
     *          "id": "878409610016",
     *          "targetMarketId": "878394610016",
     *          "ipAddress": "1.2.3.4"
     *      }
     *  })
     *  checkoutJS.shopperApi.authorizePrivateStore({
     *      "purchasePlanAuthorize": {
     *          "id": "878409610016",
     *          "targetMarketId": "878394610016",
     *          "referralUrl": "https://gc.digitalriver.com/"
     *      }
     *  })
     *  checkoutJS.shopperApi.authorizePrivateStore({
     *      "purchasePlanAuthorize": {
     *          "id": "878409610016",
     *          "targetMarketId": "878394610016",
     *          "emailInvitationAddress": "oiong@digitalriver.com",
     *          "emailInvitationPin": "I2wbfVSg"
     *      }
     *  })

     */
    async authorizePrivateStore(data, params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption({authentication:true});
        Object.assign(options.params, params);
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/me/purchase-plan/authorize";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'authorizePrivateStore';
        return _cjs[UTIL].APIRequest(options);
    }

    /**
     * Looks up an order - URI> GET /v1/shoppers/order-lookup
     * @param {ShopperApi.QueryParams} [params]
     * @param {string} [params.orderId] - The order ID for the order ID and password lookup option.
     * @param {string} [params.password] - The order password for the order ID and password lookup option.
     * @param {string} [params.creditCardLastDigits] - The last 4 digits of the credit card used to place the order for the credit card and e-mail address lookup option.
     * @param {string} [params.emailAddress] - The e-mail address used to place the order for the credit card and e-mail address lookup option.
     * @returns {Promise<{orders:{}}>}
     * @example
     * checkoutJS.shopperApi.lookUpOrder({
     *     orderId: '1234567',
     *     password: 'password'
     * });
     * checkoutJS.shopperApi.lookUpOrder({
     *     creditCardLastDigits: '1234',
     *     emailAddress: 'test@email.com'
     * });
     */
    async lookUpOrder(params) {
        const _cjs = this[_CHECKOUTJS];
        const options = await _cjs[SHOPPERAPI].getAPIOption();

        Object.assign(options.params, params);
        const _params = Object.assign({token:await _cjs[SHOPPER].getAccessToken({authentication:true})}, params);
        const data = Object.entries(_params)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join('&');
        const url = _cjs[CONFIG].apiRequestUrlBase + "/v1/shoppers/order-lookup";
        options.method = POST;
        options.url = url;
        options.data = data;
        options.api = SHOPPERAPI;
        options.callby = 'lookUpOrder';
        return _cjs[UTIL].APIRequest(options);

        // const log = {
        //     id: getTime(),
        //     api:SHOPPERAPI,
        //     method:'getCurrentOrder',
        //     requestParams: options.params,
        //     requestBody: data,
        //     type:POST,
        //     url:url
        // };
        // _cjs.emit(_logging,log);
        // try {
        //     const response = await _cjs[UTIL].axios.post(url, data, options);
        //     if (response) {
        //         log.responseBody = response.data;
        //         _cjs.emit(_logging,log);
        //         return (log.responseBody);
        //     }
        // }catch(ex){
        //     log.error = ex;
        //     _cjs.emit(_logging,log);
        //     throw ex;
        // }
    }

    async convertPaymentRequestAddressToShopperApiAddress(prAddressObject, addressType) {
        const _undefined = UNDEFINED;
        let name, firstName, lastName, phone, email, line1, line2, city, postalCode, state, phoneticFirstName, phoneticLastName, companyName, division , country = '';
        if (prAddressObject) {
            if (typeof prAddressObject.name !== _undefined) {
                name = prAddressObject.name;
            }

            if (typeof prAddressObject.firstName !== _undefined) {
                firstName = prAddressObject.firstName;
            }

            if (typeof prAddressObject.lastName !== _undefined) {
                lastName = prAddressObject.lastName;
            }

            if (typeof prAddressObject.phone !== _undefined) {
                phone = prAddressObject.phone;
            }

            if (typeof prAddressObject.email !== _undefined) {
                email = prAddressObject.email;
            }

            if (typeof prAddressObject.organization !== _undefined) {
                companyName = prAddressObject.organization;
            }

            let _address = prAddressObject.address;
            if (!_address) {
                _address = prAddressObject
            }
            if (typeof _address.line1 !== _undefined) {
                line1 = _address.line1;
            }

            if (typeof _address.line2 !== _undefined) {
                line2 = _address.line2;
            }

            if (typeof _address.city !== _undefined) {
                city = _address.city;
            }

            if (typeof _address.postalCode !== _undefined) {
                postalCode = _address.postalCode;
            }

            if (typeof _address.state !== _undefined) {
                state = _address.state;
            }

            if (typeof _address.country !== _undefined) {
                country = _address.country.toUpperCase();
            }

            let additionalAddressInfo = prAddressObject.additionalAddressInfo;
            if(additionalAddressInfo) {
                if (typeof additionalAddressInfo.division !== _undefined) {
                    division = additionalAddressInfo.division;
                }
                if (typeof additionalAddressInfo.phoneticFirstName !== _undefined) {
                    phoneticFirstName = additionalAddressInfo.phoneticFirstName;
                }
                if (typeof additionalAddressInfo.phoneticLastName !== _undefined) {
                    phoneticLastName = additionalAddressInfo.phoneticLastName;
                }
            }

            const address = {
                "id": addressType,
                "name": name,
                "firstName": firstName,
                "lastName": lastName,
                "line1": line1,
                "line2": line2,
                "phoneNumber": phone,
                "city": city,
                "countrySubdivision": state,
                "postalCode": postalCode,
                "country": country,
                "emailAddress": email,
                "phoneticFirstName": phoneticFirstName,
                "phoneticLastName": phoneticLastName,
                "companyName": companyName,
                "division": division,
            };

            return (address);

        } else {
            return {};
        }
    }
}

/**
 * @class ShopperApiCredentials
 * @classdesc The ShopperApiCredentials for confidential type key
 * @extends ShopperApi
 * @param {CheckoutJS} parent
 * @returns {Promise<ShopperApiCredentials>}
 * @category CommerceAPI
 */
class ShopperApiCredentials extends ShopperApi {

    constructor(parent) {
        super(parent, {
            excludeMethods: {constructor: true},
            writableMethods: {}
        });
    }

    /**
     * Logs in with the specified reference ID.
     * @param {string} dr_external_reference_id
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.AccessTokenObject>}
     * @example
     * checkoutJS.shopperApi.loginByReferenceId('12345678');
     */
    async loginByReferenceId(dr_external_reference_id, params) {
        const _cjs = this[_CHECKOUTJS];

        const _params = {
            grant_type:'client_credentials',
            dr_external_reference_id:dr_external_reference_id || '',
        };
        const dr_session_token = (await _cjs[SHOPPERAPI].getSessionToken()) || '';
        if(dr_session_token.length) {
            _params['dr_session_token'] = dr_session_token;
        }
        return this.createOAuthToken(_params,params);
    }

    /**
     * Logs in with the specified user ID.
     * @param {string} dr_user_id
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.AccessTokenObject>}
     * @example
     * checkoutJS.shopperApi.loginByUserId('test@email.com');
     */
    async loginByUserId(dr_user_id, params) {
        const _cjs = this[_CHECKOUTJS];

        const _params = {
            grant_type:'client_credentials',
            dr_user_id:dr_user_id || '',
        };
        const dr_session_token = (await _cjs[SHOPPERAPI].getSessionToken()) || '';
        if(dr_session_token.length) {
            _params['dr_session_token'] = dr_session_token;
        }
        return this.createOAuthToken(_params,params);
    }

    /**
     * Logs in with the specified username and password.
     * @param {string} username
     * @param {string} password
     * @param {ShopperApi.QueryParams} [params]
     * @returns {Promise<ShopperApi.AccessTokenObject>}
     * @example
     * checkoutJS.shopperApi.login('test@email.com','password');
     */
    async login(username, password, params) {
        const _cjs = this[_CHECKOUTJS];
        const _params = {
            grant_type: 'client_credentials',
            username: username,
            password: _cjs[UTIL].base64Encode(password)
        };

        const dr_session_token = (await _cjs[SHOPPERAPI].getSessionToken()) || '';
        if (dr_session_token.length) {
            _params['dr_session_token'] = dr_session_token;
        }

        return this.createOAuthToken(_params, params);
    }
}

export {ShopperApi,ShopperApiCredentials};
