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
    CARTDATA
} from "../../keywords";
import {$} from "../globalCommerce";

const document = Global.document;
const name = 'creditCard';

/**
 * @class CreditCardWeb
 * @classdesc Credit Card for web storefronts.
 * @extends StorefrontPayment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType='creditCard'] - e.g. 'creditCard'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {CreditCardWeb}
 * @category PaymentMethods
 */
class CreditCardWeb extends StorefrontPayment {

    constructor(parent, collection, _name, storefront) {
        super(parent, collection, name, storefront);
    }

    async initPayment() {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _configCreditCard = _cjs[CONFIG][PAYMENTS][name];
        const _drjs = _cjs[DRJS];
        const cardNumberElement = document.getElementById(_configCreditCard.elementId.cardNumber);
        const cardExpirationElement = document.getElementById(_configCreditCard.elementId.cardExpiration);
        const cardCvvElement = document.getElementById(_configCreditCard.elementId.cardCvv);
        let creditCard = await _util.getCache(name);
        if (cardNumberElement && cardExpirationElement && cardCvvElement) {
            const options = {
                style: _configCreditCard.style,
                classes: _configCreditCard.classes,
            };
            creditCard = {
                cardNumber: _drjs.createElement('cardnumber', options),
                cardExpiration: _drjs.createElement('cardexpiration', options),
                cardCVV: _drjs.createElement('cardcvv', options)
            };
            _cjs.emit(LOGGING, {
                id: _util.getTime(),
                api: DRJS,
                method: 'createElement',
                type: 'options',
                payment: name,
                options: options,
            });
            await _util.setCache(name, creditCard);

            creditCard.cardNumber.mount(_configCreditCard.elementId.cardNumber);
            creditCard.cardExpiration.mount(_configCreditCard.elementId.cardExpiration);
            creditCard.cardCVV.mount(_configCreditCard.elementId.cardCvv);

            _configCreditCard.show = true;
            Object.defineProperty(_configCreditCard, 'element', {
                value: creditCard,
                enumerable: true,
                configurable: false,
                writable: true,
            });
            return creditCard;
        }
    }

    async applySourceId() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const _name = this._name;
        const _payment = await _util.getValue(PAYMENT) || {};
        let cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        if (_cjs[CONFIG][PAYMENTS][name].show && (_payment.name !== _name || !_payment.result)) {
            const sourceData = await _this[REQUESTPAYLOAD].createObject(cartData);
            const creditCard = await _util.getCache(name);
            const result = await _cjs[DRJS].createSource(creditCard.cardCVV, sourceData);
            await _util.setValue(PAYMENT, {name: name, result: result});
            _cjs.emit(LOGGING, {
                id: _util.getTime(),
                api: DRJS,
                method: 'createSource',
                type: 'options',
                payment: _name,
                options: result,
            });
            if (result.error) {
                return Promise.reject(result);
            } else if (result.source) {
                const source = result.source;
                await _shopperApi.applySourceToCart(source.id);
                return source;
            }
        }
    }

    async validateElements() {
        const _cjs = this[_CHECKOUTJS];
        const _configPayment = _cjs[CONFIG][PAYMENTS][name];
        const _element = _configPayment.element;
        if (_element && _element.cardnumber.parentNode && _element.cardexpiration.parentNode && _element.cardcvv.parentNode) {
            return (
                _configPayment.element.cardnumber.parentNode.classList.contains(_configPayment.classes.complete) &&
                _configPayment.element.cardexpiration.parentNode.classList.contains(_configPayment.classes.complete) &&
                _configPayment.element.cardcvv.parentNode.classList.contains(_configPayment.classes.complete)
            );
        }
        return true;
    }

    async destroy() {
        const _cjs = this[_CHECKOUTJS];
        const creditCard = await _cjs[UTIL].getCache(name);
        const _configPayment = _cjs[CONFIG][PAYMENTS][name];
        try {
            if (creditCard) {
                if (creditCard.cardNumber) {
                    await creditCard.cardNumber.destroy();
                }
                if (creditCard.cardExpiration) {
                    await creditCard.cardExpiration.destroy();
                }
                if (creditCard.cardCVV) {
                    await creditCard.cardCVV.destroy();
                }
                await _cjs[UTIL].removeCache(name);
            }
            // eslint-disable-next-line no-empty
        } catch (ex) {
        }

        _configPayment.show = false;
        _configPayment.element = null;
    }
}

/**
 * @class CreditCardGC
 * @classdesc Credit Card for Global Commerce storefronts.
 * @extends StorefrontPayment
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType='creditCard'] - e.g. 'creditCard'
 * @param {string} [storefrontType='storefront'] - e.g. 'storefront' / 'gC'
 * @returns {CreditCardGC}
 * @category PaymentMethods
 */
class CreditCardGC extends StorefrontPayment {

    constructor(parent, collection) {
        super(parent, collection, name, 'gC');
    }

