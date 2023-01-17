import {Base} from './base';
import {_CHECKOUTJS, CONFIG, UTIL, SHOPPER, CJS, SHOPPERAPI, CARTDATA, PAYMENT} from "./keywords";

/**
 * @class Shopper
 * @extends Base
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @returns {Promise<Shopper>}
 * @category CommerceAPI
 */
class Shopper extends Base {

    constructor(parent, collection) {
        super(parent, Object.assign({
            excludeMethods: {constructor: true},
            writableMethods: {
                getPrefix: true,
                applyHeaders: true,
                getAccessToken: true,
                getSessionToken: true
            }
        }, collection));
        /**
         * The locale used by the shopper.
         * @name locale
         * @type String
         * @memberOf Shopper
         * @instance
         * @example en_US
         */
        this.locale = parent[CONFIG].locale;
        /**
         * The currency used by the shopper.
         * @name currency
         * @type String
         * @memberOf Shopper
         * @instance
         * @example USD
         */
        this.currency = parent[CONFIG].currency;
        parent[SHOPPER] = this;
        return (async () => {
            const checkoutJS = await parent[UTIL].getValue(CJS);
            if (checkoutJS) {
                parent[UTIL].extend(parent, checkoutJS);
            }
            return parent[SHOPPER];
        })();
    }

    /**
     * Updates the shopper's session data from the response of a refresh request.
     * @param {Object} shopper
     * @param {string[]} [shopper.gcCookies] - The session cookie from Global Commerce.
     * @param {Object} [shopper.sessionToken] - The access token payload.
     * @param {string} [shopper.sessionToken.access_token] - The access token.
     * @param {int} [shopper.sessionToken.expires_in] - The time in seconds until this token expires.
     * @param {string} [shopper.sessionToken.refresh_token] - Use the refresh token to obtain new access tokens.
     * @param {string} [shopper.sessionToken.token_type] - The type of token.
     * @returns {Promise<void>}
     * @readonly
     */
    async setShopper(shopper) {
        const _cjs = this[_CHECKOUTJS];
        try {
            if(!this.locale) this.locale = _cjs[CONFIG].locale;
            if(!this.currency) this.currency = _cjs[CONFIG].currency;
            if (shopper && Object.keys(shopper).length > 0) {
                if (typeof shopper === 'string') {
                    shopper = JSON.parse(shopper);
                }
                if (Array.isArray(shopper.gcCookies) && shopper.gcCookies.length > 0) {
                    const _cookie = {};
                    shopper.gcCookies.forEach(function (part, index) {
                        this[index] = this[index].split(';')[0];
                        let cookieItem = this[index].split('=');
                        _cookie[cookieItem[0]] = cookieItem[1];
                    }, shopper.gcCookies);
                    shopper.gcCookies = _cookie;
                }
                _cjs[UTIL].extend(_cjs[SHOPPER], shopper);
                await _cjs[UTIL].setValue(CJS, _cjs.toJSON(true));
                /**
                 * This event will be triggered after the shopper has been updated.
                 * @memberof CheckoutJS
                 * @event shopperUpdated
                 * @category Events
                 * @example checkoutJS.on('shopperUpdated',function(shopper){
                 *     console.dir(shopper);
                 * })
                 */
                _cjs.emit ? _cjs.emit('shopperUpdated', _cjs[SHOPPER]) : null;
            }
        }catch(ex){
            return Promise.reject(ex);
        }
    }

    async getPrefix() {
        const _cjs = this[_CHECKOUTJS];
        return (_cjs[CONFIG].prefixName + _cjs[CONFIG].siteId + '_');
    }

    /**
     * Retrieves a new access token via Commerce API for the shopper or return an existing one.
     * @param {Object} [setting={}]
     * @param {Boolean} setting.authentication - Set to true if an access token is required.
     * @returns {Promise<string>}
     */
    async getAccessToken(setting={}) {
        const _cjs = this[_CHECKOUTJS];
        const _shopper = _cjs[SHOPPER];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        if (_shopper.sessionToken && _shopper.sessionToken.access_token) {
            return _shopper.sessionToken.access_token;
        }
        if(setting.authentication){

            if(_config.entity && _config.entity.code && _config.entity.code.length === 0 && _config.drUrl.length !== 0) {
                const url = _util.parseURL(_config.drUrl);
                const newUrl = _util.format(_config.url.config, {
                    domain: url.hostname,
                    siteId: _config.siteId
                });
                try {
                    await _cjs[UTIL].updateConfig(newUrl, true);
                }catch(ex){
                    _config.drCheckoutJS = false;
                }
            }
            let sessionToken;
            if(_config.drUrl.length === 0) {
                sessionToken = await _shopperApi.getShopperAccessToken();
                await _cjs[SHOPPERAPI].updateShopper({},{locale:_config.locale,currency:_config.currency});
            } else {
                const format = (_config.page.length === 0)?'jsonp':'json';
                sessionToken = await _shopperApi.getSessionToken({apiKey:_config.apiKey,format:format});
            }
            return (sessionToken?sessionToken.access_token:null);
        }
    }

    async applyHeaders(options) {
        const _cjs = this[_CHECKOUTJS];
        const _shopper = _cjs[SHOPPER];
        if(_cjs[UTIL].isNode) {
            if (_shopper.gcCookies && Array.isArray(_shopper.gcCookies)) {
                options.headers.Cookie = _shopper.gcCookies.join("; ");
            } else if (_shopper.gcCookies && typeof (_shopper.gcCookies) === 'object') {
                const cookies = [];
                Object.entries(_shopper.gcCookies).forEach(([key, value]) => {
                    cookies.push(encodeURIComponent(key)+"="+encodeURIComponent(value));
                });
                options.headers.Cookie = cookies.join("; ");
            }
        }
    }

    /**
     * Destroys the shopper instance.
     * @param {Object} [options={}]
     * @param {Boolean} [options.disableCache] - When this value is set to false, the shopper data will not be removed from the shopper instance.
     * @param {Boolean} [options.disableStorage] - When this value is set to false, the shopper data will not be removed from the session storage.
     * @returns {Promise<void>}
     */
    async destroy(options) {
        options = options || {};
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        if(options.disableCache !== true) {
            delete this.sessionToken;
            delete this.gcCookies;
            delete this.tokenInfo;
            delete this.isAuthenticated;
            delete this.locale;
            delete this.currency;
        }
        if(options.disableStorage !== true) {
            await _util.removeValue(CJS);
            await _util.removeValue(CARTDATA);
            await _util.removeValue(PAYMENT);
            await _util.removeValue(`${PAYMENT}_CREATEDTYPE`);
            await _util.removeValue('businessEntityCode');
        }
        _cjs.emit('shopperUpdated', _cjs[SHOPPER]);
    }

    toJSON(deep){
        const _cjs = this[_CHECKOUTJS];
        const shopper = _cjs[SHOPPER];
        const result = { };
        for (let x in shopper) {
            if (shopper.hasOwnProperty(x) && !(deep && PROTECTED_LIST.includes(x)) )
            {
                result[x] = shopper[x];
            }
        }
        return result;
    }
}
const PROTECTED_LIST = ['gcCookies'];
export {Shopper};
