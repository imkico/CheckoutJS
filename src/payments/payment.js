import {Base} from '../base';
import {
    _CHECKOUTJS,
    CONFIG,
    UTIL,
    SHOPPERAPI,
    PAYMENTS,
    UNDEFINED,
    REQUESTPAYLOAD,
    PAYMENT,
    CARTDATA,
    ELEMENT
} from "../keywords";

/**
 * The response of the payment request.
 * @typedef PaymentRequestResponseObject
 * @property {Object} error - The error details, which will only be populated if there are any errors.
 * @property {PaymentSourceObject} source - The source payload details.
 * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/reference/digital-river-payment-objects#payment-request-source-object
 */

/**
 * The payment source object.
 * @typedef PaymentSourceObject
 * @property {string} type - The payment name of the source, e.g. creditCard, googlePay, applePay.
 * @property {string} id - The unique source ID in payment services.
 * @property {string} clientSecret - The secret key to retrieve source details.
 * @property {string} flow
 * @property {string} amount - The amount that will be charged.
 * @property {string} clientId
 * @property {string} channelId
 * @property {string} currency
 * @property {string} upstreamId - The cart or requisition ID in Global Commerce.
 * @property {Boolean} reusable
 * @property {string} state
 * @property {Boolean} liveMode
 * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/reference/digital-river-payment-objects#payment-request-source-object
 */

/**
 * The payload object returned from payment services.
 * @typedef PaymentRequestObject
 * @property {string} type
 * @property {string} country
 * @property {string} currency
 * @property {Object[]} displayItems
 * @property {Object[]} shippingOptions
 * @property {Object} owner
 * @property {Boolean} requestShipping
 * @property {Object} style
 * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/reference/digital-river-payment-objects#payment-request-object
 */

/**
 * The payment object, which contains the payment name and response of the payment request.
 * @typedef PaymentObject
 * @property {string} name - The payment name.
 * @property {PaymentRequestResponseObject} result - The response of the payment request.
 */

/**
 * The DigitalRiver.js options, which includes customization options.
 * @typedef PaymentElementOptions
 * @property {Object} style - The custom styles.
 * @property {Object} classes - The custom classes.
 * @example {
    classes: {
        base: "DRElement",
        complete: "complete",
        empty: "empty",
        focus: "focus",
        invalid: "invalid",
        webkitAutofill: "autofill"
    },
    style: {
        base: {
            color: "#fff",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "20px",
            fontSmoothing: "auto",
            fontStyle: "italic",
            fontVariant: "normal",
            letterSpacing: "3px"
        },
        empty: {
            color: "#fff"
        },
        complete: {
            color: "green"
        },
        invalid: {
            color: "red",
        }
    }
}
 */


/**
 * @classdesc The base payment class, which contains shared functionalities for all payment methods.
 * @class Payment
 * @extends Base
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType=''] - The payment name.
 * @returns {Payment}
 * @category PaymentBase
 */
