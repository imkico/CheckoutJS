import {Config as DefaultConfig} from './config';
import {Global, Util} from './util';
import {LOGGING, DRJS, CONFIG, UTIL, SHOPPER, SHOPPERAPI, PAYMENTS, CJS, CARTDATA, PAYMENT_SERVICE} from './keywords';
import {BrowserUtil} from './browsers/browserUtil';
import {ShopperApi,ShopperApiCredentials} from './shopperApi';
import {PaymentService} from './paymentService';
import {Storefront} from './browsers/storefront';
import {GlobalCommerce} from './browsers/globalCommerce';
import {NodePayments} from './node/payment';

class CheckoutJS {
    /**
     * @class CheckoutJS
     * @classdesc The main class of CheckoutJS.
     * @param {module:Config|string} [config] - The default configuration for CheckoutJS.
     * @param {Session} [session] - The user session object, e.g. sessionStorage for browsers, req.session for Express.
     * @returns {Promise<CheckoutJS>}
     * @throws Throws an error if the configuration is incorrect.
     * @see {@tutorial class-diagram}
     * @example var checkoutJS = await (new CheckoutJS({
     *   "apiKey": "c9f0ce6755214355b89ef8179687ffee",
     *   "siteId": "stdtest2",
     *   "currency": "USD",
     *   "locale": "en_US",
     *   "lang": "en",
     *   "drjsApiKey":"pk_hc_60bdf4ec989f48088d3732ca1fa2518b",
     *   "apiRequestUrlBase":"https://dispatch-cte.digitalriverws.net",
     *   "payments": {
     *       "applePay": {
     *       "disable": false
     *     },
     *     "googlePay": {
     *       "disable": false
     *     },
     *     "creditCard": {
     *       "disable": false
     *     }
     *   },
     *   "debug": true
     * });
     */
    constructor(config, session) {
        const _this = this;
        /**
         * The unique ID of the CheckoutJS instance.
         * @name id
         * @type symbol
         * @memberof CheckoutJS
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
         * @instance
         * @readonly
         * @example checkoutJS.id;
         */
        _this.id = Symbol("CheckoutJS");

        /**
         * General utility functions.
         * @name util
         * @type Util|BrowserUtil
         * @memberof CheckoutJS
         * @see {@link Util} - for NodeModule
         * @see {@link BrowserUtil} - for Browser
         * @instance
         * @readonly
         * @example checkoutJS.util;
         */
        let _util = _this[UTIL] = new Util(_this,{},session);

        /**
         * Commerce API (Shopper API) wrapper functions.
         * @name shopperApi
         * @type ShopperApi|ShopperApiCredentials
         * @memberof CheckoutJS
         * @see {@link ShopperApi} (public)
         * @see {@link ShopperApiCredentials} (confidential)
         * @readonly
         * @instance
         * @example checkoutJS.shopperApi;
         */
        _this[SHOPPERAPI] = new ShopperApi(_this);

        /**
         * Payment services wrapper functions.
         * @name paymentService
         * @type PaymentService
         * @memberof CheckoutJS
         * @see PaymentService
         * @readonly
         * @instance
         * @example checkoutJS.paymentService;

         */
        _this[PAYMENT_SERVICE] = new PaymentService(_this);

        /**
         * The configuration payload, which includes all settings and can be customized.
         * @name config
         * @type module:Config
         * @memberof CheckoutJS
         * @see module:Config
         * @see {@link module:ConfigGC} - for Global Commerce hosted sites
         * @instance
         */
        _this[CONFIG] = _this[UTIL].extend({}, DefaultConfig, (typeof config !== 'object')?{}:config);
        let customize = {};
        if (typeof Global.checkoutJS === 'object' && !(Global.checkoutJS instanceof CheckoutJS)) {
            customize = Global.checkoutJS;
        }

        setEvent.call(_this);

        /**
         * This event will be triggered after the cart has been updated.
         * @memberof CheckoutJS
         * @event cartUpdated
         * @param {ShopperApi.CartDataObject} cartData
         * @category Events
         * @example checkoutJS.on('cartUpdated',function(cartData){
         *     console.dir(cartData);
         * });
         */
        _this.on('cartUpdated', async function() {

            const _this = this;
            const cartData = await _util.getValue(CARTDATA);
            if (cartData) {
                _this[CONFIG].entity.code = cartData.cart.businessEntityCode;
                const businessEntityCode = await _util.getValue('businessEntityCode');
                if (businessEntityCode !== cartData.cart.businessEntityCode) {
                    await legalUpdate.call(_this);
                    await _util.setValue('businessEntityCode', cartData.cart.businessEntityCode);
                    /**
                     * The event will be triggered after the entity has been changed.
                     * @memberof CheckoutJS
                     * @event entityUpdate
                     * @category Events
                     * @example checkoutJS.on('entityUpdate',function(entity){
                     *     console.dir(entity);
                     * });
                     */
                    _this.emit('entityUpdate', await _this.getEntity());
                    await _util.removeValue('DISCLOSURE');
                }
            }
        },_this);

        _this.on(LOGGING, function(log) {
            const _this = this;
            if(log.api===SHOPPERAPI || log.method === 'updateConfig') {
                if(log.responseBody) {
                    const key = [log.api, ':', log.method, "(", log.type.toUpperCase(), ")"];
                    _util.log(key.join(''), log.url || '', log.responseBody || '', log);
                }
            }else if(log.api===DRJS){
                const key = [log.api, ':', log.method, "(", log.payment, ")"];
                _util.log(key.join(''), log.event || '', log);
            }else{
                const key = [log.api, ':', log.method];
                _util.log(key.join(''), log);
            }

            if(_this[CONFIG].debug){
                const logStr = JSON.stringify(log);
                const url = _util.parseURL(_this[CONFIG].drUrl);
                const newUrl = _util.format(_this[CONFIG].url.config, {
                    domain: url.hostname,
                    siteId: _this[CONFIG].siteId
                });
                const options = {
                    params: {
                        type: log.api,
                        method: log.method
                    },
                    withCredentials: true
                };
                const data = Object.entries({
                    log:logStr
                })
                    .map(([key, val]) => `${key}=${encodeURIComponent(JSON.stringify(val))}`)
                    .join('&');
                try {
                    _util.axios.post(newUrl, data, options);
                }catch(ex) {
                    console.error(ex);
                }
            }
        }.bind(_this));

        /**
         * Emit this event to re-render all payments.
         * @memberof CheckoutJS
         * @event initializePayments
         * @returns {Promise}
         * @category Events
         * @example checkoutJS.emit('initializePayments');
         */
        _this.on("initializePayments", async function(){
            const _this = this;
            if (_util.isBrowser) {
                let _storefront = _this.storefront;
                if (_util.isGCPage()) {
                    _storefront = _this.gC;
                }
                if(_storefront) {
                    await _storefront.initDigitalRiverJS();
                    await _storefront._destroyPayments();
                    return await _storefront._initPayments();
                }
                return Promise.resolve();
            }
            return Promise.resolve();
        },_this);

        /**
         * Emit this event to destroy all payments.
         * @memberof CheckoutJS
         * @event destroyPayments
         * @returns {Promise}
         * @category Events
         * @example checkoutJS.emit('destroyPayments');
         */
        _this.on("destroyPayments", async function(){
            const _this = this;
            if (_util.isBrowser) {
                let _storefront = _this.storefront;
                if (_util.isGCPage()) {
                    _storefront = _this.gC;
                }
                return await _storefront._destroyPayments();
            }
            return Promise.resolve();
        },_this);

        return (async () => {
            const _defineProperties = {
                "sync": {
                    value: this.sync.bind(_this),
                    writable: false,
                    enumerable: false,
                    configurable: false
                },
                "updateLocaleAndCurrency": {
                    value: this.updateLocaleAndCurrency.bind(_this),
                    writable: false,
                    enumerable: false,
                    configurable: false
                }
            };
            if (_util.isBrowser) {
                _util = _this[UTIL] = new BrowserUtil(_this,{},session);
            }
            _util.extend(_util, customize.util);

            _defineProperties[UTIL] = {
                value: _util,
                writable: false,
                enumerable: true,
                configurable: false
            };

            const _cfg = await _util._initConfig(config);
            if (_cfg) {
                config = _cfg;
            }
            if (config && typeof config.apiKey === 'object' && config.apiKey.apiKey && typeof config.apiKey.apiKey === 'string' ) {
                await _util.extend(config, config.apiKey);
            }
            if(typeof config == 'object') {
                await _util.extend(_this[CONFIG], config);
            }

            if(_this[CONFIG].drUrl.length === 0){
                const url = _util.parseURL(_this[CONFIG].url.config);
                if(url.hostname){
                    _this[CONFIG].drUrl = `https://${url.hostname}/`;
                }
            }
            if(_this[CONFIG].apiKey.length === 0){
                config = await updateConfig.call(_this);
                _util.extend(_this[CONFIG],config);
            }

            _util.extend(_this[CONFIG], customize.config);

            _defineProperties["config"] = {
                writable: true,
                enumerable: true,
                configurable: false
            };

            /**
             * Emit this event to log to the console.
             * @memberof CheckoutJS
             * @event logging
             * @category Events
             * @example checkoutJS.on('logging',function(logs){
             *     console.dir(logs);
             * });
             */
            _this.emit(LOGGING,{
                id: _util.getTime(),
                api:CJS,
                method:'loading',
                requestParams: _util.extend({},_this[CONFIG],{template:""})
            });

            await _util.setValue(CJS,_this.toJSON(true));
            if (_util.isBrowser && _this[CONFIG].apiKey.length) {
                /**
                 * The Storefront instance.
                 * @name storefront
                 * @type Storefront
                 * @memberof CheckoutJS
                 * @see Storefront
                 * @instance
                 * @readonly
                 */
                const _storefront = await new Storefront(_this);
                _this.storefront = _storefront;
                await _storefront._createPayments(_this);
                _storefront.initDigitalRiverJS().then();
                _this.on('initializeElements',async function() {
                    await _this.storefront.initCompliance();
                });
                if (_util.isGCPage()) {

                    if(!_cfg.hasOwnProperty('isAuthenticated')) {
                        await _this[SHOPPERAPI].getTokenInfo();
                    }
                    /**
                     * The logic for payments and layouts on the checkout pages of Global Commerce (gC) hosted sites, which only exists on gC pages.
                     * @name gC
                     * @type GlobalCommerce
                     * @memberof CheckoutJS
                     * @see GlobalCommerce
                     * @instance
                     * @readonly
                     * @example checkoutJS.gC;
                     */
                    const globalCommerce = await new GlobalCommerce(_this);
                    _this.gC = globalCommerce;
                    _util.extend(globalCommerce, customize['gC']);
                    if (_this[CONFIG].init) {
                        await globalCommerce.initPageLoad();
                    }
                    await globalCommerce._createPayments(_this);

                    _defineProperties['gC'] = {
                        writable: false,
                        enumerable: true,
                        configurable: false
                    };

                }

                _defineProperties["storefront"] = {
                    writable: false,
                    enumerable: true,
                    configurable: false
                };

                _defineProperties[PAYMENTS] = {
                    writable: false,
                    enumerable: true,
                    configurable: false
                };

                _defineProperties[SHOPPER] = {
                    writable: false,
                    enumerable: true,
                    configurable: false
                };

            } else if (_util.isNode) {
                await new NodePayments(_this);
            }
            if(_this[CONFIG].authUserName.length !== 0 && _this[CONFIG].authPassword.length !== 0 ){
                _this[SHOPPERAPI] = new ShopperApiCredentials(_this);
            }
            _util.extend(_this[SHOPPERAPI], customize[SHOPPERAPI]);

            _defineProperties[SHOPPERAPI] = {
                value: _this[SHOPPERAPI],
                writable: false,
                enumerable: true,
                configurable: false
            };

            Object.defineProperties(_this, _defineProperties);
            _util.extend(_this, customize);

            if(_util.isBrowser) {
                _this.once('initializePageElement', async () => {
                    await _this.emit("initializeElements");
                    await _this.emit("initializePayments");
                    await _this.emit("initializedPageElement");
                });

                /**
                 * This event will be triggered if the CheckoutJS elements and payments need to be initialized.
                 * @memberof CheckoutJS
                 * @event initializeElements
                 * @category Events
                 * @example checkoutJS.on('initializeElements',function(){
                 *     console.log('CheckoutJS elements initialize');
                 * })
                 */
                if (_this[CONFIG].init) {
                    BrowserUtil.ready(async () => {
                        await _this.emit('initializePageElement');
                    });
                }
            }

            /**
             * This event will be triggered after the CheckoutJS instance has been initialized.
             * @memberof CheckoutJS
             * @event initialized
             * @category Events
             * @example checkoutJS.on('initialized',function(){
             *     console.log('CheckoutJS is ready');
             * })
             */
            await _this.emit('initialized', _this);

            return _this;
        })();
    }

