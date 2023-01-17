import {Payment, PaymentRequestPayload} from "../payments/payment";
import {extend, Global} from "../util";
import {
    LOGGING,
    _CHECKOUTJS,
    CONFIG,
    UTIL,
    DRJS,
    SHOPPERAPI,
    PAYMENTS,
    CJS,
    REQUESTPAYLOAD,
    PAYMENT,
    CARTDATA,
    ELEMENT,
    REQUISITIONID,
    DISPLAYPOSTCLOUDPAYREDIRECTPAGE,
    SUBMITTHENREDIRECT
} from "../keywords";

const document = Global.document;

const requireFieldUpdate = function(){
    const _this = this;
    return (async () => {
        await _this.destroy();
        await _this.initPayment();
        return _this;
    })();
}

/**
 * @class StorefrontPayment
 * @classdesc The StorefrontPayment class is the base class for all storefront payment methods, which implements generic and reusable functions. Override the functions in this class if customizations for the payment is needed.
 * @extends Payment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType=''] - e.g. 'creditCard'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {Promise<StorefrontPayment>}
 * @category PaymentBase
 */
class StorefrontPayment extends Payment {
    constructor(parent, collection, name = '', storefront = 'storefront') {
        super(parent, extend({
            excludeMethods: {constructor: true},
            writableMethods: {
                initPayment: true,
                applySourceId: true,
                createElements: true,
                completeSourceId: true,
                createPaymentInfo: true,
                completePaymentInfo: true,
                changePaymentMethod: true,
                createPaymentRequest: true,
                shippingAddressChange: true,
                shippingOptionChange: true,
                validateElements: true,
                validate: true,
                click: true,
                cancel: true,
                routing: true,
                getReturnUrl: true,
                getCancelUrl: true,
                getGeographiesErrorMsg: true,
                getCurrenciesErrorMsg: true,
                getAmountErrorMsg: true
            }
        }, collection), name);
        this[REQUESTPAYLOAD] = new PaymentRequestPayload(parent, {}, name, this);
        Object.defineProperty(this, REQUESTPAYLOAD, {
            enumerable: false,
            configurable: false,
            writable: true,
        });

        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        _this._storefront = _cjs[storefront];
        _this._storefront._initPaymentMethod.call(_this);
        Object.defineProperty(this, "_storefront", {
            enumerable: false,
            configurable: false,
            writable: false,
        });
    }

    async initPayment() {
        const _this = this;
        const _cjs = _this[_CHECKOUTJS];
        const _name = _this._name;
        await _this.createElements();
        _cjs[CONFIG][PAYMENTS][_name].show = true;
    }

