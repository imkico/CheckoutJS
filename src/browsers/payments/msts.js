import {requireFieldUpdate, StorefrontPayment} from "../payment";
import {
    _CHECKOUTJS, CARTDATA, CONFIG, DRJS, ELEMENT, PAYMENTS,
    REQUESTPAYLOAD, SHOPPERAPI, UTIL,
} from "../../keywords";
import {MstsPaymentRequestPayload} from "../../payments/msts";
import {extend, Global} from "../../util";

const name = 'msts';

/**
 * @class MstsWeb
 * @classdesc Msts for web storefronts.
 * @extends StorefrontPayment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType='msts'] - e.g. 'msts'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {MstsWeb}
 * @category PaymentMethods
 */
class MstsWeb extends StorefrontPayment {

    constructor(parent, collection, _name, storefront) {
        super(parent, extend({
            writableMethods: {
                createFields: true,
                createEnrollButton: true,
                getMarketingName: true,
                getClientReferenceId: true,
                getPoNumber:true,
                getNotes:true
            }
        },collection), name, storefront);
        /**
         * The MstsPaymentRequestPayload created for Msts.
         * @name requestPayload
         * @type MstsPaymentRequestPayload
         * @memberof MstsWeb
         * @instance
         */
        this[REQUESTPAYLOAD] = new MstsPaymentRequestPayload(parent, {}, name, this);
        this[REQUESTPAYLOAD].getPoNumber = this.getPoNumber;
        this[REQUESTPAYLOAD].getNotes = this.getNotes;
    }

    async createElements() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        //const _util = _cjs[UTIL];
        //const _drjs = _cjs[DRJS];
        //const _element = _this[ELEMENT];
        //const _shopperApi = _cjs[SHOPPERAPI];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        if(_configPayment.mountElement && !_configPayment.mountElement.disabled) {
            await _this.createFields();
        }else if(_configPayment.showEnrollButton){
            await _this.createEnrollButton();
            if (_configPayment.mountElement.required) {
                _configPayment.mountElement.required.forEach(function (key) {
                    _cjs.on(key + 'Updated', requireFieldUpdate, _this);
                });
            }
        }
    }

    async createFields() {
        //const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _util = _cjs[UTIL];
        //const _drjs = _cjs[DRJS];
        //const _element = _this[ELEMENT];
        //const _shopperApi = _cjs[SHOPPERAPI];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        const element = document.getElementById(`drjs_${_name}Element`);
        if (element) {
            let template = _util.format(_util.getTemplateValue(_configPayment.fieldsTemplate), _configPayment);
            element.innerHTML = template;
        }
    }

    async createEnrollButton(options) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _util = _cjs[UTIL];
        //const _drjs = _cjs[DRJS];
        //const _element = _this[ELEMENT];
        //const _shopperApi = _cjs[SHOPPERAPI];
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];

        const _options = _util.extend({
            template: _configPayment.enrollBtnTemplate
        }, options);
        const element = document.getElementById(`drjs_${_name}Element`);
        const enrollLink= await _this.getEnrollLink();
        let enrollHTML = '';
        if (enrollLink) {
            let template = _util.format(_util.getTemplateValue(_options.template), extend({
                enrollLink: enrollLink,
            },_configPayment,_options));
            enrollHTML = template;
        }
        if(element) {
            element.innerHTML = enrollHTML;
        }

        return enrollHTML;
    }

    async supportedSettings() {
        //const _this = this;
        const _cjs = this[_CHECKOUTJS];
        //const _name = this._name;
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        if( cartData &&
            cartData.cart.billingAddress.country &&
            cartData.cart.billingAddress.country.length>0 &&
            cartData.cart.shippingAddress.country &&
            cartData.cart.shippingAddress.country.length>0 &&
            cartData.cart.billingAddress.country !== cartData.cart.shippingAddress.country
        ) {
            return false;
        }
        return true;
    }

    async getPoNumber() {
        const element = document.getElementById(`drjs_poNumber`);
        if (element) {
            return element.value;
        }
    }

    async getNotes() {
        const element = document.getElementById(`drjs_notes`);
        if (element) {
            return element.value;
        }
    }

    async getClientReferenceId() {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const uuid = _util.getUUID();
        return uuid;
    }

    async getMarketingName() {
        //const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const currency = _cjs[CONFIG].currency;
        const _shopperApi = _cjs[SHOPPERAPI];
        const _util = _cjs[UTIL];
        const _configPayment = _cjs[CONFIG].payments[name];
        let country = _cjs[CONFIG].country;
        let cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        if(cartData) {
            country = cartData.cart.billingAddress.country;
        }
        let key= `${country}-${currency}`;
        let marketingName = null;
        if(_configPayment.marketingName && _configPayment.marketingName.trim().length) {
            const marketingNameList = _configPayment.marketingName.split(';');
            for (let i = 0; i < marketingNameList.length; i++) {
                const item = marketingNameList[i];
                if(item.startsWith(key+'=')){
                    marketingName = item.split('=')[1];
                    break;
                }
            }
        }
        return marketingName;
    }

    async getEcommerceUrl() {
        return '';
    }

    async getEnrollLink() {
        const _this = this;
        //const _cjs = this[_CHECKOUTJS];
        //const _configPayment = _cjs[CONFIG].payments[name];
        const clientReferenceId = await _this.getClientReferenceId();
        const marketingName = await _this.getMarketingName();
        if(marketingName && clientReferenceId) {
            let link = `https://${marketingName}.b2b.credit/apply?client_reference_id=${clientReferenceId}`;
            const ecommerceUrl = (await _this.getEcommerceUrl()) || '';
            if(ecommerceUrl && ecommerceUrl.length) {
                link+= `&ecommerce_url=${encodeURIComponent(ecommerceUrl)}`;
            }
            return link;
        }
    }

}

export {
    MstsWeb
}
