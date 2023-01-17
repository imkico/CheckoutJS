import axios from 'axios';
import parseurl from 'parseurl';
import {Base} from './base';
import {Shopper} from "./shopper";
import {_CHECKOUTJS, LOGGING, SHOPPER, CONFIG, UTIL, SHOPPERAPI, UNDEFINED, PAYMENTS, CARTDATA} from "./keywords";

const Global = (typeof window !== UNDEFINED ? window : global);

const isBrowser = typeof window !== UNDEFINED && typeof window.document !== UNDEFINED;

/* eslint-disable no-restricted-globals */
const isWebWorker =
    typeof self === 'object' &&
    self.constructor &&
    self.constructor.name === 'DedicatedWorkerGlobalScope';

/* eslint-enable no-restricted-globals */
const isNode =
    typeof process !== UNDEFINED &&
    process.versions != null &&
    process.versions.node != null;
/**
 * @class Util
 * @classdesc The base utility class.
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {Session} [session]
 * @category Utility
 */
class Util extends Base {

    constructor(parent, collection, session) {
        super(parent,extend({
            excludeMethods:{ constructor:true },
            writableMethods:{
                log:true,
                errorMessage:true,
                extractErrorMessage:true,
                encryptPayload:true,
                hasSpecialsCharacters:true,
                useRecurringPayment:true,
                getSourcePaymentType:true,
                getAutoRenewSubscriptionCount:true,
                axios:true,
                error:true
            }
        },collection));
        const _this = this[_CHECKOUTJS];
        this.extend = extend;
        this.isBrowser = isBrowser;
        this.isWebWorker = isWebWorker;
        this.isNode = isNode;

        /**
         * The HTTP client library for API requests.
         * @name axios
         * @type Axios
         * @memberof Util
         * @instance
         * @see https://github.com/axios/axios
         */
        this.axios = Global.axios?Global.axios:axios;

        this.axios.interceptors.response.use((response) =>{
            if(response) {
                response.config.runningTimes = 1;
            }
            return response;
        }, async (error) => {
            if(error.config && !error.config.runningTimes) error.config.runningTimes = 1;
            if (error.response && 401 === error.response.status && error.config.runningTimes<2) {
                error.config.runningTimes++;
                if(!error.config.skipError) {
                    await parent[SHOPPERAPI].refreshToken();
                    return _this[UTIL].axios.request(error.config);
                }
            }
            return Promise.reject(error);
        });

        session = session || {};
        const cache = {};

        /**
         * Stores the value for the specified key in the session.
         * @param {string} name - The property name.
         * @param {string} value - The property value.
         * @returns {Promise<void>}
         */
        this.setValue = async (name, value) => {
            const _cjs = parent;
            const _shopper = _cjs[SHOPPER];
            if(_shopper && _cjs[CONFIG].siteId) {
                const prefix = await _shopper.getPrefix();
                name = prefix + name;
                if (value && typeof value === 'object') {
                    try {
                        session[name] = JSON.stringify(value);
                    }catch(ex){
                        console.error(ex);
                        console.dir(value);
                    }
                } else if (!value) {
                    delete session[name];
                } else {
                    session[name] = value;
                }
            }
        };

        /**
         * Returns the value of the specified key from the session.
         * @param {string} name - The property name.
         * @returns {Promise<Object|null>}
         */
        this.getValue = async (name) => {
            const _cjs = parent;
            const _shopper = _cjs[SHOPPER];
            if(_shopper) {
                const prefix = await _shopper.getPrefix();
                name = prefix + name;
                let _value = session[name];
                if (_value) {
                    try {
                        _value = JSON.parse(session[name]);
                        // eslint-disable-next-line no-empty
                    } catch (ex) {
                    }
                    return (_value);
                }
            }
            return null;
        };

        /**
         * Deletes the specified key and its associated value from the session.
         * @param {string} name - The property name.
         * @returns {Promise<void>}
         */
        this.removeValue = async (name) => {
            const _cjs = parent;
            const prefix = await _cjs[SHOPPER].getPrefix();
            name = prefix + name;
            delete session[name];
        };

        /**
         * Stores the value for the specified key in the internal cache object.
         * @param {string} name - The property name.
         * @param {string} value - The property value.
         * @returns {Promise<void>}
         */
        this.setCache = async (name, value) => {
            cache[name] = value;
        };

        /**
         * Returns the value of the specified key from the internal cache object.
         * @param {string} name - The property name.
         * @returns {Promise<Object|null>}
         */
        this.getCache = async (name) => {
            return (name?cache[name]:cache);
        };

        /**
         * Deletes the specified key and its associated value from the internal cache object.
         * @param {string} name - The property name.
         * @returns {Promise<void>}
         */
        this.removeCache = async (name) => {
            delete cache[name];
        };

    }

