import {ApplePay} from "../payments/applePay";
import {GooglePay} from "../payments/googlePay";
import {PayPal} from "../payments/payPal";
import {Payments, Payment} from "../payments/payment";
import {CONFIG, UTIL, PAYMENTS} from "../keywords";

class NodePayments extends Payments {
    constructor(parent, collection) {
        super(parent, collection);
        return (async () => {
            parent.payments = await this;
            await parent.payments._createPayments(parent);
            return this;
        })();
    }

    async _createPayments(parent) {
        const _cjs = parent;
        for (let payment in _cjs[CONFIG][PAYMENTS]) {
            if (!_cjs[CONFIG][PAYMENTS][payment].disable) {
                try {
                    switch (payment) {
                        case 'applePay':
                            _cjs[PAYMENTS][payment] = new ApplePay(_cjs);
                            break;
                        case 'googlePay':
                            _cjs[PAYMENTS][payment] = new GooglePay(_cjs);
                            break;
                        // case 'directDebit':
                        //     _cjs[PAYMENTS][payment] = new DirectDebit(_cjs);
                        //     break;
                        case 'payPal':
                            _cjs[PAYMENTS][payment] = new PayPal(_cjs);
                            break;
                        default:
                            _cjs[PAYMENTS][payment] = new Payment(_cjs,{},payment);
                            break;
                    }
                    const prop = {};
                    prop[payment] = {
                        writable: true,
                        enumerable:  _cjs[CONFIG][PAYMENTS][payment].enumerable!==false,
                        configurable: false
                    };
                    Object.defineProperties(_cjs[PAYMENTS], prop);
                }catch(ex){
                    await _cjs[UTIL].errorMessage(ex);
                }
            }
        }
    }
}

export {
    NodePayments
};
