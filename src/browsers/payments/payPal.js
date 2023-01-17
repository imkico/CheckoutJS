import {StorefrontPayment} from "../payment";
import {extend, Global} from "../../util";
import {
    LOGGING,
    _CHECKOUTJS,
    DRJS,
    CONFIG,
    UTIL,
    SHOPPERAPI,
    PAYMENTS,
    REQUESTPAYLOAD,
    PAYMENT,
    CARTDATA,
} from "../../keywords";
import {$} from "../globalCommerce";
import {PayPalPaymentRequestPayload} from "../../payments/payPal";

const document = Global.document;
const name = 'payPal';

/**
 * @class PayPalWeb
 * @classdesc PayPal for web storefronts.
 * @extends StorefrontPayment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType='payPal'] - e.g. 'payPal'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {PayPalWeb}
 * @category PaymentMethods
 */
class PayPalWeb extends StorefrontPayment {

    constructor(parent, collection, _name, storefront) {
        super(parent, collection, _name?_name:name, storefront);
        /**
         * The PayPalPaymentRequestPayload created for PayPal.
         * @name requestPayload
         * @type PayPalPaymentRequestPayload
         * @memberof PayPalWeb
         * @instance
         */
        this[REQUESTPAYLOAD] = new PayPalPaymentRequestPayload(parent, {}, _name?_name:name, this);
    }

    async initPayment() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _util = _cjs[UTIL];
        const _name = _this._name;
        const _configPayment = _cjs[CONFIG].payments[_name];
        const payPalModuleName = "PAYPAL";
        let _paypal = await _util.getCache(_name);
        const paypalElement = document.getElementById(_configPayment.elementId);
        if (paypalElement) {
            if (!_this.loading && (!Global[payPalModuleName] || !Global[payPalModuleName].Button)) {
                _this.loading = true;
                await _util.loadScript(_config.lib.paypal.url);
            }
            if (_config.page === 'ProductDetailsPage') {
                await _shopperApi.addToCart();
            }
            if (Global.hasOwnProperty(payPalModuleName) && Global[payPalModuleName].Button && !_paypal && document.getElementById(_configPayment.elementId)) {
                const payPayBtn = document.getElementById(_configPayment.elementId);
                payPayBtn.innerHTML = '';
                payPayBtn.classList.add(_configPayment.classes.base);
                const options = extend({
                    env: (_config.drjsApiKey.split('_').length === 2 ? 'production' : 'sandbox'),
                    style: _configPayment.style,
                    // eslint-disable-next-line no-unused-vars
                    payment: async function (data, actions) {
                        _util.loadingOverlay();
                        await _this.click();
                        let cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
                        const paypalSourceData = await _this[REQUESTPAYLOAD].createObject(cartData);
                        return _cjs[DRJS].createSource(paypalSourceData).then(function (result) {
                            _util.setValue(PAYMENT, {name: _name, result: result});
                            if (result.error) {
                                _util.errorMessage(result.error)
                            } else {
                                return result.source[paypalSourceData.type].token;
                            }
                        });
                    },
                    // eslint-disable-next-line no-unused-vars
                    onAuthorize: async function (data, actions) {
                        const paypalSourceData = await _util.getValue(PAYMENT);
                        return _this.completeSourceId(paypalSourceData.result.source).then(function () {
                            return _this.routing();
                        }).catch(function (ex) {
                            _util.errorMessage(ex);
                            return false;
                        }).then(function (routed) {
                            if (!routed) {
                                _util.loadingOverlay(true);
                            }
                        });
                        /*
                        return actions.order.capture().then(function (details) {
                            return _this.applyPayPalDetail(details);
                        }).then(function (result) {
                            return _this.completeSourceId(result.source);
                        });
                         */
                    },
                    // eslint-disable-next-line no-unused-vars
                    onCancel: function (data) {
                        _util.loadingOverlay(true);
                        return _this.cancel();
                    },
                    onError: function (err) {
                        _util.loadingOverlay(true);
                        _util.errorMessage(err);
                    }
                }, _configPayment.button);
                _paypal = Global[payPalModuleName].Button.render(options, '#' + _configPayment.elementId);
                _cjs.emit(LOGGING, {
                    id: _util.getTime(),
                    api: DRJS,
                    method: 'createElement',
                    type: 'options',
                    payment: _name,
                    options: options,
                });
                await _util.setCache(_name, _paypal);
                paypalElement.setAttribute('data-payment', _name);
                _configPayment.show = true;
                return _paypal;
            }
        }else{
            _configPayment.show = true;
        }
    }

    /*
    async applyPayPalDetail(detail) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        if (detail) {
            const address = [];
            const payer = detail.payer;
            if (payer) {
                address.push({
                    "id": 'billingAddress',
                    "firstName": payer.name.given_name,
                    "lastName": payer.name.surname,
                    "line1": payer.address.address_line_1,
                    "line2": payer.address.address_line_2,
                    "phoneNumber": payer.phone.phone_number.national_number,
                    "city": payer.address.admin_area_2,
                    "countrySubdivision": payer.address.admin_area_1,
                    "postalCode": payer.address.postal_code,
                    "country": payer.address.country_code,
                    "emailAddress": payer.email_address
                });
            }
            const purchase_units = detail.purchase_units[0];
            if (purchase_units.shipping) {
                address.push({
                    "id": 'shippingAddress',
                    "name": purchase_units.shipping.name.full_name,
                    "line1": purchase_units.shipping.address.address_line_1,
                    "line2": purchase_units.shipping.address.address_line_2,
                    "phoneNumber": payer.phone.phone_number.national_number,
                    "city": purchase_units.shipping.address.admin_area_2,
                    "countrySubdivision": purchase_units.shipping.address.admin_area_1,
                    "postalCode": purchase_units.shipping.address.postal_code,
                    "country": purchase_units.shipping.address.country_code,
                    "emailAddress": payer.email_address
                });
            } else {
                address.push();
            }
            if (_config.isGCPage()) {
                _cjs.gC.applyAddress(address[0], address[1]);
            }
            await _shopperApi.applyAddressToCart(address[0], address[1]);
            let cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
            const validated = await _this.validateInfo(cartData);
            if(!validated){
                return false;
            }
            const payment = await _util.getValue(PAYMENT);
            if (payment) {
                await _shopperApi.applySourceToCart(payment.result.source.id);
                return (payment.result);
            }
        }
    }
    */

    async destroy() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _name = _this._name;
        const _configPayment = _cjs[CONFIG].payments[_name];
        const paypal = await _cjs[UTIL].getCache(_name);
        if (paypal) {
            if (Global.paypal && Global.paypal.Button && document.getElementById(_configPayment.elementId)) {
                document.getElementById(_configPayment.elementId).innerHTML = '';
            }
            await _util.removeCache(_name);
        }
        _configPayment.show = false;
        _configPayment.element = null;
    }
}