    parseURL(url, originalUrl) {
        const _url = parseurl({
            originalUrl: originalUrl,
            url: url
        });

        let match;
        const pl     = /\+/g,
              search = /([^&=]+)=?([^&]*)/g,
              decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
              queryParams = {};
        // eslint-disable-next-line no-cond-assign
        while (match = search.exec(_url.query)) {
            queryParams[decode(match[1])] = decode(match[2]);
        }
        _url.queryParams = queryParams;
        return _url;
    }

    format(txt, obj, replaceElement = false) {
        if (obj) {
            txt = txt.replace(/{([\w.]+)}/g, function (prop) {
                const k = prop.substr(1, prop.length - 2);
                let innerObj = obj;
                k.split('.').forEach((n)=>{
                    if (innerObj && innerObj.hasOwnProperty(n)) {
                        innerObj = innerObj[n] || '';
                    }else{
                        innerObj = null;
                    }
                });
                if (innerObj!==null)
                    return innerObj || '';
                else if(replaceElement)
                    return '';
                else
                    return prop;
            });
        }
        return txt;
    }

    error() {
        const _cjs = this[_CHECKOUTJS];
        const _error = _cjs[CONFIG].debug ? console.error.bind(Global.console) : Global.console.error;
        _error.apply(_cjs, arguments);
    }

    replaceErrors(key, value) {
        if (value instanceof Error) {
            const error = {};
            Object.getOwnPropertyNames(value).forEach(function (key) {
                error[key] = value[key];
            });
            return error;
        }
        return value;
    }