class Payment extends Base {
    constructor(parent, collection, name = '') {
        super(parent, Object.assign({
            excludeMethods: {constructor: true},
            writableMethods: {
                createPaymentRequest: true,
                applySourceId: true,
                completeSourceId: true,
                shippingAddressChange: true,
                shippingOptionChange: true,
                validate: true,
                validateElements: true,
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
        /**
         * The request payload of the payment instance.
         * @name requestPayload
         * @type PaymentRequestPayload
         * @memberof Payment
         * @instance
         */
        this[REQUESTPAYLOAD] = new PaymentRequestPayload(parent, {}, name, this);
        Object.defineProperty(this, REQUESTPAYLOAD, {
            enumerable: false,
            configurable: false,
            writable: true,
        });

        /**
         * The HTML element of the payment instance.
         * @name element
         * @type PaymentElement
         * @memberof Payment
         * @instance
         */
        this[ELEMENT] = new PaymentElement(parent, {}, name, this);
        Object.defineProperty(this, ELEMENT, {
            enumerable: false,
            configurable: false,
            writable: true,
        });
    }

    /**
     * Creates the payment request payload for this payment.
     * @returns {Promise<PaymentRequestObject>}
     */
    async createPaymentRequest() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _util = _cjs[UTIL];
        let cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        let paymentRequestData = await _this[REQUESTPAYLOAD].createObject(cartData);
        return (paymentRequestData);
    }

    /**
     * Applies the source to an active cart via Commerce API.
     * @param {PaymentRequestResponseObject} result - The return payload from DigitalRiver.js after the source ID has been applied.
     * @abstract
     * @returns {Promise<PaymentRequestResponseObject>}
     */
    async applySourceId(paymentRequestResponseObject) {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _shopperApi = _cjs[SHOPPERAPI];
        const _util = _cjs[UTIL];
        const result = paymentRequestResponseObject;
        if (result.error) {
            return Promise.reject(result);
        } else {
            const source = result.source;
            await _util.setValue(PAYMENT, {name: _name, result: result});
            if (source) {
                const address = await Promise.all([
                    _shopperApi.convertPaymentRequestAddressToShopperApiAddress(Object.assign(result.billingAddress, result.contactInformation), 'billingAddress'),
                    _shopperApi.convertPaymentRequestAddressToShopperApiAddress(result.shippingAddress, 'shippingAddress')
                ]);
                await _shopperApi.applyAddressToCart(address[0], address[1]);
                if (source.flow === 'standard' || source.flow === 'receiver') {
                    await _shopperApi.applySourceToCart(source.id);
                }
            }
            return (source);
        }
    }

    /**
     * This function will be triggered after the source ID has been applied.
     * @param {PaymentRequestResponseObject} paymentRequestResponseObject - The return payload from DigitalRiver.js after the source ID has been applied.
     * @abstract
     * @returns {Promise<PaymentRequestResponseObject>}
     */
    async completeSourceId(paymentRequestResponseObject) {
        return (paymentRequestResponseObject);
    }

    /**
     * This function will be triggered to update the shipping address on the cart, for one-click checkout.
     * @param {Event} event
     * @returns {Promise<PaymentRequestObject>}
     */
    async shippingAddressChange(event) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _shopperApi = _cjs[SHOPPERAPI];
        const shippingAddress = event.shippingAddress;
        return _shopperApi.convertPaymentRequestAddressToShopperApiAddress(shippingAddress, 'shippingAddress')
            .then(function (shopperApiShippingAddress) {
                return _shopperApi.applyAddressToCart(null, shopperApiShippingAddress);
            }).then(async function (response) {
                const updateObject = await _this.createPaymentRequest(await _this[REQUESTPAYLOAD].updateObject(response), 'shippingaddresschange');
                return _this.shippingAddressChange(updateObject).then(function () {
                    return (updateObject);
                });
            }).catch(async function (ex) {
                const updateObject = await _this.createPaymentRequest(await _this[REQUESTPAYLOAD].errorObject(ex), 'shippingaddresschange');
                return (updateObject);
            });
    }

    /**
     * This function will be triggered to update the shipping option on the cart, for one-click checkout.
     * @param {Event} event
     * @returns {Promise<PaymentRequestObject>}
     */
    async shippingOptionChange(event) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _shopperApi = _cjs[SHOPPERAPI];
        const shippingOption = event.shippingOption;
        const shippingOptionId = shippingOption.id;
        return _shopperApi.updateSelectedShippingMethodOnCart(shippingOptionId)
            .then(async function (response) {
                const updateObject = await _this.createPaymentRequest(await _this[REQUESTPAYLOAD].updateObject(response), 'shippingoptionchange');
                return (updateObject);
            }).catch(async function (ex) {
                const updateObject = await _this.createPaymentRequest(await _this[REQUESTPAYLOAD].errorObject(ex), 'shippingoptionchange');
                return (updateObject);
            });
    }

    /**
     * Determines if this payment is supported on the current currency.
     * @returns {Promise<Boolean>}
     */
    async supportedCurrency() {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        let _supportedCurrencies = [];
        if(Array.isArray(_configPayment.supportedCurrencies)){
            _supportedCurrencies = _configPayment.supportedCurrencies;
        }else if(_configPayment.supportedSettings){
            _supportedCurrencies = Object.keys(_configPayment.supportedSettings);
        }
        const _currentCurrency = _cjs[CONFIG].currency;
        let supported = _supportedCurrencies.includes(_currentCurrency);
        return ((_supportedCurrencies.length === 0) || supported);
    }

    /**
     * Determines if this payment is supported in the current country.
     * @returns {Promise<Boolean>}
     */
    async supportedGeography(country) {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        const _supportedGeographies = _configPayment.supportedGeographies || [];
        let supported = _supportedGeographies.includes(country);
        return ((_supportedGeographies.length === 0) || supported);
        //TODO support _configPayment.supportedSettings
    }

    async supportedCurrencyAndGeography(currency, country, init) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        //const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        let _supportedGeographies = _configPayment.supportedGeographies || [];
        let _supportedCurrencies = [];
        let geographiesValidated = false;
        let currenciesValidated = false;
        let amountValidated = true;
        if(Array.isArray(_configPayment.supportedCurrencies)) {
            _supportedCurrencies = _configPayment.supportedCurrencies;
        }else if(_configPayment.supportedCurrencies){
            if(_configPayment.supportedCurrencies.hasOwnProperty(currency) && _configPayment.supportedCurrencies[currency].countries) {
                _supportedGeographies = _configPayment.supportedCurrencies[currency].countries;
            }
        }else if(_configPayment.supportedSettings) {
            if(_configPayment.supportedSettings.hasOwnProperty(currency)) {
                const value = _configPayment.supportedSettings[currency];
                _supportedCurrencies.push(currency);
                if (value && value.countries) {
                    _supportedGeographies = [...value.countries];
                }
                amountValidated = await _this.supportedThresholdAmount(currency);
            }else{
                return false;
            }
        }
        if(_supportedGeographies.length === 0 || _supportedGeographies.includes(country)){
            geographiesValidated = true;
        }
        if(_supportedCurrencies.length === 0 || _supportedCurrencies.includes(currency)){
            currenciesValidated = true;
        }
        if(!geographiesValidated && !init) {
            const geographiesErrorMsg = await _cjs[PAYMENTS][_name].getGeographiesErrorMsg();
            _util.errorMessage(geographiesErrorMsg);
        }
        if(!currenciesValidated && !init) {
            const currenciesErrorMsg = await _cjs[PAYMENTS][_name].getCurrenciesErrorMsg();
            _util.errorMessage(currenciesErrorMsg);
        }
        if(!amountValidated && !init) {
            const amountErrorMsg = await _cjs[PAYMENTS][_name].getAmountErrorMsg();
            _util.errorMessage(amountErrorMsg);
        }
        return (geographiesValidated && currenciesValidated && amountValidated);
    }

