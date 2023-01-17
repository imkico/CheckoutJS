import {extend, Global} from "../util";
import {
    LOGGING,
    DRJS,
    _CHECKOUTJS,
    CONFIG,
    UTIL,
    SHOPPERAPI,
    PAYMENTS,
    CJS,
    UNDEFINED,
    FAIL_TO_APPLY_SOURCE,
    PAYMENT,
    CARTDATA,
    REQUESTPAYLOAD,
    SHOPPER,
    NICKNAME
} from "../keywords";
import {Storefront} from './storefront';
import {Shopper} from '../shopper';
import {ApplePayGC} from './payments/applePay';
import {GooglePayGC} from './payments/googlePay';
import {CreditCardGC} from './payments/creditCard';
import {PayPalGC} from './payments/payPal';
import {KlarnaCreditWeb} from './payments/klarnaCredit';
import {AlipayWeb} from './payments/alipay';
import {MstsWeb} from "./payments/msts";
import {CcavenueWeb} from "./payments/ccavenue";
import {DropinGC} from './payments/dropin';
import {Payments} from '../payments/payment';
import {StorefrontPayment} from './payment';
import {OfflineRefund} from './offlinerefund';
import {Base} from "../base";


const document = Global.document;
const GCSTOREFRONT = 'gcStorefront';
let $ = typeof Global.$ !== UNDEFINED ? Global.$ : null;

/**
 * @class GlobalCommerce
 * @classdesc The GlobalCommerce class is the storefront module for Global Commerce (gC) hosted sites, including gC-specific payment methods.
 * @extends Storefront
 * @param {CheckoutJS} parent
 * @returns {Promise<GlobalCommerce>}
 * @category Browser
 */
class GlobalCommerce extends Storefront {

    constructor(parent, collection) {
        super(parent,extend( {
            excludeMethods: {constructor: true},
            writableMethods: {
                getBillingAddress: true,
                getShippingAddress: true,
                getAddressValues: true,
                getAddress: true,
                getCreditCard: true,
                getSelectedCloudPayPayment: true,
                createSourceToCloudPay: true,
                applyShippingCountry: true,
                applyShippingOption: true,
                applyAddress: true,
                submitCheckoutForm: true,
                initCart: true,
                initCheckout:true,
                initConfirmOrder:true,
                initThankYou:true,
                initOfflineRefund:true,
                checkTC: true
            }
        }, collection), false);
        let _this = this;
        return (async () => {
            _this = await _this;
            parent.gC = _this;
            if (!parent[CONFIG].lib.jQuery.disable) {
                const _jQuery = Global.jQuery;
                await parent.util.loadScript(parent[CONFIG].lib.jQuery.url).then(() => {
                    $ = Global.jQuery.noConflict();
                    parent.$ = $;
                    Global.jQuery = _jQuery;
                });
            }
            return _this;
        })();
    }

