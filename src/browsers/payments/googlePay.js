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
    UNDEFINED,
    REQUESTPAYLOAD,
    FAIL_TO_APPLY_SOURCE,
    CARTDATA,
    PAYMENT
} from "../../keywords";
import {$} from "../globalCommerce";

const document = Global.document;
const name = 'googlePay';

/**
 * @class GooglePayWeb
 * @classdesc Google Pay for web storefronts.
 * @extends StorefrontPayment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType='googlePay'] - e.g. 'googlePay'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {GooglePayWeb}
 * @category PaymentMethods
 */
class GooglePayWeb extends StorefrontPayment {

    constructor(parent, collection, _name, storefront) {
        super(parent, collection, name, storefront);
    }

    async initPayment() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _configPayment = _cjs[CONFIG][PAYMENTS][name];
        const _drjs = _cjs[DRJS];
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();

        const googlePayElement = document.getElementById(_configPayment.elementId);
        let googlepay = await _util.getCache(name);
        if (googlePayElement != null) {
            const _googlePay = _this;
            let paymentRequestData = await _googlePay[REQUESTPAYLOAD].createObject(cartData);
            paymentRequestData.style = _configPayment.style;
            paymentRequestData.classes = _configPayment.classes;
            paymentRequestData.waitOnClick = true;
            paymentRequestData = await _googlePay.createPaymentRequest(paymentRequestData, 'initialized');

            const googlePaymentRequestData = _drjs.paymentRequest(paymentRequestData);
            googlepay = _drjs.createElement("googlepay", googlePaymentRequestData);
            _cjs.emit(LOGGING, {
                id: _util.getTime(),
                api: DRJS,
                method: 'createElement',
                type: 'options',
                payment: name,
                options: googlePaymentRequestData,
            });
            await _util.setCache(name, googlepay);

            if (googlepay && await googlepay.canMakePayment()) {
                googlepay.mount(_configPayment.elementId);

                googlepay.on('source', function (event) {
                    const log = {
                        id: _util.getTime(),
                        api: DRJS,
                        method: 'source',
                        type: 'event',
                        payment: name,
                        event: event,
                    };
                    _cjs.emit(LOGGING, log);
                    const applySourceId = _googlePay.applySourceId.bind(_googlePay);
                    const completeSourceId = _googlePay.completeSourceId.bind(_googlePay);
                    if (typeof applySourceId !== 'function') {
                        return;
                    }
                    applySourceId(event)
                        .then(function (source) {
                            if(source) {
                                event.complete('success');
                            }else{
                                event.complete('error');
                            }
                        }).then(async function () {
                        if (_configPayment.showTC) {
                            return await _cjs.storefront.updateTC();
                        }
                    }).then(async function () {
                        return completeSourceId.apply(_cjs, event);
                    }).then(function () {
                        console.log('routing');
                        return _googlePay.routing();
                    }).catch(function (ex) {
                        _util.errorMessage(ex);
                        event.complete('error');
                        return false;
                    }).then(function(routed){
                        if(!routed) {
                            _util.loadingOverlay(true);
                        }
                    });
                });

                googlepay.on('shippingaddresschange', function (event) {
                    const log = {
                        id: _util.getTime(),
                        api: DRJS,
                        method: 'shippingaddresschange',
                        type: 'event',
                        payment: name,
                        event: event,
                    };
                    _cjs.emit(LOGGING, log);
                    const shippingAddress = event.shippingAddress;
                    _shopperApi.convertPaymentRequestAddressToShopperApiAddress(shippingAddress, 'shippingAddress')
                        .then(function (shopperApiShippingAddress) {
                            if (_util.isGCPage()) {
                                _cjs.gC.applyShippingCountry(shopperApiShippingAddress.country);
                                _cjs.gC.applyAddress(shopperApiShippingAddress);
                            }
                            return _shopperApi.applyAddressToCart(null, shopperApiShippingAddress);
                        }).then(async function (response) {
                        let updateObject = await _googlePay.createPaymentRequest(await _googlePay[REQUESTPAYLOAD].updateObject(response), 'shippingaddresschange');
                        return _googlePay.shippingAddressChange(updateObject).then(function () {
                            log.update = updateObject;
                            _cjs.emit(LOGGING, log);
                            event.updateWith(updateObject);
                        });
                    }).catch(async function (ex) {
                        let updateObject = await _googlePay.createPaymentRequest(await _googlePay[REQUESTPAYLOAD].errorObject(ex), 'shippingaddresschange');
                        log.update = updateObject;
                        _cjs.emit(LOGGING, log);
                        event.updateWith(updateObject);
                    });
                });

                googlepay.on('shippingoptionchange', function (event) {
                    const log = {
                        id: _util.getTime(),
                        api: DRJS,
                        method: 'shippingoptionchange',
                        type: 'event',
                        payment: name,
                        event: event,
                    };
                    _cjs.emit(LOGGING, log);
                    const shippingOption = event.shippingOption;
                    const shippingOptionId = shippingOption.id;
                    _shopperApi.updateSelectedShippingMethodOnCart(shippingOptionId)
                        .then(async function (response) {
                            if (_util.isGCPage()) {
                                _cjs.gC.applyShippingOption(shippingOptionId);
                            }
                            const updateObject = await _googlePay.createPaymentRequest(await _googlePay[REQUESTPAYLOAD].updateObject(response), 'shippingoptionchange');
                            return _googlePay.shippingOptionChange(updateObject).then(function () {
                                log.update = updateObject;
                                _cjs.emit(LOGGING, log);
                                event.updateWith(updateObject);
                            });
                        }).catch(async function (ex) {
                        const updateObject = await _googlePay.createPaymentRequest(await _googlePay[REQUESTPAYLOAD].errorObject(ex), 'shippingoptionchange');
                        log.update = updateObject;
                        _cjs.emit(LOGGING, log);
                        event.updateWith(updateObject);
                    });
                });

                googlepay.on('click', (event) => {
                    const log = {
                        id: _util.getTime(),
                        api: DRJS,
                        method: 'click',
                        type: 'event',
                        payment: name,
                        event: event,
                    };
                    _cjs.emit(LOGGING, log);
                    _util.loadingOverlay();
                    return _googlePay.click().then(async function () {
                        if (_config.page === 'ProductDetailsPage') {
                            return _shopperApi.addToCart().then(async function (response) {
                                const updateObject = await _googlePay.createPaymentRequest(await _googlePay[REQUESTPAYLOAD].updateObject(response), 'click');
                                log.update = updateObject;
                                _cjs.emit(LOGGING, log);
                                event.updateWith(updateObject);
                            });
                        } else {
                            return _shopperApi.getCart().then(async function (response) {
                                const updateObject = await _googlePay.createPaymentRequest(await _googlePay[REQUESTPAYLOAD].updateObject(response), 'click');
                                log.update = updateObject;
                                _cjs.emit(LOGGING, log);
                                event.updateWith(updateObject);
                            });
                        }
                    }).catch(function (ex) {
                        _util.loadingOverlay(true);
                        _util.errorMessage(ex);
                    });
                });

                googlepay.on('cancel', function (event) {
                    const log = {
                        id: _util.getTime(),
                        api: DRJS,
                        method: 'cancel',
                        type: 'event',
                        payment: name,
                        event: event,
                    };
                    _cjs.emit(LOGGING, log);
                    _util.loadingOverlay(true);
                    return _googlePay.cancel();
                });
                googlePayElement.setAttribute('data-payment', name);
                googlePayElement.classList.add(_configPayment.classes.base);

                googlePayElement.setAttribute('tabindex', '0');
                googlePayElement.setAttribute('role', 'button');
                googlePayElement.onclick = (event)=>{
                    event.preventDefault();
                    googlepay.show();
                };
                googlePayElement.onkeydown = (event)=> {
                    if (event.key === " " || event.key === 'Enter' || event.key === 'Spacebar') {
                        event.preventDefault();
                        googlepay.show();
                    }
                };

                _configPayment.show = true;
                Object.defineProperty(_configPayment, 'element', {
                    value: googlepay,
                    enumerable: false,
                    configurable: false,
                    writable: true,
                });
                return (googlepay);
            } else {
                _configPayment.supported = false;
                if (googlePayElement && googlePayElement.remove) {
                    googlePayElement.remove();
                }
            }
        }
    }

    async applySourceId() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        let event = arguments[0];
        if (event) {
            let source = event.source;
            //let billingAddress = _cjs[SHOPPERAPI].convertPaymentRequestAddressToShopperApiAddress(event.billingAddress,'billingAddress');
            //let shippingAddress = _cjs[SHOPPERAPI].convertPaymentRequestAddressToShopperApiAddress(event.shippingAddress,'shippingAddress');
            //let contactInformation = event.contactInformation;
            _cjs.emit(LOGGING, {
                id: _util.getTime(),
                api: DRJS,
                method: 'createSource',
                type: 'options',
                payment: name,
                options: source,
            });
            if (source && source.id) {
                await _util.setValue(PAYMENT, {name: name, result: event});
                const address = await Promise.all([
                    _shopperApi.convertPaymentRequestAddressToShopperApiAddress(Object.assign(event.billingAddress, event.contactInformation), 'billingAddress'),
                    _shopperApi.convertPaymentRequestAddressToShopperApiAddress(event.shippingAddress, 'shippingAddress'),
                ]);
                await _shopperApi.applyAddressToCart(address[0], address[1]);
                const response = await _shopperApi.applySourceToCart(source.id);
                let cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
                const validated = await _this.validateInfo(cartData);
                if(!validated){
                    return false;
                }
                if (response && response.cart && typeof response.cart.paymentMethod !== UNDEFINED) {
                    return Promise.resolve([source, response]);
                } else {
                    return Promise.reject(FAIL_TO_APPLY_SOURCE);
                }
            } else if (event.error) {
                return Promise.reject(event.error);
            }
        }
        const paymentSource = await this.select();
        if (paymentSource && paymentSource.result && paymentSource.result.source) {
            return paymentSource.result.source;
        }
    }

    async shippingAddressChange(updateObject) {
        return (updateObject);
    }

    async shippingOptionChange(updateObject) {
        return (updateObject);
    }

    async destroy() {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _configPayment = _cjs[CONFIG].payments[name];
        const googlepay = await _util.getCache(name);
        if (googlepay && _configPayment.show) {
            await googlepay.destroy();
            await _util.removeCache(name);
        }
        _configPayment.show = false;
        _configPayment.element = null;
    }
}