    async supportedThresholdAmount(currency) {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        let amountValidated = true;
        if(_configPayment.supportedSettings && _configPayment.supportedSettings.hasOwnProperty(currency)) {
            const value = _configPayment.supportedSettings[currency];
            if (value && value.minAmount) {
                if (cartData.cart.pricing.orderTotal.value < value.minAmount) {
                    amountValidated = false;
                }
            }
            if (value && value.maxAmount) {
                if (cartData.cart.pricing.orderTotal.value > value.maxAmount) {
                    amountValidated = false;
                }
            }
        }
        return amountValidated;
    }

    async supportedRecurringPayments() {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _name = this._name;
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        let supported = true;
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        const useRecurringPayment = await _util.useRecurringPayment(cartData);
        if(useRecurringPayment && !_configPayment.supportedRecurringPayments) {
            supported = false;
        }
        if(_configPayment.singleSubscriptionForRecurring && useRecurringPayment && cartData.cart.totalItemsInCart>1) {
            supported = false;
        }
        return supported;
    }

    async supportedSettings() {
        return true;
    }
    
    /**
     * Validates the cart before the cart is submitted or before the next step/page.
     * @param {ShopperApi.CartDataObject} cartData
     * @throws Throws specific errors if the cart is not valid.
     * @returns {Promise<Boolean>}
     */
    async validateInfo(cartData) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _name = this._name;
        const _payments = await _this._storefront.getPayments();
        const _configLabels = _cjs[CONFIG].labels;
        const country = (!!cartData && !!cartData.cart.billingAddress.country) ? cartData.cart.billingAddress.country : _cjs[CONFIG].country;
        const init = false;

        let supportedGeography = await _payments[_name].supportedGeography(country);
        if (!supportedGeography) {
            return Promise.reject(new Error(_configLabels.INVALID_BILLING_COUNTRY));
        }

        let supported = await _payments[_name].supportedCurrencyAndGeography(_config.currency, country, init);
        if (!supported) {
            return false;
        }

        if (cartData && cartData.cart.billingAddress) {
            if (_util.hasSpecialsCharacters(cartData.cart.billingAddress)) {
                throw new Error(_configLabels.VALIDATOR_INVALID_TYPE);
            }
        }

