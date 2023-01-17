import {Util, Global, extend} from '../util';
import {LOGGING, _CHECKOUTJS, DRJS, CONFIG, UTIL, SHOPPER, SHOPPERAPI} from '../keywords';
import {ShopperGC, ConfigGC, $} from "./globalCommerce";
import {Shopper} from "../shopper";

const document = Global.document;
const loadScriptPromise = {};
/**
 * @class BrowserUtil
 * @classdesc A collection of utilities for the browser.
 * @extends Util
 * @param {CheckoutJS} parent
 * @param {Base.BaseCollection} [collection]
 * @param {Session} [session]
 * @category Utility
 */
class BrowserUtil extends Util {

    constructor(parent, collection, session) {
        super(parent, extend({
            excludeMethods: {constructor: true},
            excludeBindMethods: {
                loadScript: true,
                loadCss: true,
                axios: true,
            },
            writableMethods: {
                loadScript: true,
                loadCss: true,
                log: true,
                errorMessage: true,
                axios: true,
                error: true,
                setCookie: true,
                getCookie: true
            }
        }, collection), session ? session : Global.sessionStorage);
    }

    static getCurrentScript() {
        if (document.currentScript) {
            return document.currentScript;
        }
        const scripts = document.scripts || document.getElementsByTagName('script'); // Live NodeList collection
        try {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error();
        } catch (err) {
            // eslint-disable-next-line no-useless-escape
            let i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];
            for (i in scripts) {
                if (scripts[i].src === res || scripts[i].readyState === "interactive") {
                    return scripts[i];
                }
            }
            return document.getElementById('dr_checkoutjs');
        }
    }

    async log() {
        const _cjs = this[_CHECKOUTJS];
        const _config = _cjs[CONFIG];
        const _log = _config.debug ? console.log.bind(Global.console) : Global.console.log;
        if(_config.consoleLog) {
            if (typeof arguments[0] == 'string' && arguments[0].indexOf(':')) {
                let args = arguments[0].split(':');
                if (args.length === 1) {
                    arguments[0] = '%c' + args[0];
                    Array.prototype.splice.call(arguments, 1, 0, 'color: blue; text-transform: capitalize');
                } else if (args.length === 2) {
                    arguments[0] = '%c' + args[0] + ': %c' + args[1];
                    Array.prototype.splice.call(arguments, 1, 0, 'color: blue; text-transform: capitalize', 'color: green; ');
                }
            }
            _log.apply(_cjs, arguments);
        }
    }

    async setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            if (!days) days = 1 / 24;
            date.setTime(date.getTime() + (days * 24 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    async getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
    }

    async eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

    async errorMessage(msg) {
        const _cjs = this[_CHECKOUTJS];
        const _error = _cjs[CONFIG].debug ? console.error.bind(Global.console) : Global.console.error;
        _error.apply(_cjs, arguments);
        const errorJson = JSON.stringify(msg, _cjs[UTIL].replaceErrors, 2);
        let errorMessage = await this.extractErrorMessage(msg);
        if (!errorMessage || errorMessage.length === 0) {
            errorMessage = msg;
        }
        let errorId = await this.extractErrorId(msg);
        _cjs.emit(LOGGING, {
            id: _cjs[UTIL].getTime(),
            api: DRJS,
            method: 'error',
            responseBody: errorJson
        });
        if (_cjs[CONFIG].page.length && $) {
            if ($().modal) {
                let template = _cjs[UTIL].format($(_cjs[CONFIG].template.error).html(), {
                    error: errorMessage,
                    errorJson: errorJson,
                    errorId: errorId,
                    close: _cjs[CONFIG].labels.CLOSE
                });
                $('body').append(template);
                $(_cjs[CONFIG].selector.errorModal).on('hidden.bs.modal', function () {
                    $(_cjs[CONFIG].selector.errorModal).remove();
                }).modal('show');
            } else {
                alert(errorMessage);
            }
        }
    }

    async updateConfig(url, refresh) {
        const _cjs = this[_CHECKOUTJS];
        const _util = _cjs[UTIL];
        if (_cjs[CONFIG].drCheckoutJS !== false) {
            const options = _util.extend({}, _cjs[CONFIG].apiOption, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: refresh ? "post" : "get",
                data: `locale=${_cjs[CONFIG].locale}&currency=${_cjs[CONFIG].currency}`,
                url: url,
                params: {},
                withCredentials: true
            });
            const log = {
                id: _util.getTime(),
                api: 'util',
                method: 'updateConfig',
                requestParams: options.params,
                requestBody: options.data,
                type: 'post',
                url: options.url
            };
            _cjs.emit(LOGGING, log);
            try {
                const response = await _cjs[UTIL].axios(options);
                if (response) {
                    if (response.data) {
                        const _cfg = response.data;
                        if (_cfg && typeof _cfg.apiKey === 'object' && _cfg.apiKey.apiKey && typeof _cfg.apiKey.apiKey === 'string' ) {
                            _util.extend(_cfg, _cfg.apiKey);
                        }
                        if (_cfg && _cfg.locale && _cfg.currency) {
                            await _cjs[SHOPPER].setShopper({
                                locale: _cfg.locale,
                                currency: _cfg.currency,
                                //isAuthenticated: _cfg.isAuthenticated,
                            });
                        }
                        log.responseBody = response.data;
                        _cjs.emit(LOGGING, log);
                        return _cfg;
                    }
                }
            } catch (ex) {
                return Promise.reject(ex);
            }
        }
    }

    async loadScript(url) {
        if(loadScriptPromise.hasOwnProperty(url)) return loadScriptPromise[url];

        const head = document.getElementsByTagName("head")[0] || document.documentElement;
        const script = document.createElement("script");

        script.setAttribute("async", "true");
        script.setAttribute("charset", "utf-8");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", url);
        const _promise = new Promise(function (resolve) {
            let done = false;
            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState ||
                    this.readyState === "loaded" ||
                    this.readyState === "complete")) {
                    done = true;

                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                    if (head && script.parentNode) {
                        head.removeChild(script);
                    }
                    resolve();
                }
            };
            head.appendChild(script);
        });
        loadScriptPromise[url] = _promise;
        return _promise;
    }

    async loadCss(url) {
        const head = document.getElementsByTagName("head")[0] || document.documentElement;
        const link = document.createElement("link");

        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", url);
        return new Promise(function (resolve) {
            let done = false;
            link.onload = link.onreadystatechange = function () {
                if (!done && (!this.readyState ||
                    this.readyState === "loaded" ||
                    this.readyState === "complete")) {
                    done = true;
                    resolve();
                }
            };
            head.appendChild(link);
        });
    }

    async loadingOverlay(close, redirectOverlay) {
        if (!close) {
            const _cjs = this[_CHECKOUTJS];
            redirectOverlay = redirectOverlay || _cjs[UTIL].extend({}, _cjs[CONFIG].redirectOverlay);
            let overlay = document.getElementById(redirectOverlay.id);
            if(!overlay) {
                overlay = document.createElement('div');
                overlay.id = redirectOverlay.id;
                const container = document.createElement('div');
                container.className = "drjs_iframe";
                const style = document.createElement('style');
                style.innerHTML = redirectOverlay.inlineStyle;
                overlay.append(style);
                const iframe = document.createElement('iframe');
                iframe.src = _cjs[CONFIG].url.paymentCallBack;
                container.append(iframe);

                const message = function (e) {
                    if (e.data && e.data.close) {
                        complete(overlay);
                    }
                };
                Global.addEventListener('message', message, false);

                overlay.append(container);
                document.body.append(overlay);

                const complete = function (overlay) {
                    overlay.parentNode.removeChild(overlay);
                    Global.removeEventListener('message', message);
                };
            }
        } else {
            Global.postMessage({
                close: true
            }, '*');
        }
    }

    async _initConfig(cfg) {
        const _cjs = this[_CHECKOUTJS];
        const _shopperApi = _cjs[SHOPPERAPI];
        const currentScript = BrowserUtil.getCurrentScript.call(_cjs);
        const siteId = currentScript.getAttribute("data-siteid");
        const config = currentScript.getAttribute("data-config");

        if (currentScript && siteId) {
            _cjs[CONFIG].siteId = siteId;
        }
        if (currentScript && currentScript.src) {
            _cjs[CONFIG]._src = currentScript.src;
        }
        let _config = null;
        if (!cfg && config) {
            _config = config.trim();
        } else if (typeof cfg === 'string') {
            _config = cfg.trim();
        }
        let _cfg = {};
        if (_config) {
            if (typeof _config === 'string') {
                try {
                    if (_config.startsWith('{')) {
                        _cfg = JSON.parse(_config);
                        if(_cfg._debug) _cfg.debug = true;
                    }
                } catch (e) {
                    console.error(_config, e);
                }
                if (Object.keys(_cfg).length === 0 && _cjs[CONFIG].siteId.length === 0) {
                    let urlParam = _cjs[UTIL].parseURL(_config).path.split('/');
                    if (urlParam && urlParam[1] === 'store' && urlParam.length >= 2) {
                        _cjs[CONFIG].siteId = urlParam[2];
                    }
                }
            }
        }
        /**
         * The current shopper instance.
         * @name shopper
         * @type Shopper|ShopperGC
         * @memberof CheckoutJS
         * @see {@link Shopper}
         * @see {@link ShopperGC} - for Global Commerce hosted sites
         * @instance
         * @readonly
         */
        if (_cjs[UTIL].isGCPage(_cfg)) {
            _cfg = _cjs[UTIL].extend(ConfigGC, _cfg);
            await new ShopperGC(_cjs);
        } else {
            await new Shopper(_cjs);
        }
        if (_cfg && _cfg.locale && _cfg.currency) {
            await _cjs[SHOPPER].setShopper({
                locale: _cfg.locale,
                currency: _cfg.currency,
                isAuthenticated: !!_cfg.isAuthenticated,
            });
        }
        if (_config && typeof _config === 'string' && _cjs[CONFIG].apiKey.length === 0 && Object.keys(_cfg).length === 0) {
            _cfg = await _cjs[UTIL].updateConfig(_config);
        }
        return Promise.resolve(_cfg);
    }

    static async ready(cb) {
        return new Promise(function (resolve) {
            if (Global.document.readyState === 'complete') {
                cb().then(resolve);
            } else {
                Global.document.addEventListener('readystatechange', () => {
                    if (Global.document.readyState === 'complete') {
                        cb().then(resolve);
                    }
                });
            }
        });
    }

    async formHelper(path, params, method = 'post') {
        const form = document.createElement('form');
        form.method = method;
        form.action = path;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }

    async encryptPayload(text) {
        const _cjs = this[_CHECKOUTJS];
        const AESKey = _cjs[CONFIG].encryptionKey;
        if (!Global.GibberishAES) {
            await _cjs[UTIL].loadScript(_cjs[CONFIG].lib.gibberishAES.url);
        }
        if (typeof text === 'object') {
            text = JSON.stringify(text).trim();
        }
        Global.GibberishAES.size(128);
        const key = Global.GibberishAES.s2a(AESKey, false);
        const iv = Global.GibberishAES.s2a(AESKey, false);
        const plaintext = Global.GibberishAES.s2a(text, false);
        const result = Global.GibberishAES.Base64.encode(Global.GibberishAES.rawEncrypt(plaintext, key, iv));
        return result;
    }

    async jsonp(url, options) {
        options = options || {};

        const prefix = options.prefix || '_';
        const params = options.params || {};
        const callback = options.callback || 'callback';
        const timeout = options.timeout ? options.timeout : 15000;
        const target = document.getElementsByTagName('script')[0] || document.head;
        let script;
        let timer;
        let cleanup;
        let promise;

        const id = prefix + (new Date().getTime());

        cleanup = function () {

            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
            }

            Global[id] = null;

            if (timer) {
                clearTimeout(timer);
            }
        };

        promise = new Promise(function (resolve, reject) {
            if (timeout) {
                timer = setTimeout(function () {
                    cleanup();
                    reject(new Error('Timeout - ' + url));
                }, timeout);
            }

            Global[id] = function (data) {
                cleanup();
                resolve(data);
            };

            Object.getOwnPropertyNames(params).forEach(function (key) {
                url += (~url.indexOf('?') ? '&' : '?') + key + '=' + encodeURIComponent(params[key]);
            });

            url += (~url.indexOf('?') ? '&' : '?') + callback + '=' + encodeURIComponent(id);
            url = url.replace('?&', '?');

            script = document.createElement('script');
            script.src = url;
            target.parentNode.insertBefore(script, target);
        });

        return promise;
    }
}

export {BrowserUtil};
