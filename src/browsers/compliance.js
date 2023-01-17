import {Base} from "../base";
import {_CHECKOUTJS, CONFIG, DRJS, LOGGING, PAYMENT_SERVICE, UTIL} from "../keywords";
import {extend} from "../util";

const name = 'compliance';

class Compliance extends Base {
    constructor(parent, collection, name = '') {
        super(parent, extend({
            excludeMethods: {constructor: true},
            writableMethods: {
                init: true,
            }
        }, collection), name);
    }

    async init() {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        const _config = _cjs[CONFIG];

        const complianceElement = document.getElementById(_config.elements.compliance.elementId);
        let compliance = await _util.getCache(name);
        if (complianceElement != null && !compliance) {
            const complianceOptions = {
                compliance: {
                    locale: _config.locale,
                    entity: _config.entity.code,
                }
            };
            complianceOptions.classes = _config.elements.compliance.classes;
            compliance = _cjs.drjs.createElement(name, complianceOptions);
            _cjs.emit(LOGGING, {
                id: _util.getTime(),
                api: DRJS,
                method: 'createElement',
                type: 'options',
                payment: name,
                options: complianceOptions,
            });
            compliance.mount(_config.elements.compliance.elementId);
            await _util.setCache(name, compliance);

            _cjs.on('entityUpdate', function (entityData) {
                if (!entityData) {
                    entityData = _config.entity;
                }
                complianceOptions.compliance.locale = _config.locale;
                complianceOptions.compliance.entity = entityData.code;
                compliance.update(complianceOptions);
            });

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
        const compliance = await _util.getCache(name);
        if (compliance) {
            await compliance.destroy();
            await _util.removeCache(name);
        }
    }
}

export {
    Compliance,
};