        if (cartData && cartData.cart.shippingAddress) {
            if (_util.hasSpecialsCharacters(cartData.cart.shippingAddress)) {
                throw new Error(_configLabels.VALIDATOR_INVALID_TYPE);
            }
        }

        return await _this.validate(cartData);
    }

    /**
     * Override this function to add additional validation.
     * @param {ShopperApi.CartDataObject} cartData
     * @abstract
     * @returns {Promise<Boolean>}
     */
    // eslint-disable-next-line no-unused-vars
    async validate(cartData) {
        return true;
    }

    /**
     * This event will be triggered when the payment sheet has been cancelled, for one-click checkout.
     * @abstract
     * @returns {Promise}
     */
    async cancel() {
    }

    /**
     * Override this function to customize the return URL for redirecting to a specific page.
     * @abstract
     * @returns {Promise<string>}
     */
    async getReturnUrl() {
    }

    /**
     * Override this function to customize the cancel URL for redirecting to a specific page.
     * @abstract
     * @returns {Promise<string>}
     */
    async getCancelUrl() {
    }
    
    async getGeographiesErrorMsg() {
    }
    
    async getCurrenciesErrorMsg() {
    }
    
    async getAmountErrorMsg() {
    }

    /**
     * Customizes the behavior after the source has been applied. Return false to bypass this feature.
     * @abstract
     * @returns {Promise<Boolean>}
     */
    async routing() {
        return false;
    }

    async getActiveAcceptance(data){
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _name = this._name;
        const _configPayment = _config[PAYMENTS][_name];
        const _data = {
            CHECKOUT:_config.labels.CHECKOUT,
            ENTITY_NAME:_config.entity.name,
        };
        Object.assign(_data, data);
        let activeAcceptance = _configPayment.activeAcceptance;
        if(activeAcceptance) {
            if(activeAcceptance === true) {
                const attr = await _shopperApi.getText("PMS_"+_name.toUpperCase()+"_ACTIVEACCEPTANCE");
                if(attr.attribute && attr.attribute.value){
                    activeAcceptance = attr.attribute.value;
                }else{
                    return;
                }
            }
            return _util.format(activeAcceptance, _data);
        }
    }
    
    /**
     * Determines if the payment source state is ready for form submit.
     * @param {string} state - The payment source state, e.g. chargeable, pending_funds.
     * @returns {Promise<Boolean>}
     */
    isReadySubmitState(state) {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        
        if(_configPayment.submitThenRedirect){
            return ['chargeable','pending_funds','pending_redirect','consumed'].includes(state);
        } else {
            return _util.isReadySubmitState(state);
        }
    }
}

/**
 * @class PaymentRequestPayload
 * @classdesc The PaymentRequestPayload class is the generic format of a payment request payload.
 * @extends Base
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} paymentType
 * @param {Payment} payment
 * @returns {PaymentRequestPayload}
 * @category PaymentBase
 */
class PaymentRequestPayload extends Base {

    constructor(parent, collection, name, payment) {
        super(parent, Object.assign({
            excludeMethods: {constructor: true},
            writableMethods: {
                createObject: true,
                updateObject: true,
                total: true,
                displayItems: true,
                shippingOptions: true,
                shippingOption: true,
                errorObject: true,
                getOwner: true,
            }
        }, collection), name);

        if (payment) {
            Object.defineProperty(this, '_payment', {
                value: payment,
                configurable: false,
                enumerable: false,
            });
        }
    }

