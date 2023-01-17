import {Base} from '../base';
import {ApplePayWeb} from './payments/applePay';
import {GooglePayWeb} from './payments/googlePay';
import {PayPalWeb} from './payments/payPal';
import {KlarnaCreditWeb} from './payments/klarnaCredit';
import {AlipayWeb} from './payments/alipay';
import {MstsWeb} from "./payments/msts";
import {CcavenueWeb} from "./payments/ccavenue";
import {DropinWeb} from './payments/dropin';
import {Payments} from '../payments/payment';
import {extend, Global} from '../util';
import {
    LOGGING,
    _CHECKOUTJS,
    DRJS,
    CONFIG,
    UTIL,
    SHOPPERAPI,
    PAYMENTS,
    CJS,
    UNDEFINED,
    PAYMENT,
    CARTDATA,
    REDIRECT_COMPLETED,
    SHOPPER,
    NICKNAME
} from '../keywords';
import {StorefrontPayment} from "./payment";
import {Compliance} from "./compliance";

/**
 * @class Storefront
 * @classdesc The Storefront class handles the storefront layout and logic.
 * @extends Base
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} collection
 * @returns {Promise<Storefront>}
 * @see GlobalCommerce
 * @category Browser
 */
class Storefront extends Base {

    constructor(parent, collection) {
        super(parent, extend({
            excludeMethods: {constructor: true},
            writableMethods: {
                validateInfo: true,
                afterOverlay: true,
                updateSourceData: true,
                liveInstrumentOverlay: true,
                createNewWindowRedirectOverlay: true,
                createIframeRedirectOverlay: true,
                createShopperPaymentOptionSelector: true,
                updateTC: true
            }
        }, collection));
        const _this = this;
        _this['elements'] = {};
        Object.defineProperty(_this, 'elements', {
            enumerable: true,
            configurable: false,
            writable: false,
        });
        return (async () => {
            await _this._verifySettings();
            await _this.initDigitalRiverJS();
            Object.defineProperties(parent, {
                "drjs": {
                    writable: true,
                    enumerable: true,
                    configurable: false
                }
            });
            return _this;
        })();
    }

    /**
     * Updates the DigitalRiver.js (CloudPay) Terms and Conditions acceptance to the cart, for one-click checkout.
     * @returns {Promise<CartDataObject>}
     * @example checkoutJS.storefront.updateTC();
     */
    async updateTC() {
        const _cjs = this[_CHECKOUTJS];
        const _shopperApi = _cjs[SHOPPERAPI];
        const cloudPayTermsAcceptanceInput = document.getElementsByName('cloudPayTermsAcceptance');
        let checked = false;
        if (cloudPayTermsAcceptanceInput && cloudPayTermsAcceptanceInput.length && cloudPayTermsAcceptanceInput[0].checked) {
            checked = true;
        }
        return _shopperApi.updateCart({
            cart: {
                termsOfSalesAcceptance: checked
            }
        });
    }

