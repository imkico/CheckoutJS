import {Base} from "../base";
import {_CHECKOUTJS, CONFIG, DRJS, LOGGING, PAYMENT_SERVICE, UTIL} from "../keywords";
import {extend} from "../util";

const name = 'offlinerefund';

class OfflineRefund extends Base {
    constructor(parent, collection, name = '') {
        super(parent, extend({
            excludeMethods: {constructor: true},
            writableMethods: {
                init: true,
                ready: true,
                change: true,
            }
        }, collection), name);
    }

    async init(refundToken) {
        const _this = this;
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];

        const offlineRefundElement = document.getElementById(_config.elements.offlineRefund.elementId);
        let offlineRefund = await _util.getCache(name);
        if (offlineRefundElement != null ) {
            const offlineOptions = {
                refundToken:refundToken
            };
            offlineOptions.style = _config.elements.offlineRefund.style;
            offlineRefund = _cjs.drjs.createElement(name, offlineOptions);
            _cjs.emit(LOGGING, {
                id: _util.getTime(),
                api: DRJS,
                method: 'createElement',
                type: 'options',
                payment: name,
                options: offlineOptions,
            });
            offlineRefund.mount(_config.elements.offlineRefund.elementId);
            offlineRefund.on('ready', _this.ready);

            offlineRefund.on('change', _this.change);
            await _util.setCache(name, offlineRefund);

            Object.defineProperties(_cjs[PAYMENT_SERVICE], {
                [name]: {
                    writable: true,
                    enumerable: true,
                    configurable: false
                }
            });
        }
    }

    async destroy() {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const offlineRefund = await _util.getCache(name);
        if (offlineRefund) {
            await offlineRefund.destroy();
            await _util.removeCache(name);
        }
    }

    async ready() {

    }

    async change() {

    }
}

export {
    OfflineRefund,
};