    async initPayment() {
        //const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _util = _cjs[UTIL];
        const $paymentMethodID = $("#CreditCardMethod,#CurrencySpecificCreditCardMethod");
        const _configPayment = _cjs[CONFIG][PAYMENTS][name];
        if ($paymentMethodID.length) {
            if (!_configPayment.remainElements) {
                $('#ccNum').siblings('.infield-label').remove();
                $('#ccNum,#ccMonth,#ccYear').each((index,item)=>{
                    $(_cjs[CONFIG].selector.checkoutForm).prepend('<input type="hidden" name="'+$(item).attr('name')+'" />');
                });
                $('#ccNum').replaceWith($('<span/>').attr('id', _configPayment.mountElement.elements.cardnumber.id));
                $('#ccMonth').replaceWith($('<span/>').attr('id', _configPayment.mountElement.elements.cardexpiration.id));
                $('#cardSecurityCode').replaceWith($('<span/>').attr('id', _configPayment.mountElement.elements.cardcvv.id));
                $('#ccYear').remove();
            } else {
                $('#ccNum').change(function () {
                    if ($(this).val().indexOf('*') === -1) {
                        $paymentMethodID.removeAttr('data-source-id');
                        _util.setValue(PAYMENT, {name: _name});
                    }
                });
            }
            _configPayment.show = true;
        }
        const result = await _cjs[PAYMENTS][name].initPayment.call(this);

        if (_configPayment.element && _configPayment.element.cardnumber) {
            _configPayment.element.cardnumber.on('change', function () {
                $paymentMethodID.removeAttr('data-source-id');
                _util.setValue(PAYMENT, {name: _name});
            });
        }
        return result;
    }

    async applySourceId(applyToCart = false) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _name = this._name;
        const _configPayment = _cjs[CONFIG][PAYMENTS][_name];
        const _util = _cjs[UTIL];
        const _payment = await _cjs[UTIL].getValue(PAYMENT) || {};
        if (
            //!($('#ccNum').val().indexOf('*')!==-1 && $(_cjs[CONFIG].selector.checkoutForm).find(_cjs[CONFIG].selector.cloudPaySourceId).val()!=='')
            _configPayment.show && (_payment.name !== _name || !_payment.result)
        ) {
            if (!_configPayment.remainElements) {
                return await _cjs[PAYMENTS][_name].applySourceId.call(_this,applyToCart);
            } else {
                let sourceData = {};
                const owner = await _cjs.gC.getBillingAddress();
                const creditCard = await _this.getCreditCard();
                sourceData = _util.extend(sourceData, {owner: owner});
                sourceData = _util.extend(sourceData, creditCard);
                const result = await _cjs.gC.createSourceToCloudPay(_name, sourceData);
                return result;
            }
        }
    }

    async validateElements() {
        const _cjs = this[_CHECKOUTJS];
        const _configPayment = _cjs[CONFIG][PAYMENTS][name];
        const _element = _configPayment.element;
        if (_element && _element.cardnumber?.parentNode && _element.cardexpiration?.parentNode && _element.cardcvv?.parentNode) {
            return (
                _configPayment.element.cardnumber.parentNode.classList.contains(_configPayment.classes.complete) &&
                _configPayment.element.cardexpiration.parentNode.classList.contains(_configPayment.classes.complete) &&
                _configPayment.element.cardcvv.parentNode.classList.contains(_configPayment.classes.complete)
            );
        }
        return true;
    }

    async createPaymentInfo() {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _name = this._name;
        const $paymentMethodID = $("#CreditCardMethod,#CurrencySpecificCreditCardMethod,#dr_ExpandPaymentDetailsSwitchSolo");
        let _payment = (await _util.getValue(PAYMENT) || _cjs[CONFIG].cloudPayPayload);
        $("#dr_switchSoloSelect").remove(); //#billingNickDiv,#dr_ccMethodSelect,#dr_switchSoloSelect
        $paymentMethodID.attr("data-type", name);
        if (_payment.type === name) {
            $('#ccNum').val('************' + _payment.details.lastFourDigits);
            $('#ccMonth').val(_payment.details.expirationMonth);
            $('#ccYear').val(_payment.details.expirationYear);
            $paymentMethodID.attr('data-source-id', _payment.id).trigger('click');
        } else {

            if (Object.keys(_payment).length === 0) {
                _payment = (await _cjs[UTIL].getValue(PAYMENT) || {});
            }
            if (_payment && (_payment.type === _name || _payment.name === _name)) {
                const source = (_payment && _payment.result && _payment.result.source) ? _payment.result.source : _payment;
                if (source && source.id) {
                    $paymentMethodID.attr('data-source-id', source.id);
                }
                $paymentMethodID.trigger('click');
            }
        }
    }

    async getCreditCard() {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _shopperApi = _cjs[SHOPPERAPI];
        const cartData = await _util.getValue(CARTDATA) || await _shopperApi.getCart();
        try {
            const paymentRequestData = _this.createObject(cartData);
            _util.extend(paymentRequestData,{
                creditCard: {
                    number: $('#ccNum').val(),
                    expirationMonth: $('#ccMonth').val(),
                    expirationYear: $('#ccYear').val(),
                    cvv: $('#cardSecurityCode').val()
                }
            });
        } catch (ex) {
            return Promise.reject(ex);
        }
    }
}

export {
    CreditCardGC
}