    /**
     * Retrieves the selected payment.
     * @returns {Promise<{name:type,result:drJsPayload}>}
     * @example checkoutJS.gC.getSelectedPayment()
     */
    async getSelectedPayment() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        let _payment = (await _util.getValue(PAYMENT) || {});
        if (Object.keys(_payment).length === 0) {
            _payment = _config.cloudPayPayload || {};
            if (_payment.type && _payment.details) {
                _payment = {name: _payment.type, result: {
                        source:{
                            type: _payment.type,
                            id: _payment.id,
                            clientSecret: _payment.details.clientSecret
                        }
                }};
            }
        }
        return _payment;
    }

    async getPayments() {
        const _cjs = this[_CHECKOUTJS];
        return _cjs.gC[PAYMENTS];
    }

    async liveInstrument(payment, overlay) {
        const _cjs = this[_CHECKOUTJS];

        const backToCart = document.createElement('a');
        backToCart.className = "drjs_backToCart";
        backToCart.appendChild(document.createTextNode(_cjs[CONFIG].labels.BACK_TO_CART));
        backToCart.onclick = async function () {
            _cjs.emit('backToCart');
        };
        overlay.append(backToCart);

        const close = overlay.getElementsByClassName('drjs_close');
        if (close && close.length) {
            overlay.removeChild(close[0]);
        }

        const cartPageLink = async function () {
            const link = await _cjs[SHOPPERAPI].getCartPageLink();
            Global.location.href = link;
        };

        _cjs.on('backToCart', cartPageLink);

        return (overlay);
    }

    /**
     * Validate the payment source
     * @returns {Promise<PaymentSourceObject|false>}
     * @example checkoutJS.gC.validateSource(source)
     */
    async validateSource(source) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        //const _gC = _cjs.gC;
        if(!source){
            const _payment = (await _util.getValue(PAYMENT) || {});
            if (_payment && _payment.result && _payment.result.source) {
                source = _payment.result.source;
            }
        }
        let _paymentType = await _this._getBasePaymentType(source);
        let _name = await _util.getSourcePaymentType(_paymentType);
        if (source && source.type === GCSTOREFRONT && _config[PAYMENTS][_name][GCSTOREFRONT] === false )
        {
            return false;
        }
        source = _cjs.storefront.validateSource.call(_this,source);
        return source;
    }

    async _createPayments(parent) {
        const _cjs = parent;
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        /**
         * All enabled payment instances for gC.
         * @name payments
         * @type Payments
         * @memberof GlobalCommerce
         * @override
         * @see Payments
         * @instance
         * @readonly
         * @example checkoutJS.gC.payments;
         */
        const _gcPayments = _cjs.gC[PAYMENTS] = await new Payments(parent);
        let _gcStorefront = true;
        if(_cjs[CONFIG].page && _cjs[CONFIG].page.indexOf('ConfirmOrderPage')!==-1) {
             _gcStorefront = false;
        }
        for (let payment in _config[PAYMENTS]) {
            let _configPayment = _config[PAYMENTS][payment];
            if (_config[PAYMENTS].hasOwnProperty(payment) && !_configPayment.disable) {
                if(_configPayment[GCSTOREFRONT]!==false) {
                    _configPayment[GCSTOREFRONT] = _gcStorefront;
                    _configPayment.liveInstrument = !_gcStorefront;
                    if(_gcStorefront === true && _configPayment.mountElement){
                        _configPayment.mountElement.disabled = true;
                    }
                }
                try {
                    switch (payment) {
                        case 'creditCard':
                            _gcPayments[payment] = new CreditCardGC(_cjs);
                            break;
                        case 'applePay':
                            _gcPayments[payment] = new ApplePayGC(_cjs);
                            break;
                        case 'googlePay':
                            _gcPayments[payment] = new GooglePayGC(_cjs);
                            break;
                        case 'payPal':
                            _gcPayments[payment] = new PayPalGC(_cjs);
                            break;
                        case 'payPalCredit':
                            _gcPayments[payment] = new PayPalGC(_cjs,{},'payPalCredit');
                            break;
                        case 'dropin':
                            _gcPayments[payment] = new DropinGC(_cjs);
                            break;
                        case 'klarnaCredit':
                            _gcPayments[payment] = new KlarnaCreditWeb(_cjs, {}, payment, 'gC');
                            break;
                        case 'alipay':
                            _gcPayments[payment] = new AlipayWeb(_cjs, {}, payment, 'gC');
                            break;
                        case 'msts':
                            _gcPayments[payment] = new MstsWeb(_cjs, {}, payment, 'gC');
                            break;
                        case 'ccavenue':
                            _gcPayments[payment] = new CcavenueWeb(_cjs, {}, payment, 'gC');
                            break;
                        default:
                            _gcPayments[payment] = new StorefrontPayment(_cjs, {}, payment, 'gC');
                            break;
                    }
                    const prop = {};
                    prop[payment] = {
                        writable: true,
                        enumerable: _configPayment.enumerable !== false,
                        configurable: false
                    };
                    Object.defineProperties(_cjs.gC[PAYMENTS], prop);
                } catch (ex) {
                    await _util.errorMessage(ex);
                }
            }
        }
    }

    async _initPayments() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _gC = _cjs.gC;
        const _gcPayments = _gC[PAYMENTS];
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        if (_cjs[DRJS]) {
            const enablePayments = [];
            const createPaymentItems = [];
            for (let payment in _config[PAYMENTS]) {
                if (_cjs[PAYMENTS][payment] instanceof Base) {
                    createPaymentItems.push((async ()=>{
                        const _configPayment = _cjs[CONFIG][PAYMENTS][payment];
                        const supportedCurrency = await _gcPayments[payment].supportedCurrency();
                        const supportedRecurringPayments = await _gcPayments[payment].supportedRecurringPayments();
                        const supportedGeography = await _gcPayments[payment].supportedGeography(cartData.cart.billingAddress.country);
                        const supportedSettings = await _gcPayments[payment].supportedSettings();
                        const supportedThresholdAmount = await _gcPayments[payment].supportedThresholdAmount(_config.currency);
                        if (_gcPayments.hasOwnProperty(payment) && _cjs[PAYMENTS][payment] && _gcPayments[payment] && supportedCurrency && supportedRecurringPayments && supportedSettings && supportedThresholdAmount && _configPayment.supported!==false && _configPayment.name) {
                            try {
                                if (_gcPayments[payment].createPaymentInfo) {
                                    await _gcPayments[payment].createPaymentInfo(payment);
                                }
                                enablePayments.push(payment);
                            } catch (ex) {
                                _util.errorMessage(ex);
                            }
                        } else {
                            _configPayment.show = false;
                        }
                        _configPayment.supported = supportedCurrency && supportedRecurringPayments && supportedGeography && supportedSettings && supportedThresholdAmount;
                    })());
                }
            }
            await Promise.all(createPaymentItems);
            const initPaymentItems = [];
            for (let index in enablePayments) {
                const payment = enablePayments[index];
                const _gCPayment = _gcPayments[payment];
                initPaymentItems.push((async ()=> {
                    try {
                        if (_gCPayment.initPaymentBefore) {
                            await _gCPayment.initPaymentBefore(payment);
                        }
                        if (_gCPayment.initPayment) {
                            await _gCPayment.initPayment(payment);
                        }
                        if (_gCPayment.initPaymentAfter) {
                            await _gCPayment.initPaymentAfter(payment);
                        }
                    } catch (ex) {
                        _util.errorMessage(ex);
                    }
                    if (_gCPayment.completePaymentInfo) {
                        await _gCPayment.completePaymentInfo(payment);
                    }
                })());
            }
            return Promise.all(initPaymentItems).then(()=>{
                _gC.initTC();
            });
        }
    }

    async _initPaymentMethod() {
        const _this = this;
        Object.getOwnPropertyNames(PaymentGC).forEach(function (key) {
            if (!_this[key]) {
                Object.defineProperty(_this, key, {
                    value: PaymentGC[key],
                    enumerable: false,
                    configurable: false,
                    writable: true,
                });
            }
        });
    }

    async _getBasePaymentType(source) {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        if(source) {
            if (source.type === GCSTOREFRONT) {
                if (source[GCSTOREFRONT]) {
                    return source[GCSTOREFRONT].type;
                } else if (source.details) {
                    return source.details.type;
                }
            }
            const createdType = await _util.getValue(`${PAYMENT}_CREATEDTYPE`) || false;
            if(createdType && createdType.id === source.id) return createdType.name;
            return source.type;
        }
    }

    /**
     * Submits the checkout form or updates the page information, which includes billing, shipping and payment information, via CommerceAPI then redirects to the confirm order page.
     * @param {PaymentSourceObject} source
     * @returns {Promise<void>}
     * @example checkoutJS.gC.submitCheckoutForm()
     */
    async submitCheckoutForm(/*source*/) {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _selector = _config.selector;
        const _shopperApi = _cjs[SHOPPERAPI];
        _cjs.emit(LOGGING, {
            id: _util.getTime(),
            api: CJS,
            method: 'submitCheckoutForm'
        });
        if (!_config.submitCartWithShopperApi) {
            $(_selector.checkoutForm)[0].submit();
        } else {
            const billingAddress = await _cjs.gC.getBillingAddress();
            const shippingAddress = await _cjs.gC.getShippingAddress();
            const address = await Promise.all([
                _shopperApi.convertPaymentRequestAddressToShopperApiAddress(
                    billingAddress, 'billingAddress'
                ), _shopperApi.convertPaymentRequestAddressToShopperApiAddress(
                    shippingAddress, 'shippingAddress'
                )]);

            // eslint-disable-next-line no-unused-vars
            const addressResponse = await _shopperApi.applyAddressToCart(address[0], address[1]);

            const sourceId = $(_selector.cloudPaySourceId).val();
            if (sourceId) {
                await _shopperApi.applySourceToCart(sourceId);
            }
            const link = await _shopperApi.getConfirmOrderPageLink();
            Global.location.href = link;
        }
    }

    /**
     * Creates the payment source from DigitalRiver.js then apply the source ID to the CloudPay payment method's hidden field.
     * @param {string} name - The payment name.
     * @param {PaymentRequestObject} sourceData
     * @returns {Promise<PaymentSourceObject>}
     * @deprecated
     * @example checkoutJS.gC.createSourceToCloudPay('creditCard',paymentRequest);
     */
    async createSourceToCloudPay(name, sourceData) {
        const _cjs = this[_CHECKOUTJS];
        const result = await _cjs[DRJS].createSource(sourceData);
        await _cjs[UTIL].setValue(PAYMENT, {name: name, result: result});
        if (result.error) {
            if (result.error.state === 'failed') {
                return Promise.reject(new Error(_cjs[CONFIG].labels.error.PAYMENT_AUTHORIZATION_FAILED));
            }
            return Promise.reject(result);
        } else if (result.source) {
            await this.applySourceToCloudPay(result.source);
        }
        return (result.source);
    }

    /**
     * Tries to re-create a new source from the existing CartData.
     * @param {PaymentSourceObject} source
     * @returns {Promise<PaymentSourceObject>}
     * @example checkoutJS.gC.retryCreateSource(source);
     */
    async retryCreateSource(source){
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _drjs = _cjs[DRJS];
        const _name = _util.getSourcePaymentType(source.type);
        const _payments = await _this.getPayments();
        const _payment = _payments[_name];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        const sourceData = await _payment[REQUESTPAYLOAD].createObject(cartData);
        _util.extend(source,sourceData);
        let sourceArgs = [];
        if(_configPayment.mountElement && _configPayment.element) {
            let _element = _configPayment.element;
            if( !(_element.id && _element.key) ){
                _element = Object.values(_element)[0];
            }
            sourceArgs.push(_element);
        }
        sourceArgs.push(source);
        const result = await _drjs.createSource.apply(_drjs,sourceArgs);
        if (result.source) {
            _cjs.emit(LOGGING, {
                id: _util.getTime(),
                api: DRJS,
                method: 'retryCreateSource',
                type: 'options',
                payment: _name,
                options: result,
            });
            source = result.source;
            if (source) {
                if (_payment.isReadySubmitState(source.state)) {
                    await _util.setValue(PAYMENT, {name: _name, result: result});
                    return source;
                }
            }
        }
    }

    /**
     * Applies the source ID to the CloudPay payment method's hidden field.
     * @param {PaymentSourceObject} source
     * @returns {Promise<PaymentSourceObject>}
     * @example checkoutJS.gC.applySourceToCloudPay(source);
     */
    async applySourceToCloudPay(source) {
        if (source && source.id) {
            const _cjs = this[_CHECKOUTJS];
            const source_id = source.id;
            $(_cjs[CONFIG].selector.cloudPaySourceId).val(source_id);
            return source;
        }
        return Promise.reject();
    }

    /**
     * Updates the payment request source before creating the source from DigitalRiver.js and wraps it with a gcStorefront payment method as a placeholder for CloudPay.
     * @param {PaymentRequestObject} sourceData
     * @returns {Promise<PaymentRequestObject>}
     * @example checkoutJS.gC.updateSourceData(source);
     */
    async updateSourceData(sourceData) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        let _type = _util.getSourcePaymentType(sourceData.type);
        if(_config[PAYMENTS][_type][GCSTOREFRONT]) {
            sourceData = {
                type: GCSTOREFRONT,
                currency: sourceData.currency || _config.currency,
                amount: sourceData.amount || 1,
                owner: sourceData.owner,
                gcStorefront: sourceData
            }
        }
        return sourceData;
    }

    /**
     * Retrieves the billing address data and returns it as a payment service owner data object.
     * @returns {Promise<{PaymentService.OwnerDataObject}>}
     * @example checkoutJS.gC.getBillingAddress();
     */
    async getBillingAddress() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _selectorAddress = _config.selector.address;
        if ($(_selectorAddress.billingContainer).is(':visible')) {
            return _this.getAddressValues();
        }
    }

    /**
     * Retrieves the shipping address data and returns it as payment service owner data
     * @returns {Promise<{PaymentService.OwnerDataObject}>}
     * @example checkoutJS.gC.getShippingAddress();
     */
    async getShippingAddress() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _selectorAddress = _config.selector.address;
        if (!$(_selectorAddress.shippingDifferentThanBilling).is(":checked") || !$(_selectorAddress.shippingContainer).is(':visible'))
            return;
        return _this.getAddressValues('shippingToGc');
    }

    /**
     * Retrieves the billing or shipping address data and returns it as a payment service owner data object.
     * @param {string} [type='billingToGc']
     * @returns {Promise<{PaymentService.OwnerDataObject}>}
     * @example checkoutJS.gC.getAddressValues();
     */
    async getAddressValues(type='billingToGc') {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _selectorAddress = _config.selector.address[type];
        const address = {
            firstName: $(_selectorAddress.firstName).val(),
            lastName: $(_selectorAddress.lastName).val(),
            phone: $(_selectorAddress.phoneNumber).val(),
            email: $(_selectorAddress.emailAddress).val(),
            organization: $(_selectorAddress.companyName).val(),
            address: {
                line1: $(_selectorAddress.line1).val(),
                line2: $(_selectorAddress.line2).val(),
                city: $(_selectorAddress.city).val(),
                state: $(_selectorAddress.countrySubdivision).val(),
                postalCode: $(_selectorAddress.postalCode).val(),
                country: $(_selectorAddress.country).val()
            },
            additionalAddressInfo: {
                division: $(_selectorAddress.division).val(),
                phoneticFirstName: $(_selectorAddress.phoneticFirstName).val(),
                phoneticLastName: $(_selectorAddress.phoneticLastName).val()
            }
        };

        return address;
    }

    /**
     * Retrieves the shoppers billing address first and then the shipping address, if the billing address is not present.
     * @returns {Promise<{PaymentService.OwnerDataObject}>}
     * @example checkoutJS.gC.getAddress();
     */
    async getAddress() {
        const _this = this;
        let address = await _this.getBillingAddress();
        if (!address) {
            return await _this.getShippingAddress();
        }
    }

    /**
     * Retrieves the selected DigitalRiver.js payment method type.
     * @returns {Promise<{string}>}
     * @example checkoutJS.gC.getAddress();
     */
    async getSelectedCloudPayPayment() {
        const $paymentMethod = $("input[name='paymentMethodID'][data-type]:checked");
        if ($paymentMethod && $paymentMethod.length && !$paymentMethod.attr('data-disabled')) {
            return ($paymentMethod.attr('data-type'));
        }
    }

    /**
     * Applies billing and shipping address to existing checkout form fields.
     * @param {ShopperApi.AddressObject} billingAddress
     * @param {ShopperApi.AddressObject} shippingAddress
     * @returns {Promise<void>}
     * @example checkoutJS.gC.applyAddress(billingAddress, billingAddress);
     */
    async applyAddress(billingAddress, shippingAddress) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _selectorAddress = _config.selector.address;
        if (_config.page.length) {
            if (shippingAddress) {
                let addressNames = null;
                if ($(_selectorAddress.shippingContainer).is(':visible')) {
                    addressNames = _selectorAddress.shippingToGc;
                } else if ($(_selectorAddress.billingContainer).is(':visible')) {
                    addressNames = _selectorAddress.billingToGc;
                }
                if (addressNames) {
                    for (let key in shippingAddress) {
                        if (addressNames.hasOwnProperty(key) && shippingAddress.hasOwnProperty(key)) {
                            $(addressNames[key]).val(shippingAddress[key]);
                        }
                    }
                }
            }
            if (billingAddress) {
                let addressNames = null;
                if ($(_selectorAddress.billingContainer).is(':visible')) {
                    addressNames = _selectorAddress.billingToGc;
                }
                if (addressNames) {
                    for (let key in billingAddress) {
                        if (addressNames.hasOwnProperty(key) && billingAddress.hasOwnProperty(key)) {
                            $(addressNames[key]).val(billingAddress[key]);
                        }
                    }
                }
            }
        }
    }

    /**
     * Changes the shipping estimator's country value.
     * @param {string} shippingCountry
     * @returns {Promise<jQueryObject>}
     * @example checkoutJS.gC.applyShippingCountry('GB');
     */
    async applyShippingCountry(shippingCountry) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _selectorShippingEstimator = _config.selector.shippingEstimator;
        if (_config.page.length) {
            if ($(_selectorShippingEstimator.container).is(':visible')) {
                const $shippingCountry = $(_selectorShippingEstimator.container).find(_selectorShippingEstimator.shipCountry);
                if ($shippingCountry && $shippingCountry.length) {
                    $shippingCountry.val(shippingCountry);
                    return ($shippingCountry);
                }
            }
        }
    }

    /**
     * Changes the shipping estimator's shipping option value.
     * @param {string} shippingOptionId
     * @returns {Promise<jQueryObject>}
     * @example checkoutJS.gC.applyShippingOption('1111111');
     */
    async applyShippingOption(shippingOptionId) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _selectorShippingEstimator = _config.selector.shippingEstimator;
        if (_config.page.length) {
            if ($(_selectorShippingEstimator.container).is(':visible')) {
                const $shippingOptionID = $(_selectorShippingEstimator.container).find(_selectorShippingEstimator.shippingOptionID);
                if ($shippingOptionID && $shippingOptionID.length) {
                    let _changeEstimatedShipping = Global.changeEstimatedShipping;
                    if (_changeEstimatedShipping) {
                        Global.changeEstimatedShipping = function (zoneList, optionID, shippingForm) {
                            if (zoneList.selectedIndex !== 0) {
                                shippingForm.shippingOptionID.value = optionID;
                                shippingForm.country.value = zoneList.options[zoneList.selectedIndex].value;
                            }
                        };
                    }
                    if ($shippingOptionID.length === 1) {
                        $shippingOptionID.val(shippingOptionId);
                    } else {
                        const $selectShippingOptionID = $shippingOptionID.filter(function () {
                            return ($(this).val() === shippingOptionId);
                        }).trigger('click');
                        if (!$selectShippingOptionID.length) {
                            $shippingOptionID.first().trigger('change');
                        }
                    }
                    if (_changeEstimatedShipping) {
                        Global.changeEstimatedShipping = _changeEstimatedShipping;
                    }
                    return $shippingOptionID;
                }
            }
        }
    }

    /**
     * After loading GlobalCommerce, this function will trigger the specific functions for each page e.g. {@link initCheckout}, {@link initConfirmOrder}, {@link initThankYou}.
     * @returns {Promise<void>}
     * @example checkoutJS.gC.initPageLoad();
     */
    async initPageLoad() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];

        await _this.initCheckout();

        if (_config.page.indexOf('ConfirmOrderPage')>0) {
            await _this.initConfirmOrder();
        }

        if (_config.page === 'ThankYouPage') {
            await _this.initThankYou();
        }

        if (_config.page === 'DelayedPaymentRefundPage' || _config.page === 'DisplayDelayedPaymentRefundPage') {
            const url = _cjs[UTIL].parseURL(Global.location.href);
            const refundToken = url.queryParams['informationToken'];
            _cjs.on('initializeElements',async function() {
                await _this.initOfflineRefund(refundToken);
            });
        }

        await _util.removeValue(CARTDATA);
    }

    /**
     * After loading GlobalCommerce, this function will be triggered to see if the gC checkout form exists on the page.
     * @returns {Promise<void>}
     * @example checkoutJS.gC.initCheckout();
     */
    async initCheckout() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _shopperApi = _cjs[SHOPPERAPI];
        //const _shopper = _cjs[SHOPPER];
        const _selector = _config.selector;
        const _gC = _cjs.gC;
        const $form = $(_selector.checkoutForm);
        if ($form && $form.length) {
            if ($form.find(_selector.cloudPaySourceId).length === 0) {
                $form.prepend("<input type='hidden' name='cloudPaySourceID' />");
            }
            $form.find(_selector.cloudPayPayment).hide();
            if (_config.cloudPayPayload.id) {
                $form.find(_selector.cloudPaySourceId).val(_config.cloudPayPayload.id);
            }
            let payment = await _util.getValue(PAYMENT);
            if(!payment && _config.cloudPayPayload.id){
                const result = await _cjs[DRJS].retrieveSource(_config.cloudPayPayload.id, _config.cloudPayPayload.details.clientSecret);
                let _paymentType = await _this._getBasePaymentType(result.source);
                await _util.setValue(PAYMENT, {name: _paymentType, result: result});
            }
            $form.submit(function (e) {
                if ((!$form.valid || $form.valid()) && (typeof (Global._doneWithRTAV) === UNDEFINED || Global._doneWithRTAV)) {
                    e.preventDefault();
                    e.stopPropagation();
                    return (async () => {
                        const selectedPayment = await _gC.getSelectedCloudPayPayment();
                        if (selectedPayment) {
                            _util.loadingOverlay();
                            try {
                                await _gC.syncShopperInfo();
                                const cloudPayPaymentMethodID = $('#CloudPay').val();
                                const $paymentMethod = $("input[name='paymentMethodID']:checked");
                                let applySource = null;
                                if ($paymentMethod && $paymentMethod.length) {
                                    $paymentMethod.val(cloudPayPaymentMethodID);
                                    const sourceId = $paymentMethod.attr('data-source-id');
                                    if (sourceId && sourceId.length > 0) {
                                        const source = await _gC.validateSource();
                                        if(source) {
                                            applySource = Promise.resolve(source);
                                        }
                                    }
                                }
                                if (applySource == null) {
                                    const validateElements = await _gC.validateElements();
                                    const _payment = _gC[PAYMENTS][selectedPayment];
                                    const validatePaymentElements = await _payment.validateElements();
                                    if(!validateElements || !validatePaymentElements) {
                                        _util.loadingOverlay(true);
                                        return;
                                    }
                                    if(_config.cart.updateCartInfoByApi === true){
                                        const _cart = { cart:{} };
                                        let billingAddress = await _gC.getBillingAddress();
                                        let shippingAddress = await _gC.getShippingAddress();
                                        if(!shippingAddress && billingAddress) {
                                            shippingAddress = billingAddress;
                                        }
                                        if(!billingAddress && shippingAddress) {
                                            billingAddress = shippingAddress;
                                        }
                                        if(billingAddress && shippingAddress) {
                                            _cart.cart.billingAddress = await _shopperApi.convertPaymentRequestAddressToShopperApiAddress(billingAddress, 'billingAddress');
                                            _cart.cart.shippingAddress = await _shopperApi.convertPaymentRequestAddressToShopperApiAddress(shippingAddress, 'shippingAddress');
                                            await _shopperApi.updateCart(_cart);
                                        }
                                    }
                                    applySource = _payment.applySourceId(false);
                                }
                                applySource.then(_gC.applySourceToCloudPay.bind(_this))
                                    .then((source)=>{
                                        if(source && !source.gcStorefront) {
                                            return _gC.createPaymentOptionToShopper().then((paymentOption) => {
                                                if (paymentOption && paymentOption.id) {
                                                    $(_config.selector.payment.billingOptionSelector).append('<option value="' + paymentOption.id + '" selected>' + paymentOption.nickName + "</option>");
                                                }
                                                return source;
                                            });
                                        }
                                        return source;
                                    })
                                    .then(_gC.submitCheckoutForm.bind(_this)).catch(function (ex) {
                                        _util.setValue(PAYMENT, {name: selectedPayment});
                                        if (ex) {
                                            _util.errorMessage(ex);
                                        }
                                        _util.loadingOverlay(true);
                                    });
                            } catch (ex) {
                                if (ex) {
                                    _util.errorMessage(ex);
                                }
                                _util.loadingOverlay(true);
                            }
                        } else if (!selectedPayment && $("input[name='paymentMethodID'][id='CloudPay']").is(':checked')) {
                          $("input[name='paymentMethodID']").removeAttr('checked');
                          _util.loadingOverlay(true);
                          $form[0].submit();
                        } else {
                            if($("input[name='paymentMethodID']:checked").length || $("input[name='paymentMethodID']").length===0) {
                                _util.loadingOverlay(true);
                                $form[0].submit();
                            }
                        }
                    })();
                }
            });
            $(document).on("change", "input[name='paymentMethodID']", async function () {
                let prevPayment = await _util.getValue(PAYMENT);
                if (prevPayment && prevPayment.name) {
                    let _name = prevPayment.name;
                    if(_gC[PAYMENTS][_name]) {
                        await _gC[PAYMENTS][_name].changePaymentMethod();
                    }
                }
                const payment = $(this).attr('data-type');
                if (_config[PAYMENTS].hasOwnProperty(payment) && !_config[PAYMENTS][payment].disable && _gC[PAYMENTS][payment] && _gC[PAYMENTS][payment].changePaymentMethod) {
                    let $paymentSection = await _util.getCache(payment + 'Section');
                    if($paymentSection && !$paymentSection.find('.dr_ExpandPaymentDetailsSection:visible').length){
                        $($paymentSection).find('.dr_expandDetails a').trigger('click');
                    }
                    _gC[PAYMENTS][payment].select();
                    await _gC[PAYMENTS][payment].changePaymentMethod();
                    if(_config[PAYMENTS][payment].supportedRecurringPayments && _config[PAYMENTS][payment].saveAsPaymentOption!==false) {
                        $('#dr_billingOption').show();
                    } else {
                        $('#dr_billingOption').hide();
                    }
                }
            });
            $(document).on("click", ".dr_paymentMethodBlock .dr_expandDetails a", function (e) {
                e.preventDefault();
                $(this).closest('.dr_paymentMethodBlock').find('.dr_ExpandPaymentDetailsSection').toggle();
                return false;
            });
            $(document).on("change",[_config.selector.address.billingToGc.country,_config.selector.address.shippingToGc.country,_config.selector.address.shippingDifferentThanBilling].join(','), async function () {
                const init = true;
                const billingAddress = await _cjs.gC.getBillingAddress();
                const shippingAddress = await _cjs.gC.getShippingAddress();
                let cartData = await _util.getValue(CARTDATA);
                let country = '';
                let shippingCountry,billingCountry = null;
                if(shippingAddress && shippingAddress.address.country) {
                    shippingCountry = shippingAddress.address.country;
                }
                if(billingAddress && billingAddress.address.country) {
                    billingCountry = billingAddress.address.country;
                }
                if(cartData) {
                    cartData.cart.billingAddress.country = billingCountry;
                    cartData.cart.shippingAddress.country = shippingCountry;
                    await _util.setValue(CARTDATA, cartData);
                }
                country = billingCountry?billingCountry:shippingCountry?shippingCountry:'';
                if(_config.gC.disableNotSupportedPayment!==false) {
                    $("input[name='paymentMethodID'][data-type]").each(async function () {
                        let payment = $(this).attr('data-type');
                        let supported = (await _gC[PAYMENTS][payment].supportedCurrencyAndGeography(_config.currency, country, init) && await _gC[PAYMENTS][payment].supportedSettings() );
                        $(this).prop('disabled', !supported);
                        if (!supported) {
                            $(this).prop('checked', false);
                        }
                    });
                }
                /**
                 * This event will be triggered after the billing country has been updated.
                 * @memberof CheckoutJS
                 * @event countryUpdated
                 * @category Events
                 * @example checkoutJS.on('countryUpdated',function(){
                 *     console.log('countryUpdated');
                 * });
                 */
                await _cjs.emit('countryUpdated');
            });
            $(document).on("change",[_config.selector.address.selectAddressEntry,_config.selector.address.billingToGc.line1,_config.selector.address.billingToGc.line2,_config.selector.address.billingToGc.city,_config.selector.address.billingToGc.postalCode,_config.selector.address.billingToGc.countrySubdivision].join(','), function() {
                const $paymentMethod = $("input[name='paymentMethodID']:checked");
                if ($paymentMethod && $paymentMethod.length) {
                  $paymentMethod.removeAttr('data-source-id');
                }
                $(_config.selector.address.billingToGc.country).trigger('change');
            });
            $(document).on("change", "input[name='paymentMethodID']", function () {
                const $this = $(this);
                const payment = $this.attr('data-type');
                if (Global.applySelectedStyle && payment && _config[PAYMENTS][payment]) {
                    if($this.is(':checked')){
                        Global.applySelectedStyle($this);
                    }
                }
            });
            _cjs.on('initializeElements',async function(){
                await _this.createShopperPaymentOptionSelector();
            });
            _cjs.on('initializedPageElement',async function(){
                $(_config.selector.address.billingToGc.country).trigger('change');
            });
        }
    }

    /**
     * After loading GlobalCommerce, this function will be triggered when the current page is the confirm order page.
     * @returns {Promise<void>}
     * @example checkoutJS.gC.initConfirmOrder();
     */
    async initConfirmOrder() {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _selector = _config.selector;
        const _cloudPayPayload = _config.cloudPayPayload;
        const _gC = _cjs.gC;
        const $confirmForm = $(_selector.confirmOrder.confirmOrderForm);
        if ($confirmForm && $confirmForm.length) {
            let _paymentType = await _gC._getBasePaymentType(_cloudPayPayload);
            let _name = await _util.getSourcePaymentType(_paymentType);
            let _configPayment = _config[PAYMENTS][_name];
            let originalButtonLockDown = UNDEFINED;
            let ready = false;
            const _buttonLockDown = function() {
                return ready;
            };
            if (typeof Global.buttonLockDown === UNDEFINED) {
                Global.buttonLockDown = _buttonLockDown;
            }

            if(_cloudPayPayload && _cloudPayPayload.id){
                const result = await _cjs[DRJS].retrieveSource(_cloudPayPayload.id, _cloudPayPayload.details.clientSecret);
                let _paymentType = await _gC._getBasePaymentType(result.source);
                await _util.setValue(PAYMENT, {name: _paymentType, result: result});
            }

            _cjs.once('initializeElements',async function() {
                if (_cloudPayPayload.type && _cloudPayPayload.id) {
                    const _payment = _gC[PAYMENTS][_name];
                    const paymentElement = `<p id='drjs_${_name}Element'></p>`;
                    const $replacement = $(_selector.confirmOrder.replacement);
                    if ($replacement && $replacement.length) {
                        $replacement.replaceWith(paymentElement);
                    } else {
                        $confirmForm.find(_selector.confirmOrder.paymentContainer).append(paymentElement);
                    }

                    originalButtonLockDown = Global.buttonLockDown;
                    if (Global.buttonLockDown) {
                        Global.buttonLockDown = _buttonLockDown;
                    }

                    const $termsOfSaleAcceptance = $(_selector.confirmOrder.termsOfSaleAcceptance);
                        const activeAcceptance = await _payment.getActiveAcceptance({
                            CHECKOUT: _config.labels.CHECKOUT
                        });
                        if (activeAcceptance && activeAcceptance.length && $termsOfSaleAcceptance && $termsOfSaleAcceptance.length) {
                            $termsOfSaleAcceptance.append($('<div class="checkbox-inline checkbox-wide"></div>').html(activeAcceptance));
                        }

                    ready = true;
                }
            });

            $confirmForm.submit(function (e) {
                if (_cloudPayPayload && _cloudPayPayload.id) {
                    e.preventDefault();
                    e.stopPropagation();
                    return (async () => {
                        const validateElements = await _gC[PAYMENTS][_name].validateElements();
                        if(validateElements){
                            Global.buttonLockDown = originalButtonLockDown;
                        }
                        if (validateElements && (!$confirmForm.valid || $confirmForm.valid()) && (typeof (Global.buttonLockDown) === UNDEFINED || Global.buttonLockDown())) {
                            _util.loadingOverlay();
                            const payment = await _util.getValue(PAYMENT) || {};
                            try {
                                let redirectInfoPage = false;
                                if (payment.name === _paymentType || _configPayment.skipPaymentTypeCheck) {
                                    const currentSource = payment.result ? payment.result.source : {};
                                    let source = await _gC.validateSource(currentSource);
                                    if (source) {
                                        await _gC.createPaymentOptionToShopper();
                                        $confirmForm[0].submit();
                                        return;
                                    }
                                    if(_cloudPayPayload.type === GCSTOREFRONT) {
                                        try {
                                            _cjs.emit(LOGGING, {
                                                id: _util.getTime(),
                                                api: CJS,
                                                method: 'applySourceId',
                                                responseBody: source
                                            });
                                            source = await _gC[PAYMENTS][_name].applySourceId();
                                            _util.loadingOverlay();
                                            source = await _gC.validateSource(source);
                                            if (source) {
                                                _cjs.emit(LOGGING, {
                                                    id: _util.getTime(),
                                                    api: CJS,
                                                    method: 'submitConfirmForm'
                                                });
                                                await _gC.createPaymentOptionToShopper();
                                                $confirmForm[0].submit();
                                            } else {
                                                redirectInfoPage = true;
                                            }
                                        } catch (ex) {
                                            _util.loadingOverlay(true);
                                            if (ex) {
                                                $confirmForm.find(_selector.confirmOrder.submitBtnProcessing).html(_config.labels.error.PAYMENT_AUTHORIZATION_FAILED)
                                                _util.errorMessage(ex);
                                            }
                                        }
                                    }else{
                                        redirectInfoPage = true;
                                    }
                                }else{
                                    redirectInfoPage = true;
                                }

                                if(redirectInfoPage) {
                                    await _util.setValue(PAYMENT, {name: _name});
                                    const infoLink = await _shopperApi.getInfoPageLink();
                                    Global.location.href = infoLink;
                                }
                            } catch (ex) {
                                _util.loadingOverlay(true);
                                if (ex) {
                                    _util.errorMessage(ex);
                                }
                            }
                        }
                    })();
                }
            });
        }
    }

    /**
     * After loading GlobalCommerce, this function will be triggered when the current page is the thank you page.
     * @returns {Promise<void>}
     * @example checkoutJS.gC.initThankYou();
     */
    async initThankYou() {
        const _cjs = this[_CHECKOUTJS];
        const _gC = _cjs.gC;
        _cjs.on('initialized',async function(){
            const source = await _gC.getSelectedSource();
            _gC.pendingFundsRedirectFlow(source);
            _gC.pendingFundsReceiver(source);
        });
    }

    /**
     * Initializes the offline refund element.
     * @param {string} refundToken
     * @returns {Promise<void>}
     * @example checkoutJS.gC.initOffineRefund('XXXXXXXXXXXX');
     */
    async initOfflineRefund(refundToken) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];

        const $delayedPaymentRefund = $(_config.selector.delayedPaymentRefund.container);
        if($delayedPaymentRefund && $delayedPaymentRefund.length) {
            $delayedPaymentRefund.find(_config.selector.delayedPaymentRefund.replacement).replaceWith($('<div/>').attr('id',_config.elements.offlineRefund.elementId));
            const _offlinerefund = new OfflineRefund(_cjs);
            await _offlinerefund.init(refundToken);
            Object.defineProperties(_cjs['gC']['elements'], {
                'offlinerefund': {
                    value: _offlinerefund,
                    writable: true,
                    enumerable: true,
                    configurable: false
                }
            });
        }
    }

    async initTC() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _selector = _config.selector;
        const _this = this;
        $(document).on("change", _selector.cloudPayTermsAcceptance, function () {
            const $cloudPayBtn = $(_selector.cloudPayBtn).filter('[data-tc]');
            if ($(this).is(':checked')) {
                $(_selector.cloudPayTCError).hide();
                $cloudPayBtn.css({
                    "pointer-events": ""
                });
                if ($cloudPayBtn.parent().is(".dr_cloudPayOverlay")) {
                    $cloudPayBtn.unwrap();
                }
                $cloudPayBtn.each(function () {
                    $(this).data('parent', $(this));
                });
            } else {
                $cloudPayBtn.each(function () {
                    if (!$(this).parent().is(".dr_cloudPayOverlay")) {
                        const $overlay = $("<div class='dr_cloudPayOverlay'></div>").click(function () {
                            $(_selector.cloudPayTCError).show();
                        });
                        $(this).css({
                            "pointer-events": "none"
                        }).wrap(
                            $overlay
                        );
                        $(this).data('parent', $(this).parent());
                    }
                });

            }
        });

        if (_config.page === 'ThreePgCheckoutAddressPaymentInfoPage') {
            $(document).on("change", "input[name='paymentMethodID']", function () {
                const payment = $(this).attr('data-type');
                if (payment && _config[PAYMENTS][payment]) {
                    if (_config[PAYMENTS][payment].showTC) {
                        $(_selector.cloudPayTC).show();
                    } else {
                        $(_selector.cloudPayTC).hide();
                        $(_selector.cloudPayTCError).hide();
                    }
                }
            });
            $("input[name='paymentMethodID']:checked").trigger("change");
        }

        _cjs.on('entityUpdate', function (entityData) {
            if (!entityData) {
                entityData = _config.entity;
            }
            const cloudPayTermsAcceptance = $(_selector.cloudPayTermsAcceptance).is(":checked");
            const cloudPayTC = $.parseHTML(entityData.cloudPayTC);
            if (cloudPayTC && cloudPayTC.length) {
                const html = $(cloudPayTC[0]).html();
                $(_selector.cloudPayTC).html(html);
                $(_selector.cloudPayTermsAcceptance).prop('checked', cloudPayTermsAcceptance);
            }
        });
        const $cloudPayBtn = $(_selector.cloudPayBtn);
        if ($cloudPayBtn && $cloudPayBtn.length) {
            let showTC = false;
            $cloudPayBtn.each(function () {
                const payment = $(this).attr('data-payment');
                if (payment && _config[PAYMENTS][payment].show && _config[PAYMENTS][payment].showTC) {
                    showTC = true;
                    $(this).attr('data-tc', true);
                }
            });
            if (showTC) {
                _this.showTC = true;
                await _this.checkTC();
                $(_selector.cloudPayTermsAcceptance).trigger("change");
            }
        }
    }

    /**
     * Checks whether the Terms and Conditions container is present on the page and insert the Terms and Conditions text in the container.
     * @param {jQueryObject} [cloudPayTCContainer]
     * @returns {Promise<void>}
     * @example checkoutJS.gC.checkTC();
     */
    async checkTC(cloudPayTCContainer) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _selector = _config.selector;
        const _this = this;
        if (_this.showTC) {
            let $cloudPayTCContainer = cloudPayTCContainer;
            let $cloudPayTCContainerAll = $(_selector.cloudPayTCContainer);
            $cloudPayTCContainerAll.empty();
            if (!$cloudPayTCContainer) {
                if ($cloudPayTCContainerAll.length) {
                    $cloudPayTCContainer = $cloudPayTCContainerAll.filter(function () {
                        return $(this).closest(_selector.checkoutForm).length === 0;
                    });
                }
            }
            if ($cloudPayTCContainer && $cloudPayTCContainer.length) {
                //$(_cjs[CONFIG].selector.cloudPayTC).replaceWith(_cjs[CONFIG].entity.cloudPayTC);
                $cloudPayTCContainer.html(_config.entity.cloudPayTC);
            } else {
                if (!$(_selector.checkoutForm).length) {
                    //$(_cjs[CONFIG].entity.cloudPayTC).insertAfter($(_cjs[CONFIG].selector.cloudPayBtn).last());
                    $(_config.entity.cloudPayTC).insertBefore($(_selector.cloudPayBtn).first());
                }
            }
            $(_selector.cloudPayTC).show();
        }
    }

    /**
     * Copies the checkout form data to the CheckoutJS instance.
     * @returns {Promise<void>}
     * @example checkoutJS.gC.syncShopperInfo();
     */
    async syncShopperInfo() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const billingAddress = await _cjs.gC.getBillingAddress();
        const shippingAddress = await _cjs.gC.getShippingAddress();

        let cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();//{cart:{}};
        cartData.cart.billingAddress = await _shopperApi.convertPaymentRequestAddressToShopperApiAddress(
            billingAddress, 'billingAddress'
        );
        cartData.cart.shippingAddress = await _shopperApi.convertPaymentRequestAddressToShopperApiAddress(
            shippingAddress, 'shippingAddress'
        );
        await _util.setValue(CARTDATA, cartData);

        let country = _config.country;
        if (cartData.cart.billingAddress.country) {
            country = cartData.cart.billingAddress.country;
        } else if (cartData.cart.shippingAddress.country) {
            country = cartData.cart.shippingAddress.country;
        }
        _config.country = country;
    }

    async createShopperPaymentOptionSelector() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _shopper = _cjs[SHOPPER];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _selector = _config.selector;
        const _util = _cjs[UTIL];
        const _gC = _cjs.gC;
        const _gcPayments = _gC[PAYMENTS];
        const CREDITCARD = 'creditCard';
        const _configPayment = _config[PAYMENTS][CREDITCARD];
        if(_shopper.isAuthenticated) {

            let $billingOption = $('<span id="dr_billingOption"></span>');

            const $paymentContainer = $('#dr_paymentContainer');
            if ($paymentContainer.find('#dr_payment').length) {
                $billingOption.insertBefore($paymentContainer.find('#dr_payment>div')[0]);
            } else {
                $billingOption.insertBefore($paymentContainer.find('.dr_checkoutContainer>div')[0]);
            }

            $billingOption.append($(_config.selector.payment.billingNickNameContainer).add(_config.selector.payment.billingOptionContainer));

            const paymentOptions = await _shopperApi.getPaymentOptions();
            const paymentOption = paymentOptions.paymentOptions.paymentOption;
            let $input = $(_config.selector.payment.billingNickName);
            Global.onPaymentChange = async (element)=>{
                const value = $(element).val();
                const item = $(element).find('option[value="'+value+'"]').data('item');
                $("input[name='paymentMethodID'][data-type]:checked").removeAttr('data-disabled');

                if(item){
                    let paymentType = await _util.getSourcePaymentType(item.type);
                    if(paymentType === 'CreditCardMethod'){
                        paymentType = CREDITCARD;
                    }
                    let $paymentMethodID = $("input[name='paymentMethodID'][data-type='" + paymentType + "']");
                    $paymentMethodID.attr('data-source-id',item.sourceId).trigger('click',{selector:true});
                    switch(paymentType){
                        case CREDITCARD: {
                            //$("#CreditCardMethod,#CurrencySpecificCreditCardMethod").attr('data-source-id',item.sourceId).trigger('click',{selector:true});
                            const paymentOption = Global.paymentList.find(elm => elm.paymentOptionID === item.id.toString());
                            const creditCard = item.creditCard;
                            let cardNumber = creditCard.displayName?creditCard.displayName:creditCard.brand+' ';
                            if(creditCard.displayableNumber){
                                cardNumber+= creditCard.displayableNumber;
                            }else{
                                cardNumber+= paymentOption.cardNumber;
                            }

                            let element = _config[PAYMENTS][CREDITCARD].element;
                            if(element) {
                                element.cardnumber.parentNode.textContent = cardNumber;
                                element.cardexpiration.parentNode.textContent = '';
                                element.cardcvv.parentNode.textContent = item.creditCard.expirationMonth + '/' + item.creditCard.expirationYear;
                                element.cardnumber.parentNode.classList.add(_configPayment.classes.complete);
                                element.cardexpiration.parentNode.classList.add(_configPayment.classes.complete);
                                element.cardcvv.parentNode.classList.add(_configPayment.classes.complete);
                                $('input[name=cardNumber]').val(paymentOption.cardNumber);
                                $('input[name=cardExpirationMonth]').val(item.creditCard.expirationMonth);
                                $('input[name=cardExpirationYear]').val(item.creditCard.expirationYear);
                            }
                        }
                        break;
                    }
                    if (item.sourceId && item.sourceClientSecret) {
                        $(_selector.cloudPaySourceId).val(item.sourceId);
                        const result = await _cjs[DRJS].retrieveSource(item.sourceId, item.sourceClientSecret);
                        await _util.setValue(PAYMENT, {name: paymentType, result: result});
                    } else {
                        $("input[name='paymentMethodID'][data-type='" + paymentType + "']").attr('data-disabled','true');
                    }
                }
                if(value === 'NEW'){
                    if(!$(_config.selector.payment.billingNickNameContainer).is(':visible')) {
                        $(_config.selector.payment.billingNickNameContainer).show();
                        let element = _config[PAYMENTS][CREDITCARD].element;
                        if(element) {
                            element.cardnumber.parentNode.textContent = '';
                            element.cardexpiration.parentNode.textContent = '';
                            element.cardcvv.parentNode.textContent = '';
                            element.cardnumber.parentNode.classList.remove(_configPayment.classes.complete);
                            element.cardexpiration.parentNode.classList.remove(_configPayment.classes.complete);
                            element.cardcvv.parentNode.classList.remove(_configPayment.classes.complete);
                        }
                        _cjs.emit('initializePayments');
                    }
                } else {
                    $(_config.selector.payment.billingNickNameContainer).hide();
                    await _util.removeValue(NICKNAME);
                    $input.val('');
                }
            };

            $input.on('change', async () => {
                const billingOptionNickName = $input.val();
                await _util.setValue(NICKNAME, billingOptionNickName);
                if(billingOptionNickName && billingOptionNickName.length){
                    $input.removeClass(_config.gC.errorClass);
                }
            });

            if(paymentOption){
                for(let i=0;i<paymentOption.length;i++) {
                    const item = paymentOption[i];
                    const paymentType = await _util.getSourcePaymentType(item.type);
                    let supportedCurrency = true;
                    if(item.sourceId && _gcPayments.hasOwnProperty(paymentType)) {
                        supportedCurrency = await _gcPayments[paymentType].supportedCurrency();
                    }
                    $(_config.selector.payment.billingOptionSelector).find('option[value="'+item.id+'"]').data('item', item).attr('disabled',!supportedCurrency);
                }
            }
            _cjs.once('initialized',async()=>{
                const _payment = (await _util.getValue(PAYMENT) || {});
                let source = {};
                if (_payment && _payment.result && _payment.result.source) {
                    source = _payment.result.source;
                    if(paymentOption){
                        for(let i=0;i<paymentOption.length;i++) {
                            const item = paymentOption[i];
                            if(item.sourceId === source.id){
                                $(_config.selector.payment.billingOptionSelector).find('option[value="'+item.id+'"]').prop('selected',true);
                                break;
                            }
                        }
                    }
                }
                $(_config.selector.payment.billingOptionSelector).trigger('change');
                $(document).on("click", "input[name='paymentMethodID']", (e,data)=> {
                    if(!data || !data.selector ) {
                        $(_config.selector.payment.billingOptionSelector).val('NEW').trigger('change');
                    }
                });
                const nickname = await _util.getValue(NICKNAME);
                $(_config.selector.payment.billingNickName).val(nickname);
            });
        }
    }

    /**
     * Routes to a gC checkout flow page e.g. cart, info, confirm, thankyou.
     * @returns {Promise<{PaymentSourceObject}>}
     * @example checkoutJS.gC.routing('confirm');
     */
    async routing(payment) {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _name = payment;
        const route = _config[PAYMENTS][_name].route;
        const _selector = _config.selector;
        const _payment = (await _util.getValue(PAYMENT) || {});
        let source = {};
        if (_payment && _payment.result && _payment.result.source) {
            source = _payment.result.source;
        }
        if (route === "thankyou") {
            const response = await _shopperApi.applySourceToCart(source.id);
            if (response && response.cart && typeof response.cart.paymentMethod !== UNDEFINED) {
                const cart = await _shopperApi.submitCart();

                if (cart.submitCart) {
                    let orderId = cart.submitCart.order.id;
                    return Promise.resolve(source).then(async () => {
                        const link = await _shopperApi.getThankYouPageLink(orderId);
                        Global.location.href = link;
                    });
                } else {
                    return Promise.reject('fail to submit cart');
                }
            } else {
                return Promise.reject(FAIL_TO_APPLY_SOURCE);
            }
        } else if (route === "confirm") {
            const response = await _shopperApi.applySourceToCart(source.id);
            if (response && response.cart && typeof response.cart.paymentMethod !== UNDEFINED) {
                return Promise.resolve(source).then(async () => {
                    const link = await _shopperApi.getConfirmOrderPageLink();
                    Global.location.href = link;
                });
            } else {
                return Promise.reject(FAIL_TO_APPLY_SOURCE);
            }
        } else {
            const $paymentMethodID = $("input[name='paymentMethodID'][data-type='" + _name + "']");
            const _gCPayment = _cjs.gC[PAYMENTS][_name];
            if (_config.page === 'QuickBuyCartPage') {
                $(_selector.cloudPaySourceId).val(source.id);
                $paymentMethodID.attr('data-source-id', source.id);
                if (_gCPayment.changePaymentMethod) {
                    _gCPayment.changePaymentMethod();
                }
                return Promise.resolve(source).then(() => {
                    if ($paymentMethodID.is(':visible')) {
                        $paymentMethodID.trigger('click');
                        $(_selector.checkoutForm).submit();
                    }
                });
            } else if (_config.page === 'ThreePgCheckoutAddressPaymentInfoPage') {
                $(_selector.cloudPaySourceId).val(source.id);
                $paymentMethodID.attr('data-source-id', source.id);
                if (_gCPayment.changePaymentMethod) {
                    _gCPayment.changePaymentMethod();
                }
                $(_selector.checkoutForm).submit();
                return Promise.resolve(source);
            } else if (_config.page === 'ThreePgCheckoutShoppingCartPage') {
                const response = await _shopperApi.applySourceToCart(source.id);
                if (response && response.cart && typeof response.cart.paymentMethod !== UNDEFINED) {
                    return Promise.resolve(source).then(() => {
                        $(_selector.threePgCheckoutBtn)[0].click();
                    });
                } else {
                    return Promise.reject(FAIL_TO_APPLY_SOURCE);
                }
            } else {

                const response = await _shopperApi.applySourceToCart(source.id);
                if (response && response.cart && typeof response.cart.paymentMethod !== UNDEFINED) {
                    return Promise.resolve(source).then(async () => {
                        const link = await _shopperApi.getInfoPageLink();
                        Global.location.href = link;
                    });
                } else {
                    return Promise.reject(FAIL_TO_APPLY_SOURCE);
                }
            }
        }
    }

    async validateElements() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _configGc = _config.gC;
        const _shopper = _cjs[SHOPPER];
        let validated = true;
        if (_shopper.isAuthenticated && $('#dr_billingOption').is(':visible')) {
            const $nickinput = $(_config.selector.payment.billingNickName);
            const value = $nickinput.val();
            if(value === '') {
                $nickinput.addClass(_configGc.errorClass);
                validated = false;
            }
        }
        return validated;
    }
}

