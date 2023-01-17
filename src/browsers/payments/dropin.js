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
    REQUESTPAYLOAD,
    PAYMENT,
    CARTDATA, ELEMENT
} from "../../keywords";
import {DropinPaymentRequestPayload} from "../../payments/dropin";
import {$} from "../globalCommerce";

const document = Global.document;
const name = 'dropin';

/**
 * @class DropinWeb
 * @classdesc Klarna Credit for web storefronts.
 * @extends StorefrontPayment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType='dropin'] - e.g. 'dropin'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {DropinWeb}
 * @category PaymentMethods
 */
class DropinWeb extends StorefrontPayment {

    constructor(parent, collection, _name, storefront) {
        super(parent, collection, name, storefront);
        /**
         * The DropinPaymentRequestPayload created for Dropin.
         * @name requestPayload
         * @type DropinPaymentRequestPayload
         * @memberof DropinWeb
         * @instance
         */
        this[REQUESTPAYLOAD] = new DropinPaymentRequestPayload(parent, {}, name, this);
    }

    /**
     * Creates the Dropin elements on the current page.
     * @returns {Promise<void>}
     */
    async createElements() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _util = _cjs[UTIL];
        const _drjs = _cjs[DRJS];
        //const _element = _this[ELEMENT];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        const _storefront = _this._storefront;
        //const _payments = await _storefront.getPayments();

        if(_configPayment.mountElement && !_configPayment.mountElement.disabled) {
            const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
            const _storefront = _this._storefront;
            const _payments = await _storefront.getPayments();
            const supportedGeography = await _payments[_name].supportedGeography(cartData.cart.billingAddress.country);

            if(supportedGeography && cartData && cartData.cart.paymentSession ) {
                const elementsObj = {};
                let elements = _configPayment.mountElement.elements;
                let keys = Object.keys(elements);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if(elements[key].disable!==true) {
                        const elementPlacement = document.getElementById(elements[key].id);
                        if (elementPlacement && elementPlacement!==null) {
                            let configuration = await _this[REQUESTPAYLOAD].createObject(cartData);
                            if (configuration) {
                                configuration.onSuccess = async (data) => {
                                    await _util.loadingOverlay();
                                    const source = await _this.createSource(data);
                                    if(source) {
                                        await _this.completeSourceId(source);
                                        await _this.destroy();
                                    }
                                    await _util.loadingOverlay(true);
                                };
                                configuration.onCancel = async (data) => {
                                    await _this.cancel(data);
                                };
                                configuration.onError = async (data) => {
                                    _util.errorMessage(data);
                                };
                                configuration.onReady = async (data) => {
                                    await _this.ready(data);
                                };
                                const element = _drjs.createDropin(configuration);
                                element.mount(elementPlacement);
                                elementsObj[key] = element;
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
        }
    }

    async createSource(result) {
        //const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const source = result.source;
        const _shopperApi = _cjs[SHOPPERAPI];
        const _storefront = this._storefront;
        if (source && source.id) {
            source.createdType = name;
            const _source = await _storefront.validateSource(source);
            if(_source) {
                const _name = _source.type;
                _cjs.emit(LOGGING, {
                    id: _util.getTime(),
                    api: DRJS,
                    method: 'createSource',
                    type: 'options',
                    payment: _name,
                    options: _source,
                });
                await _util.setValue(PAYMENT, {name: _name, result: result});
                await _util.setValue(`${PAYMENT}_CREATEDTYPE`, {name:name, id:source.id});
                const response = await _shopperApi.applySourceToCart(_source.id);
                return _source;
            }
        }
    }

    async validateElements() {
        const _cjs = this[_CHECKOUTJS];
        const _configPayment = _cjs[CONFIG][PAYMENTS][name];
        //TODO: fix status
        return !_configPayment.element;
    }

    async supportedSettings() {
        //const _this = this;
        const _cjs = this[_CHECKOUTJS];
        //const _name = this._name;
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        if( !(cartData && cartData.cart.paymentSession) ) {
            return false;
        }
        return true;
    }

    async destroy() {
        const _cjs = this[_CHECKOUTJS];
        //const _util = _cjs[UTIL];
        const _configPayment = _cjs[CONFIG].payments[name];
        if(_configPayment.mountElement) {
            let _element = await _cjs[UTIL].getCache(name);
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
                    await _cjs[UTIL].removeCache(name);
                }
                if (_configPayment.mountElement.elements && _configPayment.mountElement.elements[name].id) {
                    const elementPlacement = document.getElementById(_configPayment.mountElement.elements[name].id);
                    if (elementPlacement && elementPlacement !== null) {
                        elementPlacement.innerHTML = '';
                    }
                }
                // eslint-disable-next-line no-empty
            } catch (ex) {
                console.error(ex);
            }
        }
        _configPayment.show = false;
        _configPayment.element = null;
    }

}


class DropinGC extends DropinWeb {