    /**
     * Loads and initializes the DigitalRiver.js library on the current page.
     * @protected
     * @returns {Promise<void>}
     * @example checkoutJS.storefront.initDigitalRiverJS();
     */
    async initDigitalRiverJS() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        if (!_cjs.drjs) {
            const apiKey = _config.apiKey;
            const drjsApiKey = _config.drjsApiKey ? _config.drjsApiKey : apiKey;
            if (drjsApiKey) {
                try {
                    const options = _util.extend({}, _config.lib.drjs.options, {locale: _config.locale.replace('_', '-').toLowerCase()});
                    _util.loadCss(_config.lib.drjs.css).then();
                    if (typeof Global.DigitalRiver === UNDEFINED && !_config.lib.drjs.disable) {
                        await _util.loadScript(_config.lib.drjs.url);
                    }
                    if (typeof Global.DigitalRiver !== UNDEFINED) {
                        _cjs.drjs = new Global.DigitalRiver(drjsApiKey, options);
                    }
                } catch (ex) {
                    return Promise.reject(ex);
                }
            }
        }
    }

    /**
     * Initializes the compliance element.
     * @returns {Promise<void>}
     * @example checkoutJS.gC.initCompliance();
     */
    async initCompliance() {
        const _this = this;
        const _cjs = _this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        let compliance = await _util.getCache('compliance');
        if(!compliance && _config.entity.code) {
            const _compliance = new Compliance(_cjs);
            await _compliance.init();
            Object.defineProperties(_this['elements'], {
                'compliance': {
                    value: _compliance,
                    writable: true,
                    enumerable: true,
                    configurable: false
                }
            });
        }
    }

    /**
     * Validates the payment source.
     * @param {PaymentSourceObject} source
     * @returns {Promise<Boolean>}
     * @example checkoutJS.storefront.validateSource(source);
     */
    async validateSource(source) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _payments = await _this.getPayments();
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        if(!source){
            const _payment = (await _util.getValue(PAYMENT) || {});
            if (_payment && _payment.result && _payment.result.source) {
                source = _payment.result.source;
            }
        }
        if (source && source.type && cartData && cartData.cart && cartData.cart.pricing) {
            const _paymentType = await _this._getBasePaymentType(source);
            const _name = await _util.getSourcePaymentType(_paymentType);
            const _configPayment = _config[PAYMENTS][_name];
            if (source.id && source.clientSecret) {
                const result = await _cjs[DRJS].retrieveSource(source.id, source.clientSecret);
                source = result.source;
                await _util.setValue(PAYMENT, {name: _name, result: result});
            }
            const useRecurringPayment = await _util.useRecurringPayment(cartData);
            const _payment = _payments[_name];
            let supportedRecurringPayments = true;
            let validatedInfo = true;
            if(_payment instanceof Base) {
                supportedRecurringPayments = await _payments[_name].supportedRecurringPayments();
                validatedInfo = await _payments[_name].validateInfo(cartData);
            }
            if(typeof cartData.cart.paymentSession.amountRemainingToBeContributed === UNDEFINED) {
                if (validatedInfo &&
                    _payment.isReadySubmitState(source.state) &&
                    (useRecurringPayment===false || (useRecurringPayment===true && supportedRecurringPayments===true) ) &&
                    ((_configPayment.amountsEstimated!==true && parseFloat(source.amount) === parseFloat(cartData.cart.pricing.orderTotal.value)) || _configPayment.amountsEstimated===true) &&
                    source.currency === cartData.cart.pricing.orderTotal.currency &&
                    !(_configPayment.singleSubscriptionForRecurring && useRecurringPayment && cartData.cart.totalItemsInCart>1)
                ) {
                    return source;
                }
            } else {
                if (validatedInfo &&
                    _payment.isReadySubmitState(source.state) &&
                    (useRecurringPayment===false || (useRecurringPayment===true && supportedRecurringPayments===true) ) &&
                    ((_configPayment.amountsEstimated!==true && cartData.cart.paymentSession.amountRemainingToBeContributed.value===0) || _configPayment.amountsEstimated===true) &&
                    source.currency === cartData.cart.pricing.orderTotal.currency &&
                    !(_configPayment.singleSubscriptionForRecurring && useRecurringPayment && cartData.cart.totalItemsInCart>1)
                ) {
                    return source;
                }
            }
        }
        return false;
    }

    /**
     * Event to trigger after the overlay is complete and about to be closed.
     * @abstract
     * @returns {Promise}
     */
    async afterOverlay() {
    }

    async redirectFlow(payment, source, redirectOverlay) {
        const _this = this;
        const _cjs = _this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        if (source && source.flow === 'redirect' && source.redirect && (['pending_redirect', 'pending_funds'].includes(source.state))) {
            redirectOverlay = redirectOverlay || _util.extend({}, _config.redirectOverlay, _config.payments[payment].redirectOverlay);
            if (redirectOverlay.type === 'open') {
                return _this._newWindowRedirectFlow(payment, source, redirectOverlay);
            } else {
                return _this._iframeRedirectFlow(payment, source, redirectOverlay);
            }
        }
        return (source);
    }

    async _iframeRedirectFlow(payment, source, redirectOverlay) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = payment;
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const overlay = await this.createIframeRedirectOverlay(payment, source, redirectOverlay);
        return new Promise(function (resolve) {
            let hasResolved = false;
            _cjs.emit(LOGGING, {
                id: _util.getTime(),
                api: CJS,
                method: 'redirectLocation',
                url: source.redirect.redirectUrl
            });

            const iframeResize = function () {
                const padding = redirectOverlay.iframePadding;
                const iframe = overlay.getElementsByTagName('iframe');
                if (iframe && iframe.length) {
                    iframe[0].setAttribute('height', Global.innerHeight - padding);
                }
            };
            Global.addEventListener('resize', iframeResize, false);
            iframeResize();

            const message = async function (e) {
                _cjs.emit(LOGGING, {
                    id: _util.getTime(),
                    api: CJS,
                    method: 'message',
                    url: e.data
                });
                if (e.data && e.data.sourceId && e.data.urlParams) {
                    if (e.data.urlParams.return === 'success') {
                        _cjs.emit(REDIRECT_COMPLETED);
                    } else {
                        _cjs.emit(REDIRECT_COMPLETED);
                    }
                }
            };
            Global.addEventListener('message', message, false);

            const complete = function () {
                if (!hasResolved) {
                    hasResolved = true;

                    _cjs.emit(LOGGING, {
                        id: _util.getTime(),
                        api: CJS,
                        method: REDIRECT_COMPLETED,
                        url: source.redirect.redirectUrl
                    });
                    if (overlay && overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }

                    Global.removeEventListener('message', message);
                    Global.removeEventListener('resize', iframeResize);

                    _cjs.removeListener(REDIRECT_COMPLETED, complete);
                    resolve();
                }
            };
            _cjs.on(REDIRECT_COMPLETED, complete);

            if (_config[PAYMENTS][_name].liveInstrument) {
                _this.liveInstrument(_name, overlay);
            }

            _this.afterOverlay(_name, overlay, source);
        });
    }

    async createIframeRedirectOverlay(payment, source, redirectOverlay) {
        const _cjs = this[_CHECKOUTJS];
        const _name = payment;
        redirectOverlay = redirectOverlay || _cjs[UTIL].extend({}, _cjs[CONFIG].redirectOverlay, _cjs[CONFIG][PAYMENTS][_name].redirectOverlay);

        const overlay = document.createElement('div');
        overlay.id = redirectOverlay.id;
        const container = document.createElement('div');
        container.className = "drjs_iframe";
        const style = document.createElement('style');
        style.innerHTML = redirectOverlay.inlineStyle;
        overlay.append(style);

        if (_cjs[CONFIG][PAYMENTS][_name].preventPopupClose !== true) {
            const close = document.createElement('a');
            close.className = "drjs_close";
            close.onclick = function () {
                _cjs.emit(REDIRECT_COMPLETED);
            };
            overlay.append(close);
        }

        const iframe = document.createElement('iframe');
        iframe.src = source.redirect.redirectUrl;
        container.append(iframe);
        _cjs.emit(LOGGING, {
            id: _cjs[UTIL].getTime(),
            api: CJS,
            method: 'redirectLocation',
            url: source.redirect.redirectUrl
        });

        overlay.append(container);
        document.body.append(overlay);

        return (overlay);
    }

    async _newWindowRedirectFlow(payment, source, redirectOverlay) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _name = payment;
        const _this = this;
        const overlay = await this.createNewWindowRedirectOverlay(payment, source, redirectOverlay);
        return new Promise(function (resolve) {
            let hasResolved = false;

            const newWindowRedirectButton = function () {
                _cjs.emit(LOGGING, {
                    id: _util.getTime(),
                    api: CJS,
                    method: 'redirectLocation',
                    url: source.redirect.redirectUrl
                });
                const opener = Global.open(source.redirect.redirectUrl);
                let timer;

                const checkOpener = () => {

                    if (!_util.isIE()) {
                        if ((!opener || opener.closed) && _config[PAYMENTS][_name].preventPopupClose !== true) {
                            _cjs[DRJS].retrieveSource(source.id, source.clientSecret).then((result) => {
                                if (result && result.source && _util.isChargeable(result.source.state)) {
                                    cancelAnimationFrame(timer);
                                    source = result.source;
                                    _cjs.emit(REDIRECT_COMPLETED, opener);
                                }
                            });
                        } else {
                            timer = requestAnimationFrame(checkOpener);
                        }
                    } else {
                        _cjs[DRJS].retrieveSource(source.id, source.clientSecret).then((result) => {
                            if (result && result.source && _util.isChargeable(result.source.state)) {
                                cancelAnimationFrame(timer);
                                source = result.source;
                                _cjs.emit(REDIRECT_COMPLETED, opener);
                            } else {
                                setTimeout(function () {
                                    timer = requestAnimationFrame(checkOpener);
                                }, _config.redirectOverlay.timeout);
                            }
                        }).catch(() => {
                            setTimeout(function () {
                                timer = requestAnimationFrame(checkOpener);
                            }, _config.redirectOverlay.timeout);
                        });
                    }
                };
                checkOpener();

                const message = async function (e) {
                    _cjs.emit(LOGGING, {
                        id: _util.getTime(),
                        api: CJS,
                        method: 'message',
                        url: e.data
                    });
                    if (e.data && e.data.sourceId && e.data.urlParams) {
                        if (e.data.urlParams.return === 'success') {
                            clearInterval(timer);
                            _cjs.emit(REDIRECT_COMPLETED, opener);
                        } else {
                            _cjs.emit(REDIRECT_COMPLETED, opener);
                        }
                        Global.removeEventListener('message', message);
                    }
                };
                Global.addEventListener('message', message, false);
            };
            _cjs.on('newWindowRedirectButton', newWindowRedirectButton);

            const complete = function (opener) {
                if (!hasResolved) {
                    hasResolved = true;

                    _cjs.emit(LOGGING, {
                        id: _util.getTime(),
                        api: CJS,
                        method: REDIRECT_COMPLETED,
                        responseBody: source
                    });

                    if (opener) {
                        opener.close();
                    }
                    if (overlay && overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }

                    _cjs.removeListener(REDIRECT_COMPLETED, complete);
                    _cjs.removeListener('newWindowRedirectButton', newWindowRedirectButton);
                    resolve();
                }
            };

            _cjs.on(REDIRECT_COMPLETED, complete);

            if (_config[PAYMENTS][_name].liveInstrument) {
                _this.liveInstrument(_name, overlay);
            }

            _this.afterOverlay(_name, overlay, source);
        });
    }

    async createNewWindowRedirectOverlay(payment, source, redirectOverlay) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _name = payment;
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        redirectOverlay = redirectOverlay || _util.extend({}, _config.redirectOverlay, _configPayment.redirectOverlay);

        const overlay = document.createElement('div');
        overlay.id = redirectOverlay.id;
        const container = document.createElement('div');
        container.className = "drjs_open";
        const style = document.createElement('style');
        style.innerHTML = redirectOverlay.inlineStyle;
        overlay.append(style);

        if (_configPayment.preventPopupClose !== true) {
            const close = document.createElement('a');
            close.className = "drjs_close";
            close.onclick = function () {
                _cjs.emit(REDIRECT_COMPLETED);
            };
            overlay.append(close);
        }

        const title = document.createElement('h4');
        const redirectNotice = _util.format(_config.labels.PMT_REDIRECT_NOTICE, {
            '0': `<span class='drjs_${_name}'>${_configPayment.name}</span>`
        });
        title.innerHTML = redirectNotice;
        container.append(title);

        const button = document.createElement('button');
        button.className = redirectOverlay.buttonClass;
        button.id = 'drjs_clickhere';
        button.appendChild(document.createTextNode(_config.labels.CLICKHERE));
        button.onclick = function () {
            if (_configPayment.oneTimeRedirect) {
                button.disabled = true;
            }
            _cjs.emit('newWindowRedirectButton',{
                payment:payment,
                source:source,
            });
        };
        container.append(button);

        overlay.append(container);
        document.body.append(overlay);
        _util.loadingOverlay(true);

        return (overlay);
    }

    /**
     * Triggers the pending funds redirect flow on the order complete or thank you page.
     * @returns {Promise<PaymentObject>}
     * @example checkoutJS.storefront.pendingFundsRedirectFlow();
     */
    async pendingFundsRedirectFlow(source) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _util = _cjs[UTIL];
        const _drjs = _cjs[DRJS];
        const _payment = await this.getSelectedPayment();
        if(!source) {
            source = await _this.getSelectedSource();
        }
        if (source && source.flow === 'redirect' && source.redirect) {
            let state = source.state;
            if(source.sessionId && source.upstreamId) {
                const order = await _shopperApi.getOrder(source.upstreamId);
                if(order && order.order.paymentSession) {
                    state = order.order.paymentSession.status;
                }
            }

            if(state === 'pending_funds') {
                source.state = state;
                let _type = _util.getSourcePaymentType(source.type);
                await this.redirectFlow(_type, source);
                let result = await _drjs.retrieveSource(source.id, source.clientSecret);
                await _util.setValue(PAYMENT, {name: _type, result: result});
                return result;
            }
        }
        return _payment;
    }

    /**
     * Triggers the pending funds receiver flow on the order complete or thank you page.
     * @returns {Promise<PaymentObject>}
     * @example checkoutJS.storefront.pendingFundsReceiver();
     */
    async pendingFundsReceiver(source) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _payment = await _this.getSelectedPayment();
        if(!source) {
            source = await _this.getSelectedSource();
        }
        if (source && source.flow === 'receiver') {
            let state = source.state;
            let order;
            if(source.sessionId && source.upstreamId) {
                order = await _shopperApi.getOrder(source.upstreamId);
                if(order && order.order.paymentSession) {
                    state = order.order.paymentSession.status;
                }
            }
            if(state === 'pending_funds') {
                const elementPlacement = document.getElementById(_cjs[CONFIG].elements.pendingFundsInstruction.elementId);
                if (elementPlacement) {
                    const template = await _this.getPendingFundsInstruction(order);
                    elementPlacement.innerHTML = template;
                }
            }
        }
        return _payment;
    }

    /**
     * Returns the instruction HTML from pending fund payments, which may be shown on order complete or thank you page.
     * @protected
     * @returns {Promise<string>}
     * @example checkoutJS.storefront.getPendingFundsInstruction();
     *
     */
    async getPendingFundsInstruction(order) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _payment = (await _util.getValue(PAYMENT) || {});
        if (_payment.result && _payment.result.source) {
            const _configPayment = _config[PAYMENTS][_payment.name];
            if(!order) {
                order = await _shopperApi.getOrder(_payment.result.source.upstreamId);
            }
            const payload = _util.extend({},_payment.result.source,order);
            let pendingFunds;
            if(_configPayment.template && _configPayment.template.pendingFunds) {
                pendingFunds = _configPayment.template.pendingFunds;
            }
            if(!pendingFunds) {
                try {
                    const _textAttributeName = 'PMS_' + _payment.name.toUpperCase() + '_INSTRUCTION'
                    const attr = await _shopperApi.getText(_textAttributeName);
                    if(attr.attribute){
                        pendingFunds = attr.attribute.value;
                    }
                    // eslint-disable-next-line no-empty
                }catch(ex){

                }
            }
            if(pendingFunds) {
                let text = _util.format(pendingFunds, payload);
                return _util.removeTag(text, _config.elements.pendingFundsInstruction.emptyValueSelector);
            }
            return JSON.stringify(_payment.result.source[_payment.name], _util.replaceErrors, 2);
        }
    }

    /**
     * Retrieves the selected payment.
     * @protected
     * @returns {Promise<PaymentObject>}
     * @example checkoutJS.storefront.getSelectedPayment();
     */
    async getSelectedPayment() {
        const _cjs = this[_CHECKOUTJS];
        //const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        let _payment = (await _util.getValue(PAYMENT) || {});
        return _payment;
    }

    async getSelectedSource() {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _drjs = _cjs[DRJS];
        const _payment = await this.getSelectedPayment();
        let _source = _payment.result ? _payment.result.source : {};
        if(_source.id && _source.clientSecret) {
            let result = await _drjs.retrieveSource(_source.id, _source.clientSecret);
            let _type = _util.getSourcePaymentType(result.source.type);
            await _util.setValue(PAYMENT, {name: _type, result: result});
            return result.source;
        }
    }

    /**
     * Retrieves the Payments object from the checkoutJS instance.
     * @protected
     * @returns {Promise<Payments>}
     * @example checkoutJS.storefront.getPayments();
     */
    async getPayments() {
        const _cjs = this[_CHECKOUTJS];
        return _cjs[PAYMENTS];
    }

    /**
     * Updates the payment request source before creating the source from DigitalRiver.js.
     * @param {PaymentRequestObject} sourceData
     * @returns {Promise<PaymentRequestObject>}
     * @example checkoutJS.gC.updateSourceData(source);
     */
    async updateSourceData(sourceData) {
        return sourceData;
    }

    async liveInstrument(payment, overlay) {
        return overlay;
    }

    async createShopperPaymentOptionSelector() {

    }

    async createPaymentOptionToShopper() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _shopper = _cjs[SHOPPER];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _util = _cjs[UTIL];
        const _payment = await _util.getValue(PAYMENT);
        const nickName = await _util.getValue(NICKNAME);
        if(_shopper.isAuthenticated && _payment && _payment.result && nickName) {

            let _paymentType = await _this._getBasePaymentType(_payment.result.source);
            if(_config[PAYMENTS][_paymentType].supportedRecurringPayments && _config[PAYMENTS][_paymentType].saveAsPaymentOption!==false && _util.isChargeable(_payment.result.source.state)){
                const sourceId = _payment.result.source.id;
                await _shopperApi.applySourceToShopper(sourceId,nickName);
                await _util.removeValue(NICKNAME);
                const result = await _shopperApi.getPaymentOptions();
                if(result && result.paymentOptions && result.paymentOptions.paymentOption){
                    return result.paymentOptions.paymentOption.find((item)=>item.sourceId === sourceId);
                }
                return result;
            }
        }
    }

    async _createPayments(parent) {
        const _cjs = parent;
        /**
         * All enabled payment instances e.g. creditCard, applePay, googlePay.
         * @name payments
         * @type Payments
         * @memberof CheckoutJS
         * @instance
         * @readonly
         * @see {@tutorial payment-support-list}
         */
        const _payments = _cjs[PAYMENTS] = await new Payments(parent);
        for (let payment in _cjs[CONFIG][PAYMENTS]) {
            if (_cjs[CONFIG][PAYMENTS].hasOwnProperty(payment) && !_cjs[CONFIG][PAYMENTS][payment].disable) {
                try {
                    switch (payment) {
                        case 'applePay':
                            _payments[payment] = new ApplePayWeb(_cjs);
                            break;
                        case 'googlePay':
                            _payments[payment] = new GooglePayWeb(_cjs);
                            break;
                        case 'payPal':
                            _payments[payment] = new PayPalWeb(_cjs);
                            break;
                        case 'dropin':
                            _payments[payment] = new DropinWeb(_cjs);
                            break;
                        case 'klarnaCredit':
                            _payments[payment] = new KlarnaCreditWeb(_cjs, {}, payment);
                            break;
                        case 'alipay':
                            _payments[payment] = new AlipayWeb(_cjs, {}, payment);
                            break;
                        case 'msts':
                            _payments[payment] = new MstsWeb(_cjs, {}, payment);
                            break;
                        case 'ccavenue':
                            _payments[payment] = new CcavenueWeb(_cjs, {}, payment);
                            break;
                        default:
                            _payments[payment] = new StorefrontPayment(_cjs, {}, payment);
                            break;
                    }
                    const prop = {};
                    prop[payment] = {
                        writable: true,
                        enumerable: _cjs[CONFIG][PAYMENTS][payment].enumerable !== false,
                        configurable: false
                    };
                    Object.defineProperties(_payments, prop);
                } catch (ex) {
                    await _cjs[UTIL].errorMessage(ex);
                }
            }
        }
    }

    async _initPayments() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _payments = _cjs[PAYMENTS];
        const _shopperApi = _cjs[SHOPPERAPI];
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        if (_cjs[DRJS]) {
            const initPaymentItems = [];
            for (let payment in _config[PAYMENTS]) {
                if (_cjs[PAYMENTS][payment] instanceof Base) {
                    initPaymentItems.push((async ()=> {
                        const _configPayment = _cjs[CONFIG][PAYMENTS][payment];
                        const supportedCurrency = await _payments[payment].supportedCurrency();
                        const supportedRecurringPayments = await _payments[payment].supportedRecurringPayments();
                        const supportedGeography = await _payments[payment].supportedGeography(cartData.cart.billingAddress.country);
                        const supportedSettings = await _payments[payment].supportedSettings();
                        if (_payments.hasOwnProperty(payment) && _payments[payment] && supportedCurrency && supportedRecurringPayments && supportedSettings && _configPayment.supported !== false) {
                            try {
                                if (_payments[payment].initPaymentBefore) {
                                    await _payments[payment].initPaymentBefore(payment);
                                }
                                await _payments[payment].initPayment(payment);
                                if (_payments[payment].initPaymentAfter) {
                                    await _payments[payment].initPaymentAfter(payment);
                                }
                            } catch (ex) {
                                await _util.errorMessage(ex);
                            }
                        } else {
                            _configPayment.show = false;
                        }
                        _configPayment.supported = supportedCurrency && supportedRecurringPayments && supportedGeography && supportedSettings;
                    })());
                }
            }
            await Promise.all(initPaymentItems);
        }
    }

    async _destroyPayments() {
        const _cjs = this[_CHECKOUTJS];
        for (let payment in _cjs[CONFIG][PAYMENTS]) {
            const _configPayment = _cjs[CONFIG][PAYMENTS][payment];
            if (_cjs[PAYMENTS].hasOwnProperty(payment) && _cjs[PAYMENTS][payment] && _cjs[PAYMENTS][payment].destroy) {
                try {
                    await _cjs[PAYMENTS][payment].destroy(payment);
                } catch (ex) {
                    await _cjs[UTIL].errorMessage(ex);
                }
            }
            _configPayment.show = false;
            _configPayment.supported = UNDEFINED;
        }
    }

    async _initPaymentMethod() {

    }

    async _verifySettings() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        if (_config.siteId.length === 0 ||
            _config.locale.length === 0 ||
            _config.currency.length === 0
        ) {
            const siteData = await _cjs[SHOPPERAPI].getSiteInfo();
            _config.siteId = siteData.site.id;
            _config.locale = siteData.site.defaultLocale;
            const localOption = siteData.site.localeOptions.localeOption.filter(function (localOption) {
                return localOption.locale === siteData.site.defaultLocale
            });
            if (localOption && localOption.length) {
                _config.currency = localOption[0].primaryCurrency;
            }
        }
    }

    async _getBasePaymentType(source) {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const createdType = await _util.getValue(`${PAYMENT}_CREATEDTYPE`) || false;
        if(createdType && createdType.id === source.id) return createdType.name;
        return source.type;
    }


}

export {Storefront};


