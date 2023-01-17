import {CheckoutJS} from './checkout';
import {BrowserUtil} from './browsers/browserUtil';
import {Global, isBrowser} from "./util";

(async ()=>{
    if(isBrowser) {
        const currentScript = BrowserUtil.getCurrentScript();
        if(currentScript && currentScript.getAttribute) {
            if (currentScript.getAttribute("data-instance") === "true") {
                const checkoutJS = await new CheckoutJS();
                Global.checkoutJS = checkoutJS;
            }
            const scriptLinkRegex = currentScript.src.match(new RegExp("callback=([^&]+)")) || [];
            if (scriptLinkRegex && scriptLinkRegex.length) {
                const _function = scriptLinkRegex[1];
                if (typeof Global[_function] == 'function') {
                    Global[_function](CheckoutJS);
                }
            }
        }
        return Global.CheckoutJS = CheckoutJS;
    }
})();

export default CheckoutJS;