    constructor(parent, collection) {
        super(parent, Object.assign({
            excludeMethods: {constructor: true},
            writableMethods: {
                initPaymentBefore: true,
                updatePaymentContainer: true,
            }
        }, collection), name, 'gC');
        return this;
    }

    async initPaymentBefore() {
        const _this = this;
        const _cjs = _this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _name = this._name;
        const _configPayment = _config[PAYMENTS][_name];
        const _selector = _config.selector;
        let _paymentType = await _cjs.gC._getBasePaymentType(_config.cloudPayPayload);
        const isConfirmOrder = _config.page.indexOf('ConfirmOrderPage') > 0;
        if (_paymentType===name && isConfirmOrder) {
            const $paymentContainer = $(_selector.confirmOrder.paymentContainer);
            $paymentContainer.parent().removeClass("col-md-4").addClass("col-md-12");
            $paymentContainer.find(">p:first").hide();
        }

        if(_configPayment.removePaymentContainer) {
            if(isConfirmOrder) {
                const $termsOfSaleAcceptance = $(_selector.confirmOrder.termsOfSaleAcceptance);
                $(`<p id='drjs_${_name}Element'></p>`).insertBefore($termsOfSaleAcceptance);
            }else {
                const $paymentContainer = $(_selector.payment.paymentContainer);
                $paymentContainer.remove();
            }
        }
    }

    async completeSourceId(source) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        //const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        let _paymentType = await _cjs.gC._getBasePaymentType(_config.cloudPayPayload);
        if(_paymentType===name && _config.page.indexOf('ConfirmOrderPage')>0) {
            await _this.updatePaymentContainer(source);
        }
        return (source);
    }

    async updatePaymentContainer(source) {
        //const _this = this;
        const _cjs = this[_CHECKOUTJS];
        //const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _name = source.type;
        const _selector = _config.selector;
        //const _configPayment = _config[PAYMENTS][_this._name];
        const paymentContainer$ = $(_selector.confirmOrder.paymentContainer);
        paymentContainer$.find(">p:first").show();
        let paymentName = _name;
        try {
            const attr = await _shopperApi.getText("PMS_" + _name.toUpperCase() + "_NAME");
            if (attr.attribute && attr.attribute.value) {
                paymentName = attr.attribute.value;
            }
        }catch(ex) {
            console.error(ex);
        }
        paymentContainer$.find(">p:first").text(paymentName);
        /*
        const url = _util.parseURL(_config.drUrl);
        const confirmOrderUrl = _cjs[UTIL].format(_config.url.confirmOrder, {
            domain: url.hostname,
            siteId: _config.siteId
        });
        await $.ajax({
            url:confirmOrderUrl
        }).done((html)=>{
            let paymentContainer$ = $(html).find(_selector.confirmOrder.paymentContainer);
            $(_selector.confirmOrder.paymentContainer).replaceWith(paymentContainer$);
        });
         */
    }
}
export {
    DropinWeb,
    DropinGC
}