    /**
     * Creates the payment request object for DigitalRiver.js to create the source.
     * @param {ShopperApi.CartDataObject} cartData
     * @abstract
     * @returns {Promise<PaymentRequestObject>}
     * @see PaymentRequestObject
     */
    async createObject(cartData) {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _config = _cjs[CONFIG];
        const _util = _cjs[UTIL];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        const country = (!!cartData && !!cartData.cart.billingAddress.country) ? cartData.cart.billingAddress.country : _config.country;
        const currency = (!!cartData && !!cartData.cart.pricing.orderTotal.currency) ? cartData.cart.pricing.orderTotal.currency : _config.currency;
        const owner = await this.getOwner(cartData);
        const total = await this.total(cartData);
        const displayItems = await this.displayItems(cartData);
        const returnUrl = await this._payment.getReturnUrl();
        const cancelUrl = await this._payment.getCancelUrl();
        let _type = _name;
        const useRecurringPayment = await _util.useRecurringPayment(cartData);
        if(useRecurringPayment && _configPayment.recurringName){
            _type = _configPayment.recurringName;
        }
        const paymentRequestData = {
            type: _type,
            upstreamId: cartData.cart.id,
            owner: owner,
        };

        if(_configPayment.supportedPaymentSession!== false && cartData && cartData.cart.paymentSession && cartData.cart.paymentSession.id) {
            paymentRequestData['sessionId'] = cartData.cart.paymentSession.id;
            paymentRequestData['currency'] = currency;
        } else {
            paymentRequestData['currency'] = currency;
            paymentRequestData['amount'] = total.amount;
        }

        if(_configPayment.expressCheckout === true) {
            paymentRequestData['currency'] = currency;
            paymentRequestData['country'] = country;
            paymentRequestData['total'] = total;
            _util.extend(paymentRequestData, {
                displayItems: displayItems
            });
            const shippingOptions = await this.shippingOptions(cartData);
            if (shippingOptions.length > 0) {
                paymentRequestData['shippingOptions'] = shippingOptions;
            }
            paymentRequestData['requestShipping'] = shippingOptions.length > 0;
        }

        paymentRequestData[_type] = {
            returnUrl: returnUrl,
            cancelUrl: cancelUrl
        };
        _util.extend(paymentRequestData,_configPayment.source);
        return (paymentRequestData);
    }

    /**
     * Updates the payment request object after the cart has been changed.
     * @param {ShopperApi.CartDataObject} cartData
     * @abstract
     * @returns {Promise<PaymentRequestObject>}
     * @example
     * return
     * {
     *   status: 'success',
     *   error: {
     *   },
     *   total: {
     *     label: "Order Total",
     *     amount: 100,
     *     isPending: false
     *   },
     *   displayItems: [
     *     {
     *       label: "Line Item Label (Product Name)",
     *       amount: 100,
     *       isPending: false
     *     }
     *   ]
     * }
     */
    async updateObject(cartData) {
        if (cartData) {
            const total = await this.total(cartData);
            const displayItems = await this.displayItems(cartData);
            const paymentRequestData = {
                status: "success",
                total: total,
                displayItems: displayItems
            };

            const shippingOptions = await this.shippingOptions(cartData);
            if (shippingOptions.length > 0) {
                paymentRequestData['shippingOptions'] = shippingOptions;
            }
            paymentRequestData['requestShipping'] = shippingOptions.length > 0;
            return (paymentRequestData);
        }
        return ({});
    }

