import {_CHECKOUTJS} from "./keywords";

/**
 * A collection of property behaviors associated with the base element.
 * @typedef BaseCollection
 * @memberOf Base
 * @type {Object}
 * @property {Object} collection - Example: { excludeMethods: {constructor: true}, writableMethods: { } }
 * @property {Object} collection.excludeMethods - Excluded properties list to Reflect.defineProperty
 * @property {Object} collection.writableMethods - Included properties list to writable property
 * @category Utility
 * @example
 * {
 *   excludeMethods: {constructor: true},
 *   writableMethods: {
 *     getValue: true,
 *     setValue: true
 *   }
 * }
 */

/**
 * @class Base
 * @classdesc The base class handles object property descriptors: writable, enumerable, configurable.
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {string} [paymentType=''] - The payment name.
 * @category Utility
 */
class Base{
    constructor(parent, {
        excludeMethods = {
            constructor: true
        },
        writableMethods = {}
    } = {},name) {
        const _this = this;
        const collection = {
            excludeMethods:excludeMethods,
            writableMethods:writableMethods
        };
        if(!parent){
            parent = this;
        }
        Base.autoBind(_this,parent,collection);
        if(name) {
            Reflect.defineProperty(this, '_name', {
                value:name,
                configurable:false,
                enumerable:false,
            });
        }
        Reflect.defineProperty(this,_CHECKOUTJS,{
            value:parent,
            configurable:false,
            enumerable:false,
        });

        return this;
        /*
        return new Proxy(this, {
            set(target,name,value) {
                const desc = Object.getOwnPropertyDescriptor(target, name);
                if(!desc || desc.writable || desc.set){
                    if (typeof value === 'function' && !Base.isIncluded(collection, 'excludeBindMethods', name)) {
                        target[name] = value.bind(parent);
                    } else {
                        target[name] = value;
                    }
                }else{
                    return false;
                }
                return true;
            }
        });
         */
    }

    static autoBind(_this,parent,collection) {
        collection = collection || {
            excludeMethods : {
                constructor: true
            },
            writableMethods : {}
        };

        let proto = Object.getPrototypeOf(_this);
        let propertyNames = Object.getOwnPropertyNames(_this);
        while(proto.constructor.name !== 'Object'){
            propertyNames = propertyNames.concat(Object.getOwnPropertyNames(proto));
            if (typeof Object.getOwnPropertySymbols === 'function') {
                propertyNames = propertyNames.concat(Object.getOwnPropertySymbols(proto));
            }
            proto = Object.getPrototypeOf(proto);
        }

        for (let name of propertyNames) {
            if ( !Base.isIncluded(collection,'excludeMethods',name)  ) {
                /*
                let desc = Object.getOwnPropertyDescriptor(_this, name);
                if( (!desc || desc.writable || desc.set) && typeof _this[name] === 'function' && !Base.isIncluded(collection, 'excludeBindMethods', name))
                {
                    _this[name] = _this[name].bind(parent);
                }
                 */
                Reflect.defineProperty(_this, name, {
                    value: _this[name],
                    enumerable: false,
                    configurable: false,
                    writable: Base.isIncluded(collection, 'writableMethods', name),
                });
            }
        }
    }

    static isIncluded(collection,type,methodName) {
        return (collection[type][methodName] === true);
    }
}

export {Base};