/**
 * @class GooglePayGC
 * @classdesc Google Pay for Global Commerce storefronts.
 * @extends GooglePayWeb
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType='googlePay'] - e.g. 'googlePay'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {GooglePayGC}
 * @category PaymentMethods
 */
class GooglePayGC extends GooglePayWeb {

    constructor(parent, collection) {
        super(parent, collection, name, 'gC');
        return this;
    }

    async initPayment() {
        const _cjs = this[_CHECKOUTJS];
        const _configPayment = _cjs[CONFIG][PAYMENTS][name];
        const _promise = await _cjs[PAYMENTS][name].initPayment.call(this);
        // eslint-disable-next-line no-empty
        if (_configPayment.showTC === true) {

        }
        return _promise;
    }

    async applySourceId() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _name = this._name;
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const event = arguments[0];
        if (event) {
            const source = event.source;
            //const billingAddress = _cjs[SHOPPERAPI].convertPaymentRequestAddressToShopperApiAddress(event.billingAddress,'billingAddress');
            //const shippingAddress = _cjs[SHOPPERAPI].convertPaymentRequestAddressToShopperApiAddress(event.shippingAddress,'shippingAddress');
            //const contactInformation = event.contactInformation;
            _cjs.emit(LOGGING, {
                id: _util.getTime(),
                api: DRJS,
                method: 'createSource',
                type: 'options',
                payment: name,
                options: source,
            });
            if (source && source.id) {
                await _util.setValue(PAYMENT, {name: _name, result: event});
                const address = await Promise.all([
                    _shopperApi.convertPaymentRequestAddressToShopperApiAddress(Object.assign(event.billingAddress, event.contactInformation), 'billingAddress'),
                    _shopperApi.convertPaymentRequestAddressToShopperApiAddress(event.shippingAddress, 'shippingAddress')
                ]);
                _cjs.gC.applyAddress(address[0], address[1]);
                await _shopperApi.applyAddressToCart(address[0], address[1]);
                const response = await _shopperApi.applySourceToCart(source.id);
                let cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
                const validated = await _this.validateInfo(cartData);
                if(!validated){
                    return false;
                }
                await _cjs.sync();
                return Promise.resolve([source, response]);

            } else if (event.error) {
                return Promise.reject(event.error);
            }
        }
        const paymentSource = await this.select();
        if (paymentSource && paymentSource.result && paymentSource.result.source) {
            return paymentSource.result.source;
        }
    }

    async changePaymentMethod() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _configPayment = _cjs[CONFIG].payments[name];
        const _selector = _cjs[CONFIG].selector;
        const selectedPayment = await _cjs.gC.getSelectedCloudPayPayment();
        let $elementBtn = $("#" + _configPayment.elementId);
        let $elementVisible = $elementBtn;
        if ($elementBtn.data('parent') && $elementBtn.length) {
            if ($elementBtn.data('parent')[0] !== $elementBtn[0]) {
                $elementVisible = $elementBtn.data('parent').add($elementBtn);
            }
            $elementBtn = $elementBtn.data('parent');
        }
        if (selectedPayment === name) {
            if (!$("input[name='paymentMethodID'][data-type='" + name + "']").attr('data-source-id')) {
                if (_config.page === 'QuickBuyCartPage' && $("#" + _configPayment.elementId + "PlaceHolder").length === 0) {
                    $elementBtn.before("<span id='" + _configPayment.elementId + "PlaceHolder'></span>").insertBefore(_selector.checkoutBtn);
                } else if (_config.page === 'ThreePgCheckoutAddressPaymentInfoPage') {
                    $elementVisible.show();
                }
                await _cjs.gC.checkTC($(_selector.checkoutForm).find(_selector.cloudPayTCContainer));
                $(_selector.checkoutBtn).hide();
            } else {
                if (_config.page === 'ThreePgCheckoutAddressPaymentInfoPage') {
                    $(_selector.checkoutBtn).show();
                    $elementVisible.hide();
                }
            }
        } else {
            if (_config.page === 'QuickBuyCartPage') {
                const placeHolder$ = $("#" + _configPayment.elementId + "PlaceHolder");
                if (placeHolder$.length) {
                    placeHolder$.replaceWith($elementBtn);
                }
            } else if (_config.page === 'ThreePgCheckoutAddressPaymentInfoPage') {
                $elementVisible.hide();
            }
            await _cjs.gC.checkTC();
            $(_selector.checkoutBtn).show();
        }
    }

    async routing() {
        const _cjs = this[_CHECKOUTJS];
        return _cjs.gC.routing(name);
    }
}

export {
    GooglePayWeb,
    GooglePayGC
}