    /**
     * Returns the cart total properties for the payment request object.
     * @param {ShopperApi.CartDataObject} cartData
     * @abstract
     * @returns {Promise<Object>}
     * @example
     * return
     * {
     *   label: "Order Total",
     *   amount: 100,
     *   isPending: false
     * }
     */
    async total(cartData) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _configLabels = _config.labels;
        const object = {
            label: _configLabels.TOTAL,
            amount: !cartData ? 0 : cartData.cart.pricing.orderTotal.value
        };
        return (object);
    }

    /**
     * Returns a list of cart properties for the payment request object.
     * @param {ShopperApi.CartDataObject} cartData
     * @abstract
     * @returns {Promise<Object[]>}
     * @example
     * return
     * [
     *   {
     *     label: "Line Item Label (Product Name)",
     *     amount: 100,
     *     isPending: false
     *   },
     *   {
     *     label: "Shipping Amount",
     *     amount: 10,
     *     isPending: false
     *   }
     * ]
     */
    async displayItems(cartData) {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _configLabels = _config.labels;
        const lineItems = [];
        if (cartData && cartData.cart.lineItems && cartData.cart.lineItems.lineItem) {
            for (let i = 0; i < cartData.cart.lineItems.lineItem.length; i++) {
                const lineItem = cartData.cart.lineItems.lineItem[i];
                lineItems.push({
                    label: lineItem.product.displayName || ' ',
                    amount: lineItem.pricing.salePriceWithQuantity.value
                });
            }
        }

        const discount = {
            label: _configLabels.DISCOUNT,
            amount: !cartData ? 0 : cartData.cart.pricing.discount.value
        };

        const salesTax = {
            label: _configLabels.TAX,
            amount: !cartData ? 0 : cartData.cart.pricing.tax.value
        };

        const shipping = {
            label: _configLabels.ESTIMATED_SHIPPING_AND_HANDLING,
            amount: !cartData ? 0 : cartData.cart.pricing.shippingAndHandling.value
        };

        if (discount.amount > 0) {
            lineItems.push(discount);
        }

        if (!!cartData && typeof cartData.cart.shippingOptions.shippingOption !== UNDEFINED) {
            lineItems.push(shipping);
        }
        if (_config.cart.displayIncludeTax !== false && salesTax.amount > 0) {
            lineItems.push(salesTax);
        }

        return (lineItems);
    }

    /**
     * Returns a list of shipping options for the payment request object.
     * @param {ShopperApi.CartDataObject} cartData
     * @abstract
     * @returns {Promise<Object[]>}
     * @example
     * return
     * [
     *   {
     *     id: "standard-shipping",
     *     label: "Standard Shipping",
     *     amount: 0,
     *     detail: "Will arrive in 7-10 days."
     *   },
     *   {
     *     id: "overnight-shipping",
     *     label: "Overnight Shipping",
     *     amount: 10,
     *     detail: "Will arrive tomorrow morning"
     *   }
     * ]
     */
    async shippingOptions(cartData) {
        const shippingOptions = [];
        if (!!cartData && typeof cartData.cart.shippingOptions.shippingOption !== UNDEFINED) {
            const shippingMethod = cartData.cart.shippingMethod;
            const cartShippingValue = cartData.cart.pricing.shippingAndHandling.value;
            for (let i = 0; i < cartData.cart.shippingOptions.shippingOption.length; i++) {
                const shippingOption = cartData.cart.shippingOptions.shippingOption[i];
                const shippingOptionObject = await this.shippingOption(shippingOption, shippingMethod, cartShippingValue);
                if (shippingOptionObject) {
                    shippingOptions.push(shippingOptionObject);
                }
            }
        }
        return (shippingOptions);
    }

    /**
     * Returns the shipping option properties for the payment request object.
     * @param {string} shippingOption - The shipping option from CartDataObject, e.g. cartData.cart.shippingOptions.shippingOption[idx]
     * @param {string} shippingMethod - The shipping method from CartDataObject, e.g. cartData.cart.shippingMethod
     * @abstract
     * @returns {Promise<Object>}
     * @example
     * return
     * {
     *   id: "standard-shipping",
     *   label: "Standard Shipping",
     *   amount: 0,
     *   detail: "Will arrive in 7-10 days."
     * }
     */
    async shippingOption(shippingOption, shippingMethod) {
        const shippingOptionObject = {};
        shippingOptionObject.id = shippingOption.id.toString();
        shippingOptionObject.label = shippingOption.description;
        shippingOptionObject.amount = shippingOption.cost.value;
        shippingOptionObject.detail = '';
        if (shippingOption.id === shippingMethod.code) {
            shippingOptionObject.selected = true;
        }
        return (shippingOptionObject);
    }

    /**
     * Creates an error object from an unsuccessful payment request.
     * @param {Error} ex - The error returned from the unsuccessful payment request.
     * @abstract
     * @returns {Promise<ErrorObject>}
     * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/reference/digital-river-payment-objects#payment-request-details-update-error-object
     */
    async errorObject(ex) {
        const _cjs = this[_CHECKOUTJS];
        const errorMessage = await _cjs[UTIL].extractErrorMessage(ex);
        const obj = {
            status: 'failure',
            error: {
                message: errorMessage //_cjs[CONFIG].labels.error.PAYMENT_AUTHORIZATION_FAILED
            }
        };
        return (obj);
    }

    /**
     * Returns the owner properties for the payment request object.
     * @param {ShopperApi.CartDataObject} cartData
     * @abstract
     * @returns {Promise<PaymentService.OwnerDataObject>}
     * @example
     * return
     * {
     *   "firstName": "firstName",
     *   "lastName": "lastName",
     *   "email": "email@email.org",
     *   "referenceId": "testOrderID_payserv1",
     *   "address": {
     *     "line1": "1234 Fake St.",
     *     "city": "Minnetonka",
     *     "state": "MN",
     *     "country": "US",
     *     "postalCode": "55410"
     *   }
     * }
     */
    async getOwner(cartData) {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        if (cartData && cartData.cart) {
            const address = cartData.cart.billingAddress;
            let emailAddress = address.emailAddress;
            if (!emailAddress) {
                const shopper = await _util.getCache('shopper') || await _cjs[SHOPPERAPI].getShopper();
                emailAddress = shopper.shopper.emailAddress;
                await _util.setCache('shopper',shopper);
            }
            return ({
                firstName: address.firstName || '',
                lastName: address.lastName || '',
                phoneNumber: address.phoneNumber || '',
                email: emailAddress || '',
                organization: address.companyName || '',
                address: {
                    line1: address.line1 || '',
                    line2: address.line2 || '',
                    city: address.city || '',
                    state: address.countrySubdivision || '',
                    postalCode: address.postalCode || '',
                    country: address.country || ''
                },
                additionalAddressInfo: {
                    neighborhood: address.neighborhood || '',
                    division: address.division || '',
                    phoneticFirstName: address.phoneticFirstName || '',
                    phoneticLastName: address.phoneticLastName || ''
                }
            });
        }
    }
}