    removeTag(html, emptyValueSelector='*', match = /{([\w.]+)}/g) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        if(emptyValueSelector && emptyValueSelector.length) {
            [...doc.querySelectorAll(emptyValueSelector)]
                .filter(a => a.innerHTML.match(match))
                .forEach(a => a.remove());
        }
        return doc.body.innerHTML;
    }

    getTemplateValue(template) {
        let elem = document.createElement('div');
        elem.innerHTML = template;
        return elem.innerText;
    }

    async _initConfig(cfg) {
        const _cjs = this[_CHECKOUTJS];
        let _cfg = {};
        if(typeof cfg === 'string') {
            try {
                _cfg = JSON.parse(cfg);
                return (_cfg);
            } catch (e) {
                const urlParam =_cjs[UTIL].parseURL(cfg).path.split('/');
                if(urlParam && urlParam[1]==="store" && urlParam.length>=2) {
                    _cjs[CONFIG].siteId = urlParam[2];
                }
            }
        }
        await new Shopper(_cjs);
        if(cfg && (!_cfg.apiKey || _cfg.apiKey.length === 0)  && typeof cfg === "string" && _cjs[CONFIG].apiKey.length === 0 && Object.keys(_cfg).length === 0) {
            _cfg = await _cjs[UTIL].updateConfig(cfg);
        }
        return (_cfg);
    }

    async updateConfig(url, refresh) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopper = _cjs[SHOPPER];
        if(_config.drCheckoutJS !== false) {
            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                responseType: 'json',
                timeout: 10000,
                method: refresh ? 'post' : 'get',
                data: `locale=${_config.locale}&currency=${_config.currency}`,
                url: url,
                withCredentials: true
            };

            await _shopper.applyHeaders(options);

            const response = await _util.axios(options);

            if (response.data) {
                const _cfg = response.data;
                if (_cfg && typeof _cfg.apiKey === 'object' && _cfg.apiKey.apiKey && typeof _cfg.apiKey.apiKey === 'string' ) {
                    _util.extend(_cfg, _cfg.apiKey);
                }
                _util.log('UpdateConfig', _cfg);
                await _shopper.setShopper({
                    locale: _cfg.locale,
                    currency: _cfg.currency,
                    //isAuthenticated: _cfg.isAuthenticated,
                    gcCookies: response.headers ? response.headers['set-cookie'] : null
                });
                return _cfg;
            }
            return response.data;
        }
    }

    async APIRequest(options,callback) {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const log = {
            id: _util.getTime(),
            api:options.api,
            method:options.callby,
            requestParams: options.params || {},
            requestBody: options.data || {},
            type:options.method,
            url:options.url
        };
        _cjs.emit(LOGGING,log);
        try {
            const response = await _util.axios(options);
            if (response) {
                log.responseBody = response.data;
                if(callback) {
                    const callBackResponse = await callback(log, response);
                    if (callBackResponse) {
                        log.responseBody = callBackResponse;
                    }
                }
                _cjs.emit(LOGGING, log);
                return log.responseBody;
            }
        }catch(ex){
            log.error = ex;
            _cjs.emit(LOGGING,log);
            throw ex;
        }
    }

    async log() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _log = _config.debug ? console.log.bind(Global.console) : Global.console.log;
        if(_config.consoleLog) {
            _log.apply(_cjs, arguments);
        }
    }

    async trace() {
        const _cjs = this[_CHECKOUTJS];
        const _trace = _cjs[CONFIG].debug ? console.trace.bind(Global.console) : Global.console.trace;
        _trace.apply(_cjs, arguments);
    }

    async errorMessage() {
        const _cjs = this[_CHECKOUTJS];
        const _error = _cjs[CONFIG].debug ? console.error.bind(Global.console) : Global.console.error;
        _error.apply(_cjs, arguments);
    }

    async extractErrorMessage(ex) {
        const _cjs = this[_CHECKOUTJS];
        let message;
        if(ex) {
            message = ex.message;
            if (ex && ex.response && ex.response.data && ex.response.data.errors && ex.response.data.errors.error.code) {
                message = ex.response.data.errors.error.code;
                if (_cjs[CONFIG].labels.error[message]) {
                    message = _cjs[CONFIG].labels.error[message];
                }
            } else if (ex.response && ex.response.data && ex.response.data.errors) {
                message = ex.response.data.errors.error[0].code;
                if (_cjs[CONFIG].labels.error[message]) {
                    message = _cjs[CONFIG].labels.error[message];
                } else {
                    message = ex.response.data.errors.error[0].description;
                }
            } else if (ex.response && ex.response.data && ex.response.data.error && ex.response.data.error_description) {
                message = ex.response.data.error_description;
                if (_cjs[CONFIG].labels.error[ex.response.data.error]) {
                    message = _cjs[CONFIG].labels.error[ex.response.data.error];
                }
            } else if (ex.error && ex.error.errors) {
                message = ex.error.errors[0].message;
            } else if (ex.errors) {
                message = ex.errors[0].message;
            } else if (ex.message) {
                message = ex.message;
            }
        }
        return (message);
    }

    async extractErrorId(ex) {
        //const _cjs = this[_CHECKOUTJS];
        let message = {};
        if(ex) {
            if (ex && ex.response && ex.response.headers) {
                ['x_request_id','x-dr-requestid'].forEach(function(key){
                    if(ex.response.headers[key]) {
                        message[key] = ex.response.headers[key];
                    }
                });
            }
        }
        return (message);
    }

    async encryptPayload(text) {
        const _cjs = this[_CHECKOUTJS];
        const AESKey = _cjs[CONFIG].encryptionKey;
        const crypto = require('crypto');
        const payload = {
            original: text,
            message: text
        };
        let AESSetting = {
            'algorithm':'aes-128-cbc',
            'iv_type':'NO_IV',
            'iv':null
        };

        const stringPadding = function(str, blockSize, padder, format) {
            str = Global.Buffer.from(str,'utf8').toString(format);
            let bitLength = str.length*8;

            if(bitLength < blockSize) {
                for(let i=bitLength;i<blockSize;i+=8) {
                    str += padder;
                }
            } else if(bitLength > blockSize) {
                while((str.length*8)%blockSize !== 0) {
                    str+= padder;
                }
            }
            return Global.Buffer.from(str, format).toString('utf8');
        };

        if (AESKey && AESKey.length) {
            let iv=Global.Buffer.alloc(16);
            let key=Global.Buffer.alloc(16);

            if(AESSetting.iv_type === 'NO_IV'){
                iv = Global.Buffer.concat([Global.Buffer.from(AESKey )], iv.length);
                key = Global.Buffer.concat([Global.Buffer.from(AESKey)], key.length);
            }else if (AESSetting.iv_type === 'STATIC_IV'){
                iv = Global.Buffer.from(stringPadding(AESSetting.iv,128,0x0,"utf8"));
                key = Global.Buffer.concat([Global.Buffer.from(AESKey)], key.length);
            }else if(AESSetting.iv_type === 'DYNAMIC_IV'){
                iv = crypto.randomBytes(16);
                key = Global.Buffer.concat([Global.Buffer.from(AESKey)], key.length);
            }

            const cipher = crypto.createCipheriv(AESSetting.algorithm, key, iv);
            cipher.setAutoPadding(true);
            if (AESSetting.iv_type === 'STATIC_IV') {
                let count = Global.Buffer.byteLength(payload.original);
                let add = Global.Buffer.byteLength(iv) - (count % Global.Buffer.byteLength(iv));
                if (add > 0)
                    payload.original += ' '.repeat(add) + payload.original;
            }

            let encrypted = cipher.update(payload.original, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            payload.message = encrypted;
        }
        return (payload.message);
    }

    getAutoRenewSubscriptionCount(cartData) {
        if (cartData && cartData.cart.lineItems && cartData.cart.lineItems.lineItem) {
            return cartData.cart.lineItems.lineItem.reduce((count, lineItem) => {
                const attributes = lineItem.product.customAttributes.attribute.find((attribute) => {
                    return (
                        //(attribute.name === "subscriptionType") ||
                        (attribute.name === "isAutomatic" && attribute.value === "true")
                        //(attribute.name === "subscriptionSource")
                    );
                });
                if(attributes){
                    count += lineItem.quantity;
                }
                return count;
            },0);
        }
        return 0;
    }

    async useRecurringPayment(cartData) {
        const _cjs = this[_CHECKOUTJS];
        //const _shopper = _cjs[SHOPPER];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _config = _cjs[CONFIG];
        if(!cartData){
            cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        }

        let useRecurringPayment = false;
        if(_config.useRecurringPayment){
            useRecurringPayment = true;
        } else {
            if(_util.getAutoRenewSubscriptionCount(cartData)>0) {
                useRecurringPayment = true;
            }
        }
        return useRecurringPayment;
    }

    getSourcePaymentType(type){
        let _type = type;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];

        if(!_config[PAYMENTS][_type]) {
            let keys = Object.keys(_config[PAYMENTS]);
            for (let i = 0; i < keys.length; i++) {
                const payment = _config[PAYMENTS][keys[i]];
                if(payment && _type === payment.recurringName) {
                    _type = keys[i];
                    break;
                }
            }
        }
        return _type;
    }

    isGCPage(cfg) {
        const _cjs = this[_CHECKOUTJS];
        if(cfg && cfg.page){
            return cfg.page && cfg.page.length !== 0;
        }else {
            return _cjs[CONFIG].page && _cjs[CONFIG].page.length !== 0;
        }
    }

    getUUID() {
        let d = Date.now();
        if (typeof performance !== UNDEFINED && typeof performance.now === 'function'){
            d += performance.now();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    base64Encode(text) {
        if(isBrowser){
            return Global.btoa(text);
        }else if(isNode) {
            //return Global.Buffer.from(text).toString('base64');
        }
    }

    base64Decode(text) {
        if(isBrowser){
            return Global.atob(text);
        }else if(isNode) {
            //return Global.Buffer.from(text, 'base64').toString();
        }
    }

    isIE() {
        const userAgent = window.navigator.userAgent;
        const msie = userAgent.indexOf('MSIE ');
        if (msie > 0) {
            return parseInt(userAgent.substring(msie + 5, userAgent.indexOf('.', msie)), 10);
        }

        const trident = userAgent.indexOf('Trident/');
        if (trident > 0) {
            const rv = userAgent.indexOf('rv:');
            return parseInt(userAgent.substring(rv + 3, userAgent.indexOf('.', rv)), 10);
        }

        const edge = userAgent.indexOf('Edge/');
        if (edge > 0) {
            return parseInt(userAgent.substring(edge + 5, userAgent.indexOf('.', edge)), 10);
        }
        return false;
    }

    hasSpecialsCharacters(value) {
        const _cjs = this[_CHECKOUTJS];
        const _this = this;
        const ranges =_cjs[CONFIG].specialsCharacters;
        if (!value || typeof value === UNDEFINED || ranges.length === 0)
            return false;
        if (Array.isArray(value)) {
            let _value = false;
            value.forEach(function(item){
                if(_this.hasSpecialsCharacters(item)){
                    _value = true;
                }
            });
            return _value;
        }else if(typeof value === 'object'){
            let _value = false;
            Object.getOwnPropertyNames(value).forEach(function (key) {
                if(_this.hasSpecialsCharacters(value[key])){
                    _value = true;
                }
            });
            return _value;
        }else {
            return (typeof value === 'string' && value.match(ranges.join('|')) !== null);
        }
    }
    
    isReadySubmitState(state){
        return ['chargeable','pending_funds','consumed'].includes(state);
    }

    isChargeable(state){
        return ['chargeable'].includes(state);
    }

    getTime() {
        return new Date().getTime();
    }
}

export function extend(out) {
    out = out || {};
    for (let i = 1; i < arguments.length; i++) {
        let obj = arguments[i];
        if (typeof obj === UNDEFINED)
            continue;
        if(typeof obj === 'object') {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const desc = Object.getOwnPropertyDescriptor(out, key);
                    if (!desc || desc.writable || desc.set) {
                        if (Array.isArray(obj[key])) {
                            if (!out[key]) out[key] = [];
                            out[key] = [...out[key], ...obj[key]];
                        } else if (typeof obj[key] === 'object') {
                            out[key] = extend(out[key], obj[key]);
                        } else if (typeof obj === 'string') {
                            out[key] = obj;
                        } else {
                            out[key] = obj[key];
                        }
                    } else {
                        extend(out[key], obj[key]);
                    }
                }
            }
        }else{
            return obj;
        }
    }
    return out;
}

export {
    Util,
    Global,
    isBrowser,
    isNode,
    isWebWorker,
};