    async getConfirmDisclosure() {
        const _cjs = this;
        const disclosure = await _cjs.getDisclosure();
        return disclosure.confirmDisclosure?.localizedText;
    }

    async getAutorenewalPlanTerms() {
        const _cjs = this;
        const disclosure = await _cjs.getDisclosure();
        return disclosure.autorenewalPlanTerms?.localizedText;
    }

    async hasAutorenewal() {
        const _cjs = this;
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        let autoRenewal = false;
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        if(cartData.cart.lineItems.lineItem) {
            cartData.cart.lineItems.lineItem.forEach((lineItem) => {
                lineItem.product.customAttributes.attribute.forEach((attribute) => {
                    if (attribute.name === "isAutomatic" && attribute.value === "true") {
                        autoRenewal = true;
                    }
                });
            });
        }
        return autoRenewal;
    }

    async getDisclosure() {
        const _cjs = this;
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        if(_config.entity.code && _cjs.drjs)
        {
            let disclosure = await _util.getCache('DISCLOSURE'+_config.locale);
            if(!disclosure) {
                disclosure = _cjs.drjs.Compliance.getDetails(_config.entity.code, _config.locale);
                await _util.setCache('DISCLOSURE'+_config.locale,disclosure);
            }
            return disclosure.disclosure;
        }
        return {};
    }