/**
 * @classdesc The PaymentElement class handles additional DigitalRiver.js elements e.g. credit card number, expired year/month, CVV, bank selector, etc.
 * @class PaymentElement
 * @extends Base
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} paymentType
 * @param {Payment} [payment]
 * @returns {PaymentElement}
 * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/reference/elements
 * @category PaymentBase
 */
class PaymentElement extends Base {

    constructor(parent, collection, name, payment) {
        super(parent, Object.assign({
            excludeMethods: {constructor: true},
            writableMethods: {
                createOption: true,
            }
        }, collection), name);

        if (payment) {
            Object.defineProperty(this, '_payment', {
                value: payment,
                configurable: false,
                enumerable: false,
            });
        }
    }

    /**
     * Creates the additional elements that need to be mounted on the page.
     * @param {ShopperApi.CartDataObject} cartData
     * @abstract
     * @returns {Promise<PaymentElementOptions>}
     */
    async createOption(cartData) {
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        const country = (!!cartData && !!cartData.cart.billingAddress.country) ? cartData.cart.billingAddress.country : _config.country;
        const currency = (!!cartData && !!cartData.cart.pricing.orderTotal.currency) ? cartData.cart.pricing.orderTotal.currency : _config.currency;


        let options = {
            style: _util.extend({}, _configPayment.style),
            classes: _util.extend({}, _configPayment.classes),
            [_name]: {
                country: country,
                currency: currency,
            }
        };
        _util.extend(options, _configPayment.mountElement.options);

        if(_configPayment.mountElement.required){
            _configPayment.mountElement.required.forEach((key)=>{
                if (options && (!options[_name].hasOwnProperty(key) || options[_name][key].length === 0) ) {
                    options = null;
                }
            });
        }

        return options;
    }
}
/**
 * @class Payments
 * @classdesc A container of all payments methods.
 * @extends Base
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @returns {Promise<Payments>}
 * @category PaymentBase
 */
class Payments extends Base {
    constructor(parent, collection) {
        super(parent, collection);
        const _this = this;
        return (async () => {
            return _this;
        })();
    }

    /**
     * Refer to PaymentMethods section for each payment method, e.g. {@link module:creditCard|creditCard}, {@link module:applePay|applePay}.
     * Those setting inside {@link module:Config|Config}.
     * @name this
     * @type { Object.<string, Payment> }
     * @memberOf Payments
     * @instance
     * @property {StorefrontPayment} creditCard - Credit Card Payment
     * @property {ApplePay|ApplePayWeb|ApplePayGC} applePay - Apple Pay Payment
     * @property {GooglePay|GooglePayWeb|GooglePayGC} googlePay - Google Pay Payment
     * @property {KlarnaCredit|KlarnaCreditWeb} klarnaCredit - Klarna Credit Payment
     * @property {Payment|StorefrontPayment|GlobalCommercePayment} others... - Other Payments
     * @see {@tutorial payment-support-list}
     */


    /**
     * Determines if the payment is supported or not.
     * @param {string} payment - The payment name, e.g. creditCard, googlePay.
     * @protected
     * @returns {Promise<Boolean>}
     * @example checkoutJS.payments.isSupport('creditCard');
     */
    async isSupportPayment(payment) {
        let _cjs = this[_CHECKOUTJS];
        return (!_cjs[CONFIG][PAYMENTS][payment].disable);
    }
}

export {
    Payment,
    Payments,
    PaymentElement,
    PaymentRequestPayload
};