    /**
     * Creates the payment elements on the current page, e.g. bank selector, credit card fields, etc.
     * @returns {Promise<void>}
     */
    async createElements() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _util = _cjs[UTIL];
        const _drjs = _cjs[DRJS];
        const _element = _this[ELEMENT];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];

        if(_configPayment.mountElement && !_configPayment.mountElement.disabled) {
            const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
            const _storefront = _this._storefront;
            const _payments = await _storefront.getPayments();
            const supportedGeography = await _payments[_name].supportedGeography(cartData.cart.billingAddress.country);
            if(supportedGeography) {
                const elementsObj = {};
                let elements = _configPayment.mountElement.elements;
                let keys = Object.keys(elements);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if(elements[key].disable!==true) {
                        const elementPlacement = document.getElementById(elements[key].id);
                        if (elementPlacement && elementPlacement!==null) {

                            const options = await _element.createOption(cartData);
                            if (options) {
                                const mountElement = _drjs.createElement(key, options);
                                mountElement.mount(elementPlacement);
                                mountElement.on('blur', _this.blur);
                                mountElement.on('focus', _this.focus);
                                mountElement.on('ready', _this.ready);
                                mountElement.on('change', _this.change);
                                mountElement.on('cancel', _this.cancel);
                                mountElement.on('click', _this.click);
                                elementsObj[key] = mountElement;

                                _cjs.emit(LOGGING, {
                                    id: _util.getTime(),
                                    api: DRJS,
                                    method: 'createElement',
                                    type: 'options',
                                    payment: key,
                                    options: options,
                                });

                            }
                        }
                    }
                }
                await _util.setCache(_name, elementsObj);
                Object.defineProperty(_configPayment, ELEMENT, {
                    value: elementsObj,
                    enumerable: true,
                    configurable: false,
                    writable: true,
                });
            }
            if (_configPayment.mountElement.required) {
                _configPayment.mountElement.required.forEach(function (key) {
                    _cjs.on(key + 'Updated', requireFieldUpdate, _this);
                });
            }
        }
    }

    /**
     * Creates and validates the source for the selected payment on the current page.
     * @param {Boolean} [applyToCart=true] - When this value is set to true, the source will be applied to the cart via Commerce API (Shopper API).
     * @returns {Promise<PaymentSourceObject>}
     */
    async applySourceId(applyToCart = true) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _drjs = _cjs[DRJS];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _name = this._name;
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        const _payment = await _util.getValue(PAYMENT) || {};
        const _storefront = this._storefront;
        let source = {}, result = {}, cartData;
        if (_payment && (_payment.name === _name || _configPayment.skipPaymentTypeCheck) && _payment.result && _payment.result.source && _payment.result.source.id && _payment.result.source.clientSecret) {
            const _source = await _storefront.validateSource(_payment.result.source);
            if(_source) {
                source = _source;
            }
        }
        if ((_configPayment.show && !_this.isReadySubmitState(source.state))) {
            cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
            let sourceData = await _this[REQUESTPAYLOAD].createObject(cartData);
            sourceData = await _storefront.updateSourceData(sourceData);
            try {
                let sourceArgs = [];
                if(_configPayment.mountElement && _configPayment.element) {
                    let _element = _configPayment.element;
                    if( !(_element.id && _element.key) ){
                        _element = Object.values(_element)[0];
                    }
                    sourceArgs.push(_element);
                }
                sourceArgs.push(sourceData);
                result = await _drjs.createSource.apply(_drjs,sourceArgs);
                await _util.setValue(PAYMENT, {name: _name, result: result});
                if (result.source) {
                    _cjs.emit(LOGGING, {
                        id: _util.getTime(),
                        api: DRJS,
                        method: 'createSource',
                        type: 'options',
                        payment: _name,
                        options: result,
                    });
                    source = result.source;
                    if (source) {
                        if (!_this.isReadySubmitState(source.state) && source.flow === 'redirect' && source.redirect) {
                            await _storefront.redirectFlow(_name, source);
                            _cjs.emit(LOGGING, {
                                id: _util.getTime(),
                                api: CJS,
                                method: 'redirectBack',
                                responseBody: source
                            });
                            try {
                                result = await _drjs.retrieveSource(source.id, source.clientSecret);
                                _cjs.emit(LOGGING, {
                                    id: _util.getTime(),
                                    api: DRJS,
                                    method: 'retrieveSource',
                                    options: result
                                });
                                await _util.setValue(PAYMENT, {name: _name, result: result});
                            } catch (ex) {
                                _cjs.emit(LOGGING, {
                                    id: _util.getTime(),
                                    api: CJS,
                                    method: 'error',
                                    responseBody: JSON.stringify(ex, _util.replaceErrors, 2)
                                });
                                return Promise.reject(ex);
                            }
                        }
                    }
                }
            } catch (ex) {
                _cjs.emit(LOGGING, {
                    id: _util.getTime(),
                    api: CJS,
                    method: 'error',
                    responseBody: JSON.stringify(ex, _util.replaceErrors, 2)
                });
                return Promise.reject(ex);
            }
            const validated = await _this.validateInfo(cartData);
            if(!validated){
                return false;
            }
        }

        if (result.error) {
            if (result.error.state === 'failed') {
                return Promise.reject(new Error(_config.labels.error.PAYMENT_AUTHORIZATION_FAILED));
            }
            return Promise.reject(result);
        } else if (result.source) {
            source = result.source;
        }
        if (applyToCart) {
            if (_this.isReadySubmitState(source.state)) {
                await _shopperApi.applySourceToCart(source.id);
            }
        }
        if (_configPayment.showTC) {
            await _storefront.updateTC();
        }
        await this.completeSourceId(source);
        return source;
    }

    /**
     * This event will be triggered when the element loses focus.
     * @abstract
     */
    async blur() {

    }

    /**
     * This event will be triggered when the element gains focus.
     * @abstract
     */
    async focus() {

    }

    /**
     * This event will be triggered when the element is loaded and ready to accept an update request.
     * @abstract
     */
    async ready() {

    }

    /**
     * This event will be triggered when the element's state changes.
     * @abstract
     */
    async change() {

    }

    /**
     * This event will be triggered when the element is clicked.
     * @abstract
     */
    async click() {

    }

    /**
     * This event will be triggered when the element is selected.
     */
    async select() {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        let _payment = {name: _name};
        const payment = await _cjs[UTIL].getValue(PAYMENT);
        if (payment && payment.name === _name) {
            _payment = payment;
        }
        await _cjs[UTIL].setValue(PAYMENT, _payment);
        return _payment;
    }

    /**
     * This event will be triggered when the payment sheet has been cancelled.
     * @abstract
     */
    async cancel() {

    }

    /**
     * Modifies the payment request payload before creating the source.
     * @param {PaymentRequestObject} payload
     * @returns {Promise<PaymentRequestObject>}
     * @abstract
     */
    async createPaymentRequest(payload) {
        return payload;
    }

    /**
     * Validates the payment elements.
     * @returns {Promise<Boolean>}
     */
    async validateElements() {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        let validated = true;
        if (_configPayment[ELEMENT]) {
            let _element = _configPayment[ELEMENT];
            if(_element.id && _element.key){
                _element = [_element];
            }
            let keys = Object.keys(_element);
            for(let i=0; i<keys.length; i++){
                const key = keys[i];
                if(_element[key].parentNode && _element[key].parentNode.classList) {
                    const _classList = _element[key].parentNode.classList;
                    if (!_classList.contains(_configPayment.classes.complete)) {
                        validated = false;
                        _classList.add(_configPayment.classes.invalid);
                    } else {
                        _classList.remove(_configPayment.classes.invalid);
                    }
                }
            }
        }
        return validated;
    }

    async destroy() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _name = this._name;
        const _configPayment = _config[PAYMENTS][_name];
        if(_configPayment.mountElement) {
            let _element = await _cjs[UTIL].getCache(_name);
            try {
                if (_element) {
                    if(_element.id && _element.key){
                        _element = [_element];
                    }else{
                        _element = Object.values(_element);
                    }
                    for (let i = 0; i < _element.length; i++) {
                        if(_element[i] && _element[i].destroy){
                            await _element[i].destroy();
                        }
                    }

                    await _cjs[UTIL].removeCache(_name);
                }
                // eslint-disable-next-line no-empty
            } catch (ex) {
                console.error(ex);
            }
            if(_configPayment.mountElement.required) {
                _configPayment.mountElement.required.forEach(function(key){
                    _cjs.removeListener(key+'Updated',requireFieldUpdate);
                });
            }
        }
        _configPayment.show = false;
        _configPayment[ELEMENT] = null;
    }

    /**
     * Returns the paymentCallBack URL by default from {@link module:Config} with '?return=success' parameters.
     * @see module:Config
     * @returns {Promise<string>}
     */
    async getReturnUrl() {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _configUrl = _config.url;
        const _configPayment = _config[PAYMENTS][_name];
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        const upstreamId = cartData.cart.id;
        let _url = _configUrl.paymentCallBack;
        if(!_url) {
            _url = document.location.href;
        }else if(!_url.startsWith('http')) {
            _url = [location.origin,'/',_url].join('');
        }
        let _href = new URL(document.location.href.split("#")[0]);
        let _urlParams = '?&return=success&nextUrl=';
        if(_configPayment.submitThenRedirect){
            _href.searchParams.set('Action',DISPLAYPOSTCLOUDPAYREDIRECTPAGE);
            _href.searchParams.set(REQUISITIONID,upstreamId);
            _href.searchParams.delete('id');
            _urlParams = '?&return=success&flow=' + SUBMITTHENREDIRECT + '&nextUrl=';
        }
        const _nextUrl = _href.href;
        const url = _url + _urlParams + encodeURIComponent(_nextUrl);
        return url;
    }

    /**
     * Returns the paymentCallBack URL by default from {@link module:Config} with '?return=cancel' parameters.
     * @see module:Config
     * @returns {Promise<string>}
     */
    async getCancelUrl() {
        const _cjs = this[_CHECKOUTJS];
        const _configUrl = _cjs[CONFIG].url;
        let _url = _configUrl.paymentCallBack;
        if(!_url) {
            _url = document.location.href;
        }else if(!_url.startsWith('http')) {
            _url = [location.origin,'/',_url].join('');
        }
        const url = _url + '?&return=cancel&nextUrl='+encodeURIComponent(document.location.href.split("#")[0]);
        return url;
    }
    
    /**
     * Return geographies error message when geographies are NOT valid
     * @returns {Promise<String>}
     */
    async getGeographiesErrorMsg() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _configLabels = _config.labels;
        let geographiesErrorMsg = _config.labels.error['apply-payment-failure'];
        return geographiesErrorMsg;
    }
    
    /**
     * Return currencies error message when currencies are NOT valid
     * @returns {Promise<String>}
     */
    async getCurrenciesErrorMsg() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _configLabels = _config.labels;
        let currenciesErrorMsg = _config.labels.error['apply-payment-failure'];
        return currenciesErrorMsg;
    }
    
    /**
     * Return cart amount error message when cart amount are NOT valid (less than minimum config or more than maximum config)
     * @returns {Promise<String>}
     */
    async getAmountErrorMsg() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _configLabels = _config.labels;
        let amountErrorMsg = _config.labels.error['apply-payment-failure'];
        return amountErrorMsg;
    }
    
}

export {
    StorefrontPayment,
    requireFieldUpdate,
};