    getEntity() {
        const _this = this;
        return _this[CONFIG].entity;
    }

    /**
     * Syncs local cart data and shopper data from Commerce API.
     * @returns {Promise}
     * @example checkoutJS.sync();
     */
    async sync() {
        const _this = this;
        const _util = _this[UTIL];
        await Promise.all([
            updateConfig.call(_this, true).then((config)=> {
                _util.extend(_this[CONFIG], config);
            }),
            _this[SHOPPERAPI].getCart()
        ]);
        await _util.setValue(CJS,_this.toJSON(true));
    }

    /**
     * Updates the locale and currency for the cart and shopper.
     * @param {string} locale - The locale code, e.g. en_US.
     * @param {string} currency - The currency code, e.g. USD.
     * @returns {Promise}
     * @example checkoutJS.updateLocaleAndCurrency('en_GB','GBP');
     */
    async updateLocaleAndCurrency(locale, currency) {
        const _this = this;
        const _util = _this[UTIL];
        const _config = _this[CONFIG];
        const _shopperApi = _this[SHOPPERAPI];
        const data = {
            locale: locale,
            currency: currency
        };
        _this.drjs = null;
        await _shopperApi.updateShopper({shopper: data});
        await _shopperApi.getCart();
        const force = (_config.locale !== locale || _config.currency !== currency);
        _config.locale = locale;
        _config.currency = currency;
        const cfg = await updateConfig.call(_this, force);
        if (cfg && typeof cfg.apiKey === 'object' && cfg.apiKey.apiKey && typeof cfg.apiKey.apiKey === 'string' ) {
            _util.extend(cfg, cfg.apiKey);
        }
        _util.extend(_config,cfg);
        await _this.emit("initializePayments");
        await _util.setValue(CJS,_this.toJSON(true));
    }