/**
 * @class ShopperGC
 * @classdesc The ShopperGC class is the shopper module for Global Commerce hosted sites.
 * @extends Shopper
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @returns {Promise<ShopperGC>}
 * @category CommerceAPI
 */
class ShopperGC extends Shopper {
    constructor(parent, collection) {
        super(parent, extend({
            excludeMethods: {constructor: true},
            writableMethods: {
                getPrefix: true
            }
        }, collection));
        return (async () => {
            return parent.shopper;
        })();
    }

    async getPrefix() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        let _id = await _cjs[UTIL].getCookie('gc_ss_' + _config.siteId);
        if (!_id) _id = _config.siteId;
        return _config.prefixName + _id + '_';
    }
}

/**
 * @class GlobalCommercePayment
 * @classdesc The GlobalCommercePayment class is the payment module for DigitalRiver.js payments on Global Commerce hosted sites. Override the functions in this class if customizations for the payment is needed.
 * @hideconstructor
 * @extends StorefrontPayment
 * @category PaymentBase
 */
const PaymentGC = {

    /**
     * Creates the payment sections for each enabled DigitalRiver.js payments on the Global Commerce billing/payment information pages when the #dr_paymentContainer exists on the page.
     * @memberOf GlobalCommercePayment
     * @returns {Promise<$paymentSection>}
     * @instance
     * @abstract
     * @async
     */
    createPaymentInfo: async function () {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _selector = _config.selector;
        let _payment = _config[PAYMENTS][_name];
        let $paymentSection = await _util.getCache(_name + 'Section');
        if (!$paymentSection && _payment.hidePaymentSection !== true) {
            const cloudPayPaymentMethodID = $('#CloudPay').val();
            if (cloudPayPaymentMethodID) {
                if (typeof Global.resizeToMobilePayments !== UNDEFINED) {
                    Global.resizeToMobilePayments();
                }
                _payment = _config[PAYMENTS][_name];
                $paymentSection = $(_util.format($(_config.template.payment).html(), {
                    paymentId: _name,
                    name: _payment.name,
                    description: _payment.description,
                    details: _config.labels.DETAILS
                }));
                const $paymentContainer = $(_selector.payment.paymentContainer);
                if($paymentContainer.find(_selector.payment.paymentSection).length){
                    $paymentContainer.find(_selector.payment.paymentSection).first().append($paymentSection);
                } else {
                    console.error('Not found payment container section');
                }
                let $paymentMethodID = $paymentSection.find("input[name='paymentMethodID']");
                $paymentMethodID.attr("data-type", _name);

                $(Global).trigger('resize');
                if (typeof Global.payDetailsSize !== UNDEFINED) {
                    Global.payDetailsSize();
                }

                let _payment = (await _util.getValue(PAYMENT) || {});
                if (Object.keys(_payment).length === 0) {
                    _payment = _config.cloudPayPayload || {};
                }
                if (_payment && (_payment.type === _name || _payment.name === _name) && $("#CloudPay").is(':checked')) {
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
                await _util.setCache(_name + 'Section', $paymentSection);
            }
        }
        return $paymentSection;
    },

    /**
     * Hides the payment information sections of the non-selected payment methods after creating the payment sections and initializing the payments.
     * @memberOf GlobalCommercePayment
     * @returns {Promise}
     * @instance
     * @abstract
     * @async
     */
    completePaymentInfo: async function () {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        if (!_cjs[CONFIG][PAYMENTS][_name].show) {
            const section$ = await _cjs[UTIL].getCache(_name + 'Section');
            if (section$) {
                section$.hide();
            }
        }
        return await _cjs.gC[PAYMENTS][_name].changePaymentMethod();
    },

    /**
     * This event will be triggered after the payment method has changed.
     * @memberOf GlobalCommercePayment
     * @returns {Promise}
     * @instance
     * @abstract
     * @async
     */
    changePaymentMethod: async function () {

    }
};

/** The CheckoutJS configuration structure for Global Commerce hosted sites.
 *  @module ConfigGC
 *  @extends module:Config
 *  @category Utility
 */
const ConfigGC = {
    /**
     * All payment configurations for for Global Commerce hosted sites.
     * @name payments
     * @type { Object.<string, module:Config.PaymentConfigDefinition> }
     * @memberOf module:ConfigGC
     * @instance
     * @property {module:Config.PaymentConfigDefinition} codJapan - Cash On Delivery
     */
    payments: {
        creditCard:{
            gcStorefront:false
        },
        payPal:{
            //gcStorefront:false
        },
        applePay: {
            route: "thankyou",
            showTC: true,
            hidePaymentSection: true
        },
        googlePay: {
            route: "thankyou",
            showTC: true,
            hidePaymentSection: true
        },
        codJapan: {
            name: "Cash On Delivery",
            elementId: "dr_codJapan",
            disable: true,
            show: false,
            enumerable: false,
            supportedGeographies: ["JP"],
            supportedCurrencies: ["JPY"]
        },
        payco: {
            preventPopupClose: true
        },
        bankTransfer: {
            preventPopupClose: true
        },
        msts: {
            showEnrollButton: true
        },
        dropin: {
            //removePaymentContainer: true
        }
    },
    selector: {
        payment: {
            paymentContainer: '#dr_paymentContainer',
            paymentSection: '#dr_payment,.dr_checkoutContainer',
            billingNickNameContainer: '#billingNickDiv',
            billingNickName: '#ccNickName',
            billingOptionContainer: '#dr_ccMethodSelect',
            billingOptionSelector: '#ccMethod',
        }
    },
    gC: {
        errorClass: "dr_error",
        disableNotSupportedPayment: true,
        hidePaymentSection: true,
    }
};

export {
    GlobalCommerce,
    ShopperGC,
    PaymentGC,
    ConfigGC,
    $
};