/**
 * @class PayPalGC
 * @classdesc PayPal for Global Commerce.
 * @extends PayPalWeb
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType='payPal'] - e.g. 'payPal'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {PayPalGC}
 * @category PaymentMethods
 */
class PayPalGC extends PayPalWeb {

    constructor(parent, collection, _name) {
        super(parent, collection, _name?_name:name, 'gC');
    }

    // async initPayment() {
    //     const _cjs = this[_CHECKOUTJS];
    //     return await _cjs[PAYMENTS][name].initPayment.call(this);
    // }

    /*
    async createPaymentInfo() {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _name = this._name;
        const _configPayment = _cjs[CONFIG].payments[_name];
        const $paymentMethodID = $("#PayPalExpressCheckout");
        if ($paymentMethodID && $paymentMethodID.length) {
            $paymentMethodID.attr('data-type', _name);
            let _payment = (await _util.getValue(PAYMENT) || {});
            if (Object.keys(_payment).length === 0) {
                _payment = _cjs[CONFIG].cloudPayPayload || {};
            }
            if (_payment && (_payment.type === _name || _payment.name === _name)) {
                let source = (_payment && _payment.result && _payment.result.source) ? _payment.result.source : _payment;
                if (source && source.id) {
                    if (source.clientSecret) {
                        const result = await _cjs[DRJS].retrieveSource(source.id, source.clientSecret);
                        await _util.setValue(PAYMENT, {name: _name, result: result});
                        source = result.source;
                        _cjs.emit(LOGGING, {
                            id: _util.getTime(),
                            api: DRJS,
                            method: 'retrieveSource',
                            options: result
                        });
                    }
                    if (source && _util.isReadySubmitState(source.state)) {
                        $paymentMethodID.attr('data-source-id', source.id);
                    }
                }
                $paymentMethodID.trigger('click');
            }
        }
        _configPayment.show = true;
    }
    */

    async completeSourceId(/*source*/) {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        if (_cjs[CONFIG][PAYMENTS][_name].showTC) {
            await _cjs.storefront.updateTC();
        }
        await _cjs.sync();
    }

    async routing() {
        const _cjs = this[_CHECKOUTJS];
        return _cjs.gC.routing(name);
    }
}

export {
    PayPalWeb,
    PayPalGC
}