    /**
     * Destroys the checkoutJS instance, including DigitalRiver.js payment elements and local shopper data.
     * @returns {Promise<void>}
     * @example checkoutJS.destroy();
     * @readonly
     */
    async destroy() {
        const _this = this;
        await _this.emit('destroyPayments');
        await _this[SHOPPER].destroy();
        _this[CONFIG] = DefaultConfig;
        //delete _this.gC;
        //delete _this.util;
        //delete _this.payments;
        //delete _this.shopperApi;
        //delete _this.drjs;
    }

    /**
     * Serializes to a JSON object.
     * @param {boolean} [deep=false] - Option to use deep cloning for JSON serializable types.
     * @returns {{shopper:{},config:{}}}
     * @example JSON.stringify(checkoutJS);
     * @readonly
     */
    toJSON(deep) {
        const _this = this;
        const _shopper = _this[SHOPPER]?_this[SHOPPER].toJSON(deep):{};
        return {
            'shopper': _shopper,
            'config': _this[CONFIG]
        };
    }
}

function setEvent() {
    const _this = this;

    const events = {};
    const eventsObj = {};
    const uniqueIds ={};

    /**
     * Attaches an event handler.
     * @name on
     * @memberOf CheckoutJS
     * @param {string} event
     * @param {Function} listener
     * @param {Object} caller
     * @returns {void}
     * @instance
     * @function on
     * @readonly
     * @example checkoutJS.on('initialized',function(){
     *     console.log('initialized');
     * },this);
     */
    _this.on = function (event, listener, caller ) {
        if (typeof events[event] !== 'object') {
            events[event] = [];
            eventsObj[event] = [];
        }
        events[event].push(listener);
        eventsObj[event].push(caller);
    };

    /**
     * Removes an event handler.
     * @name removeListener
     * @memberOf CheckoutJS
     * @param {string} event
     * @param {Function} listener
     * @returns {void}
     * @instance
     * @function removeListener
     * @readonly
     * @example
     * function initialized(){ console.log('initialized'); };
     * checkoutJS.on('initialized',initialized);
     * checkoutJS.removeListener('initialized', initialized);
     */
    _this.removeListener = function (event, listener) {
        let idx;
        if (typeof events[event] === 'object') {
            idx = events[event].indexOf(listener);

            if (idx > -1) {
                events[event].splice(idx, 1);
                eventsObj[event].splice(idx, 1);
            }
        }
    };

    /**
     * Emits an event.
     * @name emit
     * @memberOf CheckoutJS
     * @param {string} event - The event name.
     * @returns {Promise<Object[]>}
     * @instance
     * @function emit
     * @readonly
     * @example checkoutJS.emit("initializePayments");
     */
    _this.emit = function (event) {
        let i, listeners, length, args = [].slice.call(arguments, 1), callers;

        if (typeof events[event] === 'object') {
            listeners = events[event].slice();
            callers = eventsObj[event].slice();
            length = listeners.length;
            const promise = [];
            for (i = 0; i < length; i++) {
                let caller = callers[i];
                if(!caller) caller = _this;
                promise.push(listeners[i].apply(caller, args));
            }
            return Promise.all(promise);
        }
    };

    /**
     * Attaches an event and removes the event after it has fired, i.e. a one-time event.
     * @name once
     * @memberOf CheckoutJS
     * @param {string} event
     * @param {Function} listener
     * @param {string} id
     * @returns {void}
     * @instance
     * @function once
     * @readonly
     * @example checkoutJS.once('initialized',function(){
     *     console.log('initialized');
     * });
     */
    _this.once = function (event, listener, id) {
        if(id) {
            if(uniqueIds.hasOwnProperty(id)) return;
            uniqueIds[id] = true;
        }
        _this.on(event, function g() {
            _this.removeListener(event, g);
            listener.apply(self, arguments);
        })
    };

    Object.defineProperties(_this, {
        "on": {
            writable: false,
            enumerable: false,
            configurable: false
        },
        "once": {
            writable: false,
            enumerable: false,
            configurable: false
        },
        "emit": {
            writable: false,
            enumerable: false,
            configurable: false
        },
        "removeListener": {
            writable: false,
            enumerable: false,
            configurable: false
        }
    });
}

async function updateConfig(refresh) {
    const _this = this;
    const _config = _this[CONFIG];
    const _util = _this[UTIL];
    if(_config.drUrl.length!==0) {
        const url = _util.parseURL(_config.drUrl);
        const newUrl = _util.format(_config.url.config, {
            domain: url.hostname,
            siteId: _config.siteId
        });
        return await _util.updateConfig(newUrl, refresh);
    }
    return Promise.resolve(_config);
}

async function legalUpdate() {
    const _this = this;
    const _config = _this[CONFIG];
    const _cfg = await updateConfig.call(_this);
    if (_cfg && _cfg.entity) {
        _config.entity = _cfg.entity;
    }
    return Promise.resolve(_config.entity);
}

export {CheckoutJS};
