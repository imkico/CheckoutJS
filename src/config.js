/**
 * The CheckoutJS configuration structure that can be customized.
 * @module Config
 * @category Utility
 */

/**
  * The additional elements created by DigitalRiver.js, e.g. bank selector, credit card fields, etc.
  * @typedef module:Config.MountElementDefinition
  * @property {Object.<string, string>} elements - The object key is the type of createElement in DigitalRiver.js and the object value is the ID of the HTMLElement placeholder that the element is mounted to.
  * @property {string[]} [required] - The required fields for the elements.
  * @example
  * mountElement: {
  *   elements: {
  *     onlinebanking: "drjs_onlineBankingElement"
  *   },
  *   required: ["country","currency"]
  *}
 */

/**
 * The generic configurations for each payment.
 * @typedef {Object} module:Config.PaymentConfigDefinition
 * @property {string} name - The name of the payment method.
 * @property {string} [recurringName] - The payment type for recurring payments.
 * @property {string} description - The description of the payment method.
 * @property {string} elementId - The ID of the HTMLElement.
 * @property {Boolean} disable=true - Set this to false to enable the payment method. This is true by default.
 * @property {Boolean} [show=false] - Set this to true to display the payment method on the page.
 * @property {Boolean} [amountsEstimated=false] - Set this to true to support estimated amounts.
 * @property {Boolean} [supportedRecurringPayments=false] - Set this to true to support recurring payments.
 * @property {string[]} [supportedGeographies=[]] - The list of countries that is supported by this payment method.
 * @property {string[]} [supportedCurrencies=[]] - The list of currencies that is supported by this payment method.
 * @property {string} [route] - The page ID to route to after the source has been applied, e.g. cart, info, confirmOrder, thankYou.
 * @property {Boolean} [showTC=false] - Set this to true to show the Terms and Conditions.
 * @property {Boolean} [hidePaymentSection=false] - Set this to true to hide the payment section in gC.
 * @property {Boolean} [preventPopupClose=false] - Set this to true to remove the close button on the overlay.
 * @property {Object} [style={}] - The styles of the payment element.
 * @property {Object} [class={}] - The class names of the payment element.
 * @property {module:Config.MountElementDefinition} [mountElement]
 * @property {module:Config.RedirectOverlayDefinition} [redirectOverlay]
 * @property {module:Config.PaymentConfigTemplateDefinition} [template]
 * @example
 * directDebit: {
 *   name: "Direct Debit",
 *   elementId: "dr_directDebit",
 *   disable: true,
 *   supportedGeographies: ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IR","IT","LV","LI","LT","LU","MT","MC","NL","NO","PL","PT","RO","SM","SK","SI","ES","SE","CH","GB","VA","AD"],
 *   supportedCurrencies: ["EUR"]
 * }
 */

/**
 * The customized template for the payment.
 * @typedef module:Config.PaymentConfigTemplateDefinition
 * @property {string} [pendingFunds] - The customized template for pending funds.
 * @example
 * template: {
 *   pendingFunds:
 *     '<ul>\n' +
 *     '    <li>Bank Name: {bPay.bankName}</li>\n' +
 *     '    <li>Location: {bPay.city}, {bPay.country}</li>\n' +
 *     '    <li>Account Holder: {bPay.accountHolder}</li>\n' +
 *     '    <li>Account Number: {bPay.accountNumber}</li>\n' +
 *     '    <li>Branch Details: {bPay.additionalBankInformation}</li>\n' +
 *     '    <li>Reference ID: {bPay.referenceId}</li>\n' +
 *     '</ul>'
 * }
 */

/**
 * @memberOf module:Config
 * @property {string} apiKey - The Commerce API Key.
 * @property {string} encryptionKey - The encryption Key for payload encryption.
 * @property {string} authUserName
 * @property {string} authPassword
 * @property {string} siteId        - The Global Commerce site ID.
 * @property {string} locale
 * @property {string} page - The Global Commerce page name.
 * @property {string} country
 * @property {string} currency
 * @property {string} drUrl - The Global Commerce hosted domain, e.g. https://store.digitalriver.com.
 * @property {string} apiRequestUrlBase - The Digital River API endpoint.
 * @property {string} prefixName - The prefix name of the cookie or session.
 * @property {Boolean} init=true - When this value is set to true, initialize the layout and payments when a new instance is created.
 * @property {Boolean} submitCartWithShopperApi=false - Creates a payment source for the cart and submits the cart via Commerce API instead of a form submit.
 * @property {string[]} specialsCharacters - The range of UTF-8 characters to avoid when applying information to the cart, e.g. emojis.
 * @property {Boolean} debug=false
 */
export const Config = {
    apiKey: '',
    encryptionKey: '',
    authUserName: '',
    authPassword: '',
    siteId: '',
    locale: '',
    page: '',
    country: 'US',
    currency: '',
    drUrl: '',
    apiRequestUrlBase: "https://api.digitalriver.com",
    //apiRequestUrlBase: "https://api-cte-ext.digitalriver.com",
    //apiRequestUrlBase: "https://dispatch-cte.digitalriverws.net",
    //apiRequestUrlBase: "https://dispatch-test.digitalriver.com",
    prefixName: "dr_",
    init: true,
    submitCartWithShopperApi: false,
    specialsCharacters: [
        '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764(?:\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?|\u200D(?:\uD83D\uDC8B\u200D)?)\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764(?:\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?|\u200D(?:\uD83D\uDC8B\u200D)?)\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764(?:\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?|\u200D(?:\uD83D\uDC8B\u200D)?)\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764(?:\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?|\u200D(?:\uD83D\uDC8B\u200D)?)\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764(?:\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?|\u200D(?:\uD83D\uDC8B\u200D)?)\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764(?:\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|[\u2695\u2696\u2708]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764(?:\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])))|\u200D(?:\u2764(?:\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?|\u200D(?:\uD83D\uDC8B\u200D)?)\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\u200D[\u2695\u2696\u2708])?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764(?:\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764(?:\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764(?:\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F?\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F?\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83D\uDC41\uFE0F?\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83C\uDFF3\uFE0F?\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F?\u200D\u26A7|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764(?:\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\u200D(?:\uD83D\uDD25|\uD83E\uDE79))|\uD83D\uDC41\uFE0F?|\uD83C\uDFF3\uFE0F?|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F?\u20E3|\u2764\uFE0F?|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]'
    ],
    /**
     * The URLs used for the checkout.
     * @name url
     * @memberOf module:Config
     * @property {string} paymentCallBack - The URL to redirect back from third-party payment sites.
     * @property {string} cart - The URL of the cart page.
     * @property {string} info - The URL of the billing, shipping, payment information page.
     * @property {string} confirmOrder - The URL of the confirm order or order review page.
     * @property {string} thankYou - The URL of the order complete or thank you page.
     * @property {string} config - The URL of the CheckoutJS configuration data.
     * @category Utility
     * @instance
     */
    url: {
        paymentCallBack: null,
        cart: "https://{domain}/store/{siteId}/cart",
        info: "https://{domain}/store/{siteId}/DisplayThreePgCheckoutAddressPaymentInfoPage",
        confirmOrder: "https://{domain}/store?Action=DisplayPage&SiteID={siteId}&id=ThreePgCheckoutConfirmOrderPage",
        thankYou: "https://{domain}/store?Action=DisplayPage&SiteID={siteId}&id=ThankYouPage&reqID={requisitionId}",
        config: "https://{domain}/store/{siteId}/CheckoutJsConfig"
    },
    /**
     * The cart settings.
     * @name cart
     * @memberOf module:Config
     * @property {Boolean} displayIncludeTax=true - Set this to true to display the tax row for Apple Pay/Google Pay.
     * @property {Boolean} updateCartInfoByApi=false - Set this to true to update the cart information via API.
     * @category Utility
     * @instance
     */
    cart: {
        displayIncludeTax: true
    },
    /**
     * The selectors used for looking up page elements.
     * @name selector
     * @memberOf module:Config
     * @property {string} checkoutForm - The default checkout form, for billing, shipping and payment information.
     * @property {string} checkoutBtn - The checkout button.
     * @property {string} threePgCheckoutBtn - The checkout button on the cart page of the three-paged checkout flow.
     * @property {string} errorModal - The error modal.
     * @property {string} cloudPaySourceId - The hidden input for the CloudPay source ID.
     * @property {string} cloudPayPayment - The CloudPay container in the payment section.
     * @property {string} cloudPayTC - The Terms and Conditions content.
     * @property {string} cloudPayTCContainer - The placeholder for the Terms and Conditions content.
     * @property {string} cloudPayTermsAcceptance - The HTMLInputElement of the Terms and Conditions acceptance.
     * @property {string} cloudPayBtn - The selector for all one-click checkout payments, e.g. applePay, googlePay, payPal.
     * @property {Object} address - The address information section.
     * @property {string} address.shippingContainer - The container for the shipping address.
     * @property {string} address.billingContainer - The container for the billing address.
     * @property {string} address.shippingDifferentThanBilling - The HTMLInputElement of the shipping is different than billing option.
     * @property {Object} address.billingToGc - The billing address fields in gC.
     * @property {string} address.billingToGc.firstName - The first name field in the billing section.
     * @property {string} address.billingToGc.lastName - The last name field in the billing section.
     * @property {string} address.billingToGc.phoneticFirstName - The phonetic first name field in the billing section.
     * @property {string} address.billingToGc.phoneticLastName - The phonetic last name field in the billing section.
     * @property {string} address.billingToGc.line1 - The first address line field in the billing section.
     * @property {string} address.billingToGc.line2 - The second address line field in the billing section.
     * @property {string} address.billingToGc.city - The city field in the billing section.
     * @property {string} address.billingToGc.companyName - The company name field in the billing section.
     * @property {string} address.billingToGc.division - The company division field in the billing section.
     * @property {string} address.billingToGc.phoneNumber - The phone number field in the billing section.
     * @property {string} address.billingToGc.countrySubdivision - The state/country subdivision field in the billing section.
     * @property {string} address.billingToGc.postalCode - The postal code field in the billing section.
     * @property {string} address.billingToGc.country - The country field in the billing section.
     * @property {string} address.billingToGc.emailAddress - The e-mail address field in the billing section.
     * @property {Object} address.shippingToGc - The shipping address fields in gC.
     * @property {string} address.shippingToGc.firstName - The first name field in the shipping section.
     * @property {string} address.shippingToGc.lastName - The last name field in the shipping section.
     * @property {string} address.shippingToGc.phoneticFirstName - The phonetic first name field in the shipping section.
     * @property {string} address.shippingToGc.phoneticLastName - The phonetic last name field in the shipping section.
     * @property {string} address.shippingToGc.line1 - The first address line field in the shipping section.
     * @property {string} address.shippingToGc.line2 - The second address line field in the shipping section.
     * @property {string} address.shippingToGc.city - The city field in the shipping section.
     * @property {string} address.shippingToGc.companyName - The company name field in the shipping section.
     * @property {string} address.shippingToGc.division - The company division field in the shipping section.
     * @property {string} address.shippingToGc.phoneNumber - The phone number field in the shipping section.
     * @property {string} address.shippingToGc.countrySubdivision - The state/country subdivision field in the shipping section.
     * @property {string} address.shippingToGc.postalCode - The postal code field in the shipping section.
     * @property {string} address.shippingToGc.country - The country field in the shipping section.
     * @property {string} address.shippingToGc.emailAddress - The e-mail address field in the shipping section.
     * @property {Object} shippingEstimator - The shipping estimator section.
     * @property {string} shippingEstimator.container - The container for the shipping estimator.
     * @property {string} shippingEstimator.shipCountry - The HTMLInputElement of the shipping country.
     * @property {string} shippingEstimator.shippingOptionID - The HTMLInputElement of the shipping option.
     * @property {Object} delayedPaymentRefund - The delayed payment refund section.
     * @property {string} delayedPaymentRefund.container - The container for the delayed payment refund.
     * @property {string} delayedPaymentRefund.replacement - The HTMLElement to replace for rendering the DigitalRiver.js delayed payment refund element.
     * @property {Object} confirmOrder - The confirm order section.
     * @property {string} confirmOrder.confirmOrderForm - The confirm order form.
     * @property {string} confirmOrder.paymentContainer - The container for the payment section of the confirm order form.
     * @property {string} confirmOrder.replacement - The HTMLElement to replace for rendering the DigitalRiver.js elements.
     * @property {string} confirmOrder.submitBtnProcessing - The container for the Processing Your Request message that is displayed after the checkout button is clicked.
     * @category Utility
     * @instance
     */
    selector: {
        checkoutForm: "form[name='CheckoutAddressForm']",
        checkoutBtn: "#checkoutButton",
        threePgCheckoutBtn: "#dr_shoppingCartCheckoutButton",
        errorModal: "#drjs_errorModal",
        cloudPaySourceId: "input[name='cloudPaySourceID']",
        cloudPayPayment: "#dr_CloudPay",
        cloudPayTC: "#dr_cloudPayTsAndCs",
        cloudPayTCContainer: ".dr_cloudPayTsAndCs",
        cloudPayTCError: "#dr_cloudPayTsAndCs+.dr_error",
        cloudPayTermsAcceptance: "input[name='cloudPayTermsAcceptance']",
        cloudPayBtn: ".dr_cloudPayBtn",
        address: {
            shippingContainer: "#dr_shippingContainer",
            billingContainer: "#dr_billingContainer",
            shippingDifferentThanBilling: "#shippingDifferentThanBilling",
            selectAddressEntry: "#billingSelectAddr",
            billingToGc: {
                firstName: "input[name='BILLINGname1']",
                lastName: "input[name='BILLINGname2']",
                phoneticFirstName: "input[name='BILLINGphoneticName1']",
                phoneticLastName: "input[name='BILLINGphoneticName2']",
                line1: "input[name='BILLINGline1']",
                line2: "input[name='BILLINGline2']",
                city: "input[name='BILLINGcity'],select[name='BILLINGcity']",
                companyName: "input[name='BILLINGcompanyName']",
                division: "input[name='BILLINGdivision']",
                phoneNumber: "input[name='BILLINGphoneNumber']",
                countrySubdivision: "input[name='BILLINGstate'],select[name='BILLINGstate']",
                postalCode: "input[name='BILLINGpostalCode']",
                country: "input[name='BILLINGcountry'],select[name='BILLINGcountry']",
                emailAddress: "input[name='EMAILemail'],input[name='EMAILconfirmEmail']"
            },
            shippingToGc: {
                firstName: "input[name='SHIPPINGname1']",
                lastName: "input[name='SHIPPINGname2']",
                phoneticFirstName: "input[name='SHIPPINGphoneticName1']",
                phoneticLastName: "input[name='SHIPPINGphoneticName2']",
                line1: "input[name='SHIPPINGline1']",
                line2: "input[name='SHIPPINGline2']",
                city: "input[name='SHIPPINGcity'],select[name='SHIPPINGcity']",
                companyName: "input[name='SHIPPINGcompanyName']",
                division: "input[name='SHIPPINGdivision']",
                phoneNumber: "input[name='SHIPPINGphoneNumber']",
                countrySubdivision: "input[name='SHIPPINGstate'],select[name='SHIPPINGstate']",
                postalCode: "input[name='SHIPPINGpostalCode']",
                country: "input[name='SHIPPINGcountry'],select[name='SHIPPINGcountry']"
            }
        },
        shippingEstimator: {
            container: "#dr_shippingEstimator",
            shipCountry: "input[name='selectedCountry'],select[name='selectedCountry']",
            shippingOptionID: "input[name='shippingOptionID'],select[name='shippingOptionID']"
        },
        delayedPaymentRefund:{
            container: "#dr_DelayedPaymentRefund",
            replacement: "p:first"
        },
        confirmOrder: {
            confirmOrderForm: "form[name='CheckoutConfirmOrderForm']",
            paymentContainer: "#dr_confirmPaymentMethod",
            replacement: "",
            submitBtnProcessing: ".dr_submitButtonProcessing",
            termsOfSaleAcceptance: "#dr_TermsOfSaleAcceptance"
        }
    },
    elements: {
        offlineRefund: {
            elementId: "dr_offlineRefund",
            style: {
                base: {},
                empty: {},
                complete: {},
                invalid: {},
            }
        },
        pendingFundsInstruction:{
            elementId: "dr_paymentInstruction",
            emptyValueSelector: "li"
        },
        billingOption: {
            elementId: "dr_billingOption"
        },
        compliance: {
            elementId: "dr_compliance",
            classes: {

            }
        }
    },
    /**
     * The payment method configurations.
     * @name payments
     * @type { Object.<string, module:Config.PaymentConfigDefinition> }
     * @memberOf module:Config
     * @property {module:Config.PaymentConfigDefinition} applePay - Apple Pay
     * @property {module:Config.PaymentConfigDefinition} googlePay - Google Pay
     * @property {module:Config.PaymentConfigDefinition} creditCard - Credit Card
     * @category Utility
     * @instance
     */
    payments: {
        /**
         * Credit cards supported: American Express, Diners, Discover, JCB, Maestro, MasterCard, and Visa. Details of the credit card can be found in the source.
         * @module creditCard
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/credit-cards
         * @category PaymentMethods
         * @returns {module:Config.PaymentConfigDefinition}
         */
        creditCard: {
            name: "Credit Card",
            elementId: "dr_creditCard",
            mountElement: {
                elements: {
                    cardnumber:{
                        id: "dr_cardNumber"
                    },
                    cardexpiration:{
                        id: "dr_cardExpiration"
                    },
                    cardcvv:{
                        id: "dr_cardCvv"
                    }
                },
            },
            disable: true,
            show: false,
            style: {},
            classes: {
                base: "dr_creditCard",
                complete: "dr_complete",
                empty: "dr_empty",
                focus: "dr_focus",
                invalid: "dr_error",
                webkitAutofill: "autofill"
            },
            amountsEstimated: true,
            supportedRecurringPayments: true,
            supportedGeographies: [],
            supportedSettings: {
                "CHF":{
                    "minAmount":0.00,
                    "maxAmount":70000.00
                },
                "DJF":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "ARS":{
                    "minAmount":0.00,
                    "maxAmount":65000.00
                },
                "MXN":{
                    "minAmount":0.00,
                    "maxAmount":850000.00
                },
                "QAR":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "SAR":{
                    "minAmount":0.00,
                    "maxAmount":230000.00
                },
                "CLP":{
                    "minAmount":0.00,
                    "maxAmount":33000000.00
                },
                "ZAR":{
                    "minAmount":0.00,
                    "maxAmount":500000.00
                },
                "INR":{
                    "minAmount":0.00,
                    "maxAmount":3000000.00
                },
                "CNY":{
                    "minAmount":0.00,
                    "maxAmount":420000.00
                },
                "THB":{
                    "minAmount":0.00,
                    "maxAmount":2000000.00
                },
                "AUD":{
                    "minAmount":0.00,
                    "maxAmount":80000.00
                },
                "ILS":{
                    "minAmount":0.00,
                    "maxAmount":230000.00
                },
                "KRW":{
                    "minAmount":0.00,
                    "maxAmount":80000000.00
                },
                "JPY":{
                    "minAmount":0.00,
                    "maxAmount":6000000.00
                },
                "PLN":{
                    "minAmount":0.00,
                    "maxAmount":200000.00
                },
                "GBP":{
                    "minAmount":0.00,
                    "maxAmount":45000.00
                },
                "IDR":{
                    "minAmount":0.00,
                    "maxAmount":180000000.00
                },
                "KWD":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "PHP":{
                    "minAmount":0.00,
                    "maxAmount":3000000.00
                },
                "TRY":{
                    "minAmount":0.00,
                    "maxAmount":75000.00
                },
                "LBP":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "JOD":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "RUB":{
                    "minAmount":0.00,
                    "maxAmount":750000.00
                },
                "AED":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "HKD":{
                    "minAmount":0.00,
                    "maxAmount":50000.00
                },
                "TWD":{
                    "minAmount":0.00,
                    "maxAmount":2000000.00
                },
                "EUR":{
                    "minAmount":0.00,
                    "maxAmount":45000.00
                },
                "COP":{
                    "minAmount":0.00,
                    "maxAmount":200000000.00
                },
                "DKK":{
                    "minAmount":0.00,
                    "maxAmount":325000.00
                },
                "CAD":{
                    "minAmount":0.00,
                    "maxAmount":40000.00
                },
                "MYR":{
                    "minAmount":0.00,
                    "maxAmount":215000.00
                },
                "USD":{
                    "minAmount":0.00,
                    "maxAmount":60000.00
                },
                "NOK":{
                    "minAmount":0.00,
                    "maxAmount":380000.00
                },
                "EGP":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "SGD":{
                    "minAmount":0.00,
                    "maxAmount":90000.00
                },
                "ETB":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "CZK":{
                    "minAmount":0.00,
                    "maxAmount":80000.00
                },
                "OMR":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "SEK":{
                    "minAmount":0.00,
                    "maxAmount":300000.00
                },
                "NZD":{
                    "minAmount":0.00,
                    "maxAmount":100000.00
                },
                "BRL":{
                    "minAmount":0.00,
                    "maxAmount":125000.00
                },
                "UAH":{

                },
                "BHD":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                }
            }
        },
        /**
         * Apple Pay
         * @module applePay
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/apple-pay
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        applePay: {
            name: "Apple Pay",
            description: "",
            elementId: "dr_applePayBtn",
            disable: true,
            show: false,
            route: "info", //info,confirm,thankyou
            style: {
                buttonType: "plain",
                buttonColor: "light-outline",
                buttonLanguage: "en"
            },
            classes: {
                base: "dr_cloudPayBtn"
            },
            expressCheckout: true,
            supportedPaymentSession: false,
            supportedRecurringPayments: false,
            supportedGeographies: ["AE","AT","AU","BE","BG","BR","CA","CH","CN","CY","CZ","DE","DK","EE","ES","FI","FO","FR","GB","GG","GL","GR","HK","HR","HU","IE","IM","IS","IT","JE","JP","KZ","LI","LT","LU","LV","MC","MO","MT","NL","NO","NZ","PL","PT","RO","RU","SA","SE","SG","SI","SK","SM","TW","UA","US"],
            supportedSettings: {
                "CHF":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "SAR":{

                },
                "CNY":{

                },
                "AUD":{
                    "minAmount":0.00,
                    "maxAmount":20000.00
                },
                "JPY":{
                    "minAmount":0.00,
                    "maxAmount":1000000.00
                },
                "PLN":{
                    "minAmount":0.00,
                    "maxAmount":45000.00
                },
                "GBP":{
                    "minAmount":0.00,
                    "maxAmount":10000.00
                },
                "HUF":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "RUB":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "AED":{

                },
                "HKD":{
                    "minAmount":0.00,
                    "maxAmount":15000.00
                },
                "ISK":{

                },
                "TWD":{

                },
                "EUR":{
                    "minAmount":0.00,
                    "maxAmount":15000.00
                },
                "DKK":{
                    "minAmount":0.00,
                    "maxAmount":95000.00
                },
                "CAD":{
                    "minAmount":0.00,
                    "maxAmount":40000.00
                },
                "USD":{
                    "minAmount":0.00,
                    "maxAmount":45000.00
                },
                "BGN":{

                },
                "NOK":{
                    "minAmount":0.00,
                    "maxAmount":100000.00
                },
                "SGD":{
                    "minAmount":0.00,
                    "maxAmount":20000.00
                },
                "CZK":{
                    "minAmount":0.00,
                    "maxAmount":800000.00
                },
                "SEK":{
                    "minAmount":0.00,
                    "maxAmount":125000.00
                },
                "NZD":{
                    "minAmount":0.00,
                    "maxAmount":25000.00
                },
                "BRL":{
                    "minAmount":0.00,
                    "maxAmount":35000.00
                },
                "UAH":{

                }
            }
        },
        /**
         * Google Pay
         * @module googlePay
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/google-pay
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        googlePay: {
            name: "Google Pay",
            description: "",
            elementId: "dr_googlePayBtn",
            disable: true,
            show: false,
            route: "info", //info,confirm,thankyou
            style: {
                buttonType: "long",
                buttonColor: "light",
                buttonLanguage: "en"
            },
            classes: {
                base: "dr_cloudPayBtn"
            },
            expressCheckout: true,
            supportedPaymentSession: true,
            supportedRecurringPayments: true,
            supportedSettings: {
                "CHF":{
                    "minAmount":0.00,
                    "maxAmount":70000.00
                },
                "ARS":{
                    "minAmount":0.00,
                    "maxAmount":65000.00
                },
                "MXN":{
                    "minAmount":0.00,
                    "maxAmount":850000.00
                },
                "QAR":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "SAR":{
                    "minAmount":0.00,
                    "maxAmount":230000.00
                },
                "CLP":{
                    "minAmount":0.00,
                    "maxAmount":33000000.00
                },
                "ZAR":{
                    "minAmount":0.00,
                    "maxAmount":500000.00
                },
                "INR":{
                    "minAmount":0.00,
                    "maxAmount":3000000.00
                },
                "VND":{

                },
                "CNY":{

                },
                "THB":{
                    "minAmount":0.00,
                    "maxAmount":2000000.00
                },
                "AUD":{
                    "minAmount":0.00,
                    "maxAmount":80000.00
                },
                "ILS":{
                    "minAmount":0.00,
                    "maxAmount":230000.00
                },
                "KRW":{

                },
                "JPY":{
                    "minAmount":0.00,
                    "maxAmount":6000000.00
                },
                "PLN":{
                    "minAmount":0.00,
                    "maxAmount":200000.00
                },
                "GBP":{
                    "minAmount":0.00,
                    "maxAmount":40000.00
                },
                "IDR":{
                    "minAmount":0.00,
                    "maxAmount":180000000.00
                },
                "HUF":{

                },
                "KWD":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "PHP":{
                    "minAmount":0.00,
                    "maxAmount":3000000.00
                },
                "TRY":{
                    "minAmount":0.00,
                    "maxAmount":75000.00
                },
                "LBP":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "JOD":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "RUB":{
                    "minAmount":0.00,
                    "maxAmount":750000.00
                },
                "AED":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "HKD":{
                    "minAmount":0.00,
                    "maxAmount":500000.00
                },
                "TWD":{
                    "minAmount":0.00,
                    "maxAmount":2000000.00
                },
                "EUR":{
                    "minAmount":0.00,
                    "maxAmount":45000.00
                },
                "COP":{
                    "minAmount":0.00,
                    "maxAmount":200000000.00
                },
                "DKK":{
                    "minAmount":0.00,
                    "maxAmount":325000.00
                },
                "CAD":{
                    "minAmount":0.00,
                    "maxAmount":40000.00
                },
                "MYR":{
                    "minAmount":0.00,
                    "maxAmount":215000.00
                },
                "USD":{
                    "minAmount":0.00,
                    "maxAmount":60000.00
                },
                "NOK":{
                    "minAmount":0.00,
                    "maxAmount":380000.00
                },
                "EGP":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "SGD":{
                    "minAmount":0.00,
                    "maxAmount":90000.00
                },
                "ETB":{

                },
                "CZK":{
                    "minAmount":0.00,
                    "maxAmount":800000.00
                },
                "OMR":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "SEK":{
                    "minAmount":0.00,
                    "maxAmount":300000.00
                },
                "NZD":{
                    "minAmount":0.00,
                    "maxAmount":100000.00
                },
                "BRL":{
                    "minAmount":0.00,
                    "maxAmount":125000.00
                },
                "UAH":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                },
                "BHD":{
                    "minAmount":0.00,
                    "maxAmount":30000.00
                }
            },
            saveAsPaymentOption: false,
        },
        /**
         * Direct Debit
         * @module directDebit
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/direct-debit
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        directDebit: {
            name: "Direct Debit",
            elementId: "dr_directDebit",
            disable: true,
            show: false,
            supportedRecurringPayments: true,
            supportedSettings: {
                "EUR":{
                    "minAmount":0.00,
                    "maxAmount":45000.00,
                    "countries":[
                        "AT",
                        "BE",
                        "BG",
                        "CH",
                        "CY",
                        "CZ",
                        "DE",
                        "DK",
                        "EE",
                        "ES",
                        "FI",
                        "FR",
                        "GR",
                        "HR",
                        "HU",
                        "IE",
                        "IS",
                        "IT",
                        "LI",
                        "LT",
                        "LU",
                        "LV",
                        "MC",
                        "MT",
                        "NL",
                        "NO",
                        "PL",
                        "PT",
                        "RO",
                        "SI",
                        "SK",
                        "SM"
                    ]
                }
            },
            saveAsPaymentOption: false,
        },
        /**
         * Direct Debit GB
         * @module directDebitGB
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/direct-debit
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        directDebitGb: {
            name: "Direct Debit",
            elementId: "dr_directDebitGb",
            disable: true,
            show: false,
            supportedRecurringPayments: true,
            supportedSettings: {
                "GBP":{
                    "minAmount":0.01,
                    "maxAmount":500000.00,
                    "countries":[
                        "GB"
                    ]
                }
            },
            saveAsPaymentOption: false,
        },
        /**
         * Wire Transfer
         * @module wireTransfer
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/wire-transfer
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        wireTransfer: {
            name: "Wire Transfer",
            elementId: "dr_wireTransfer",
            disable: true,
            show: false,
            supportedSettings: {
                "CHF":{
                    "minAmount":0.00,
                    "maxAmount":70000.00,
                    "countries":[
                        "CH",
                        "LI"
                    ]
                },
                "ARS":{
                    "countries":[
                        "AR"
                    ]
                },
                "MXN":{
                    "countries":[
                        "MX"
                    ]
                },
                "QAR":{
                    "countries":[
                        "QA"
                    ]
                },
                "CLP":{
                    "countries":[
                        "CL"
                    ]
                },
                "ZAR":{
                    "minAmount":0.00,
                    "maxAmount":500000.00,
                    "countries":[
                        "ZA"
                    ]
                },
                "VND":{
                    "countries":[
                        "VN"
                    ]
                },
                "THB":{
                    "countries":[
                        "TH"
                    ]
                },
                "AUD":{
                    "minAmount":0.00,
                    "maxAmount":80000.00,
                    "countries":[
                        "AU"
                    ]
                },
                "JPY":{
                    "minAmount":0.00,
                    "maxAmount":6000000.00,
                    "countries":[
                        "JP"
                    ]
                },
                "PLN":{
                    "minAmount":0.00,
                    "maxAmount":200000.00,
                    "countries":[
                        "PL"
                    ]
                },
                "GBP":{
                    "minAmount":0.00,
                    "maxAmount":40000.00,
                    "countries":[
                        "GB"
                    ]
                },
                "IDR":{
                    "countries":[
                        "ID"
                    ]
                },
                "HUF":{
                    "minAmount":0.00,
                    "maxAmount":6306600.00,
                    "countries":[
                        "HU"
                    ]
                },
                "KWD":{
                    "countries":[
                        "KW"
                    ]
                },
                "TRY":{
                    "countries":[
                        "TR"
                    ]
                },
                "RUB":{
                    "minAmount":0.00,
                    "maxAmount":1200000.00,
                    "countries":[
                        "RU"
                    ]
                },
                "HKD":{
                    "minAmount":0.00,
                    "maxAmount":500000.00,
                    "countries":[
                        "HK"
                    ]
                },
                "ISK":{
                    "countries":[
                        "IS"
                    ]
                },
                "EUR":{
                    "minAmount":0.00,
                    "maxAmount":100000.00,
                    "countries":[
                        "AD",
                        "AT",
                        "BE",
                        "BG",
                        "CY",
                        "DE",
                        "EE",
                        "ES",
                        "FI",
                        "FR",
                        "GR",
                        "IE",
                        "IT",
                        "LT",
                        "LU",
                        "LV",
                        "MC",
                        "MT",
                        "NL",
                        "PT",
                        "RO",
                        "SI",
                        "SK",
                        "SM",
                        "VA"
                    ]
                },
                "COP":{
                    "countries":[
                        "CO"
                    ]
                },
                "DKK":{
                    "countries":[
                        "FO",
                        "GL"
                    ]
                },
                "CAD":{
                    "minAmount":0.00,
                    "maxAmount":40000.00,
                    "countries":[
                        "CA"
                    ]
                },
                "MYR":{
                    "minAmount":0.00,
                    "maxAmount":215000.00,
                    "countries":[
                        "MY"
                    ]
                },
                "USD":{
                    "minAmount":0.00,
                    "maxAmount":60000.00,
                    "countries":[
                        "PE",
                        "PR",
                        "US"
                    ]
                },
                "NOK":{
                    "minAmount":0.00,
                    "maxAmount":380000.00,
                    "countries":[
                        "NO"
                    ]
                },
                "SGD":{
                    "minAmount":0.00,
                    "maxAmount":90000.00,
                    "countries":[
                        "SG"
                    ]
                },
                "CZK":{
                    "minAmount":0.00,
                    "maxAmount":800000.00,
                    "countries":[
                        "CZ"
                    ]
                },
                "SEK":{
                    "minAmount":0.00,
                    "maxAmount":300000.00,
                    "countries":[
                        "SE"
                    ]
                },
                "NZD":{
                    "minAmount":0.00,
                    "maxAmount":100000.00,
                    "countries":[
                        "NZ"
                    ]
                },
                "BRL":{
                    "minAmount":0.00,
                    "maxAmount":125000.00,
                    "countries":[
                        "BR"
                    ]
                },
                "UAH":{
                    "countries":[
                        "UA"
                    ]
                },
                "BHD":{
                    "countries":[
                        "BH"
                    ]
                }
            }
        },
        /**
         * PayPal
         * @module payPal
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/paypal
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        payPal: {
            name: "PayPal",
            recurringName: "payPalBilling",
            elementId: "dr_payPalBtn",
            disable: true,
            show: false,
            route: "confirm", //info,confirm,thankyou
            style: {
                layout: "horizontal",
                label: "checkout",
                size: "responsive",
                color: "gold",
                shape: "rect",
                tagline: "false"
            },
            classes: {
                base: "dr_cloudPayBtn"
            },
            button: {
                funding: {
                    allowed: ["card"],
                },
            },
            amountsEstimated: true,
            supportedRecurringPayments: true,
            redirectOverlay: {
                type: "open"
            },
            supportedSettings: {
                "CHF":{
                    "minAmount":0.00,
                    "maxAmount":30000.00,
                    "countries":[
                        "CH",
                        "LI"
                    ]
                },
                "HKD":{
                    "minAmount":0.00,
                    "maxAmount":150000.00,
                    "countries":[
                        "HK"
                    ]
                },
                "TWD":{
                    "countries":[
                        "TW"
                    ]
                },
                "MXN":{
                    "minAmount":0.00,
                    "maxAmount":210000.00,
                    "countries":[
                        "MX"
                    ]
                },
                "EUR":{
                    "minAmount":0.00,
                    "maxAmount":15000.00,
                    "countries":[
                        "AD",
                        "AT",
                        "BE",
                        "BG",
                        "CY",
                        "DE",
                        "EE",
                        "ES",
                        "FI",
                        "FR",
                        "GF",
                        "GR",
                        "IE",
                        "IT",
                        "LT",
                        "LU",
                        "LV",
                        "MC",
                        "MT",
                        "NL",
                        "PM",
                        "PT",
                        "RE",
                        "RO",
                        "SI",
                        "SK",
                        "SM",
                        "VA"
                    ]
                },
                "DKK":{
                    "minAmount":0.00,
                    "maxAmount":95000.00,
                    "countries":[
                        "DK",
                        "FO",
                        "GL"
                    ]
                },
                "CAD":{
                    "minAmount":0.00,
                    "maxAmount":40000.00,
                    "countries":[
                        "CA"
                    ]
                },
                "USD":{
                    "minAmount":0.00,
                    "maxAmount":45000.00,
                    "countries":[
                        "AS",
                        "BD",
                        "DE",
                        "EC",
                        "FM",
                        "GU",
                        "IO",
                        "MH",
                        "MP",
                        "PA",
                        "PE",
                        "PR",
                        "SV",
                        "TC",
                        "UM",
                        "US",
                        "VE"
                    ]
                },
                "NOK":{
                    "minAmount":0.00,
                    "maxAmount":100000.00,
                    "countries":[
                        "BV",
                        "NO",
                        "SJ"
                    ]
                },
                "VND":{
                    "countries":[
                        "VN"
                    ]
                },
                "THB":{
                    "minAmount":0.00,
                    "maxAmount":650000.00,
                    "countries":[
                        "TH"
                    ]
                },
                "AUD":{
                    "minAmount":0.00,
                    "maxAmount":20000.00,
                    "countries":[
                        "AU",
                        "CC",
                        "CX",
                        "HM",
                        "KI",
                        "NF",
                        "TV"
                    ]
                },
                "ILS":{
                    "minAmount":0.00,
                    "maxAmount":70000.00,
                    "countries":[
                        "IL"
                    ]
                },
                "SGD":{
                    "minAmount":0.00,
                    "maxAmount":30000.00,
                    "countries":[
                        "SG"
                    ]
                },
                "JPY":{
                    "minAmount":0.00,
                    "maxAmount":1000000.00,
                    "countries":[
                        "JP"
                    ]
                },
                "PLN":{
                    "minAmount":0.00,
                    "maxAmount":45000.00,
                    "countries":[
                        "PL"
                    ]
                },
                "GBP":{
                    "minAmount":0.00,
                    "maxAmount":10000.00,
                    "countries":[
                        "GB",
                        "GS",
                        "TA"
                    ]
                },
                "CZK":{
                    "minAmount":0.00,
                    "maxAmount":800000.00,
                    "countries":[
                        "CZ"
                    ]
                },
                "HUF":{
                    "minAmount":0.00,
                    "maxAmount":30000.00,
                    "countries":[
                        "HU"
                    ]
                },
                "SEK":{
                    "minAmount":0.00,
                    "maxAmount":125000.00,
                    "countries":[
                        "SE"
                    ]
                },
                "NZD":{
                    "minAmount":0.00,
                    "maxAmount":25000.00,
                    "countries":[
                        "CK",
                        "NU",
                        "NZ",
                        "PN",
                        "TK"
                    ]
                },
                "PHP":{
                    "minAmount":0.00,
                    "maxAmount":850000.00,
                    "countries":[
                        "PH"
                    ]
                },
                "RUB":{
                    "minAmount":0.00,
                    "maxAmount":30000.00,
                    "countries":[
                        "RU"
                    ]
                }
            },
            saveAsPaymentOption: false,
        },
        payPalCredit: {
            name: "PayPal Credit",
            elementId: "dr_payPalCreditBtn",
            disable: true,
            show: false,
            route: "confirm",
            style: {
                layout: "horizontal",
                label: "credit",
                size: "responsive",
                color: "darkblue",
                shape: "rect",
                tagline: "false"
            },
            classes: {
                base: "dr_cloudPayBtn"
            },
            button: {
                funding: {
                    allowed: ["credit"],
                },
            },
            amountsEstimated: true,
            supportedRecurringPayments: false,
            redirectOverlay: {
                type: "open"
            },
            supportedSettings: {
                "USD":{
                    "minAmount":0.00,
                    "maxAmount":45000.00,
                    "countries":[
                        "US"
                    ]
                }
            }
        },
        /**
         * Korean - Payco
         * @module payco
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/korea-bank-transfer
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        payco: {
            name: "PAYCO",
            elementId: "dr_payco",
            disable: true,
            show: false,
            //oneTimeRedirect: true,
            supportedSettings: {
                "KRW":{
                    "minAmount":400.00,
                    "countries":[
                        "KR"
                    ]
                }
            }
        },
        /**
         * Korean - Bank Transfer
         * @module bankTransfer
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/korea-bank-transfer
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        bankTransfer: {
            name: "Bank Transfer",
            elementId: "dr_bankTransfer",
            disable: true,
            show: false,
            //oneTimeRedirect: true,
            supportedSettings: {
                "KRW":{
                    "minAmount":400.00,
                    "countries":[
                        "KR"
                    ]
                }
            }
        },
        /**
         * bPay
         * @module bPay
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/bpay
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        bPay: {
            name: "BPAY",
            elementId: "dr_bPay",
            disable: true,
            show: false,
            supportedSettings: {
                "AUD":{
                    "minAmount":0.00,
                    "maxAmount":80000.00,
                    "countries":[
                        "AU"
                    ]
                }
            }
        },
        /**
         * Internet Bank Payment (IBP)
         * @module onlineBanking
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/internet-bank-payment-ibp
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        onlineBanking: {
            name: "Online Banking - IBP",
            elementId: "dr_onlineBanking",
            mountElement: {
                elements: {
                    onlinebanking: {
                        id: "drjs_onlineBankingElement"
                    }
                },
                required: ["country","currency"]
            },
            disable: true,
            show: false,
            classes: {
                base: "dr_cloudPay",
                complete: "dr_complete",
                empty: "dr_empty",
                focus: "dr_focus",
                invalid: "dr_error"
            },
            supportedPaymentSession: true,
            supportedSettings: {
                "EUR":{
                    "minAmount":0.00,
                    "maxAmount":50000.00,
                    "countries":[
                        "AT",
                        "DE",
                        "FI",
                        "NL"
                    ]
                },
                "PLN":{
                    "minAmount":0.00,
                    "maxAmount":200000.00,
                    "countries":[
                        "PL"
                    ]
                },
                "SEK":{
                    "minAmount":0.00,
                    "maxAmount":300000.00,
                    "countries":[
                        "SE"
                    ]
                }
            }
        },
        /**
         * Konbini
         * @module konbini
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/konbini-1
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        konbini: {
            name: "コンビニ決済",
            elementId: "dr_konbini",
            mountElement: {
                elements: {
                    konbini: {
                        id:"drjs_konbiniElement"
                    }
                },
                required: ["country","currency"]
            },
            disable: true,
            show: false,
            supportedPaymentSession: false,
            classes: {
                base: "dr_cloudPay",
                complete: "dr_complete",
                empty: "dr_empty",
                focus: "dr_focus",
                invalid: "dr_error"
            },
            supportedSettings: {
                "JPY":{
                    "minAmount":0.00,
                    "maxAmount":6000000.00,
                    "countries":[
                        "JP"
                    ]
                }
            }
        },
        /**
         * Klarna
         * @module klarnaCredit
         * @see https://developers.digitalriver.com/payment-integrations/digitalriver.js/payment-methods/klarna
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        klarnaCredit: {
            name: "Klarna",
            recurringName: "klarnaCreditRecurring",
            elementId: "dr_klarnaCredit",
            disable: true,
            show: false,
            supportedRecurringPayments: true,
            supportedSettings: {
                "CAD": {
                    "minAmount": 35.00,
                    "maxAmount": 1500.00,
                    "countries": [
                        "CA"
                    ]
                },
                "CHF": {
                    "minAmount": 1.00,
                    "maxAmount": 1000.00,
                    "countries": [
                        "CH"
                    ]
                },
                "DKK": {
                    "minAmount": 1.00,
                    "maxAmount": 20000.00,
                    "countries": [
                        "DK"
                    ]
                },
                "EUR": {
                    "minAmount": 0.10,
                    "maxAmount": 15000.00,
                    "countries": [
                        "AT",
                        "DE",
                        "FI",
                        "NL"
                    ]
                },
                "GBP": {
                    "minAmount": 1.00,
                    "maxAmount": 800.00,
                    "countries": [
                        "GB"
                    ]
                },
                "NOK": {
                    "minAmount": 1.00,
                    "maxAmount": 75000.00,
                    "countries": [
                        "NO"
                    ]
                },
                "PLN": {
                    "minAmount": 130.00,
                    "maxAmount": 7000.00,
                    "countries": [
                        "PL"
                    ]
                },
                "SEK": {
                    "minAmount": 1.00,
                    "maxAmount": 100000.00,
                    "countries": [
                        "SE"
                    ]
                },
                "USD": {
                    "minAmount": 35.00,
                    "maxAmount": 1000.00,
                    "countries": [
                        "US"
                    ]
                }
            },
            activeAcceptance: true,
            singleSubscriptionForRecurring: true,
            saveAsPaymentOption: false
        },
        /**
         * Alipay
         * @module alipay
         * @see https://docs.digitalriver.com/commerce-api/payment-integrations-1/digitalriver.js/payment-methods/alipay
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        alipay: {
            name: "Alipay",
            elementId: "dr_alipay",
            disable: true,
            show: false,
            supportedSettings: {
                "USD": {
                    "minAmount": 0.00,
                    "maxAmount": 20000.00,
                    "countries": [
                        "CN",
                        "BD",
                        "EC",
                        "SV",
                        "PA",
                        "PY",
                        "PR",
                        "VE",
                        "US"
                    ]
                },
                "CNY": {
                    "minAmount": 0.00,
                    "maxAmount": 420000.00,
                    "countries": [
                        "CN"
                    ]
                },
            },
        },
        msts: {
            name: "MSTS",
            elementId: "dr_msts",
            disable: true,
            show: false,
            mountElement: {
                elements: {
                    poNumber: {
                        id: "drjs_poNumberElement"
                    },
                    notes: {
                        id: "drjs_notesElement"
                    }
                },
                required: ["country","currency"]
            },
            supportedRecurringPayments: true,
            supportedSettings: {
                "CAD": {
                    "minAmount":0.00,
                    "maxAmount":40000.00,
                    "countries": [
                        "CA"
                    ]
                },
                "CHF": {
                    "minAmount":0.00,
                    "maxAmount":70000.00,
                    "countries": [
                        "CH"
                    ]
                },
                "AUD": {
                    "minAmount":0.00,
                    "maxAmount":80000.00,
                    "countries": [
                        "AU"
                    ]
                },
                "NZD": {
                    "minAmount":0.00,
                    "maxAmount":100000.00,
                    "countries": [
                        "NZ"
                    ]
                },
                "GBP": {
                    "minAmount":0.00,
                    "maxAmount":45000.00,
                    "countries": [
                        "GB"
                    ]
                },
                "EUR": {
                    "minAmount":0.00,
                    "maxAmount":45000.00,
                    "countries": [
                        "IE",
                        "DE",
                        "BE",
                        "NL",
                        "AT",
                        "ES",
                        "FR",
                        //"CH",
                        "LU"
                    ]
                },
                "DKK": {
                    "minAmount":0.00,
                    "maxAmount":325000.00,
                    "countries": [
                        "DK"
                    ]
                },
                "PLN": {
                    "minAmount":0.00,
                    "maxAmount":200000.00,
                    "countries": [
                        "PL"
                    ]
                },
                "USD": {
                    "minAmount":0.00,
                    "maxAmount":60000.00,
                    "countries": [
                        "US"
                    ]
                },
            },
            activeAcceptance: true,
            enrollNowButton: "Enroll Now",
            poNumber:"Purchase Order #",
            notes:"Notes",
            fieldsTemplate: '<script type="text/template">' +
                '<div>{poNumber}</div>' +
                '<input type="text" id="drjs_poNumber" maxlength="255" />'+
                '<div>{notes}</div>' +
                '<textarea id="drjs_notes" maxlength="255" />'+
                '</script>',
            enrollBtnTemplate: '<script type="text/template">' +
                '<div class="">{enrollNowDescription}</div>' +
                '<a class="dr_button" href="{enrollLink}" target="_blank">{enrollNowButton}</a>' +
                '</script>'
        },
        /**
         * Bancontact
         * @module bancontact
         * @see https://docs.digitalriver.com/commerce-api/payment-integrations-1/digitalriver.js/payment-methods/bancontact
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        bancontact: {
            name: "Bancontact",
            elementId: "dr_bancontact",
            disable: true,
            show: false,
            supportedSettings: {
                "EUR": {
                    "minAmount": 0.00,
                    "maxAmount": 20000.00,
                    "countries": [
                        "BE"
                    ]
                }
            }
        },
        /**
         * CCAvenue
         * @module ccavenue
         * @see 
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        ccavenue: {
            name: "CCAvenue",
            elementId: "dr_ccavenue",
            disable: true,
            show: false,
            supportedPaymentSession: true,
            supportedSettings: {
                "INR": {
                    "minAmount": 0.00,
                    "maxAmount": 3000000.00,
                    "countries": [
                        "IN"
                    ]
                }
            }
        },
        /**
         * Trustly
         * @module trustly
         * @see 
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        trustly: {
            name: "Trustly",
            elementId: "dr_trustly",
            disable: true,
            show: false,
            supportedPaymentSession: true,
            supportedRecurringPayments: false,
            submitThenRedirect: true,
            supportedSettings:{
                "DKK": {
                    "minAmount": 0.01,
                    "maxAmount": 7440.00,
                    "countries": [
                        "DK"
                    ]
                },
                "EUR": {
                    "minAmount": 0.01,
                    "maxAmount": 1000.00,
                    "countries": [
                        "AT",
                        "DE",
                        "EE",
                        "ES",
                        "FI",
                        "LT",
                        "LV",
                        "NL"
                    ]
                },
                "GBP": {
                    "minAmount": 0.01,
                    "maxAmount": 829.00,
                    "countries": [
                        "GB"
                    ]
                },
                "NOK": {
                    "minAmount": 0.01,
                    "maxAmount": 9846.00,
                    "countries": [
                        "NO"
                    ]
                },
                "SEK": {
                    "minAmount":0.01,
                    "maxAmount":21520.00,
                    "countries": [
                        "SE"
                    ]
                }
            }
        },
        /**
         * CustomerCredit
         * @module customerCredit
         * @see
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        customerCredit: {
            name: "CustomerCredit",
            elementId: "dr_customerCredit",
            disable: true,
            show: false,
            enumerable: false,
            //oneTimeRedirect: true,
            supportedGeographies: [],
            supportedCurrencies: []
        },
        /**
         * Dropin
         * @module dropin
         * @see https://docs.digitalriver.com/digital-river-api/payment-integrations-1/drop-in
         * @category PaymentMethods
         * @type {module:Config.PaymentConfigDefinition}
         */
        dropin: {
            name: "Dropin",
            elementId: "dr_dropin",
            mountElement: {
                elements: {
                    dropin: {
                        id: "drjs_dropinElement"
                    }
                },
                required: ["country","currency"]
            },
            options: {
                flow: "checkout",
                showSavePaymentAgreement: false,
                showComplianceSection: false,
            },
            disable: true,
            show: false,
            style: {
                base: {},
                empty: {},
                complete: {},
                invalid: {},
            },
            skipPaymentTypeCheck: true,
        }
    },
    labels: {
        DETAILS: "details",
        CLOSE: "Close",
        DISCOUNT: "Discount",
        TAX: "Tax",
        SHIPPING_AND_HANDLING: "Shipping and Handling",
        ESTIMATED_SHIPPING_AND_HANDLING: "Estimated Shipping and Handling",
        PMT_REDIRECT_NOTICE: "You are being redirected to the {0} site to complete payment.",
        CLICKHERE: "Click here",
        BACK_TO_CART: "Back To Shopping Cart",
        INVALID_BILLING_COUNTRY: "Invalid Billing Country",
        SUB_TOTAL: "Sub Total",
        TOTAL: "Total",
        CHECKOUT_PAYMENT_COMPLETED: "Payment Completed",
        VALIDATOR_INVALID_TYPE: "Enter a valid value.",
        CHECKOUT: "Checkout",
        error: {
            "PAYMENT_AUTHORIZATION_FAILED":"Payment Authorization Failed",
            "restricted-ship-to-country": "Invalid Shipping Country",
            "restricted-bill-to-country": "Invalid Billing Country",
            "cart-payment-failure": "Payment Authorization Failed",
            "apply-payment-failure": "Payment Authorization Failed"
        }
    },
    /**
     * The template container.
     * @typedef module:Config.TemplateDefinition
     * @property {string} error - The template for the error dialog.
     * @property {string} payment - The template for the payment in the payment section.
     * @example
     * template: {
     *   error: '<script type="text/template">' +
     *     '<div class="modal fade in" id="drjs_errorModal" role="dialog" aria-hidden="true">' +
     *     '<div class="modal-dialog modal-lg modal-content" role="document">' +
     *     '<div class="modal-body">' +
     *     '<code class="dr_error">{error}</code>' +
     *     '</div>' +
     *     '<div class="modal-footer">' +
     *     '<button type="button" class="btn btn-default btn-secondary" data-dismiss="modal">{close}</button>' +
     *     '</div>' +
     *     '</div>' +
     *     '</div>' +
     *     '</script>',
     *   payment: '<script type="text/template" id="dr_paymentTemplate">' +
     *     '<div class="dr_paymentMethodBlock" id="dr_{paymentId}">' +
     *     '<div class="dr_billingColumn" id="dr_{paymentId}RadioSelect">' +
     *     '<div class="radio radio-wide">' +
     *     '<input type="radio" name="paymentMethodID" id="drjs_{paymentId}" />' +
     *     '<label class="dr_label_paymentMethodName" for="drjs_{paymentId}">' +
     *     '<strong class="dr_paymentOptionItem">{name}</strong>' +
     *     '<span class="dr_expandDetails">(<a href="#" data-expand-section="dr_ExpandPaymentDetailsdrjs_{paymentId}">{details}</a>)</span>' +
     *     '</label>' +
     *     '</div>' +
     *     '</div>' +
     *     '<div class="dr_ExpandPaymentDetailsSection" id="dr_ExpandPaymentDetailsdrjs_{paymentId}" style="display: none;">{description}<div id="drjs_{paymentId}Element"></div>' +
     *     '</div>' +
     *     '</script>'
     * }
     */
    template: {
        error: '<script type="text/template">' +
            '<div class="modal fade in" id="drjs_errorModal" role="dialog" aria-hidden="true">' +
            '<div class="modal-dialog modal-lg modal-content" role="document">' +
            '<div class="modal-body">' +
            '<code class="dr_error">{error}</code>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default btn-secondary" data-dismiss="modal">{close}</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</script>',
        payment: '<script type="text/template" id="dr_paymentTemplate">' +
            '<div class="dr_paymentMethodBlock" id="dr_{paymentId}">' +
            '<div class="dr_billingColumn" id="dr_{paymentId}RadioSelect">' +
            '<div class="radio radio-wide">' +
            '<input type="radio" name="paymentMethodID" id="drjs_{paymentId}" />' +
            '<label class="dr_label_paymentMethodName" for="drjs_{paymentId}">' +
            '<strong class="dr_paymentOptionItem">{name}</strong>' +
            '<span class="dr_expandDetails">(<a href="#" data-expand-section="dr_ExpandPaymentDetailsdrjs_{paymentId}">{details}</a>)</span>' +
            '</label>' +
            '</div>' +
            '</div>' +
            '<div class="dr_ExpandPaymentDetailsSection" id="dr_ExpandPaymentDetailsdrjs_{paymentId}" style="display: none;">{description}<div id="drjs_{paymentId}Element"></div>' +
            '</div>' +
            '</script>',
    },
    /**
     * The redirect overlay.
     * @typedef module:Config.RedirectOverlayDefinition
     * @property {string} id - The ID of the overlay.
     * @property {string} [type] - The type of overlay: 'open' will popup a new window/tab, 'iframe' will embed an iframe inside the overlay.
     * @property {string} [inlineStyle] - The styles to override the default styles of the overlay.
     * @property {string} [buttonClass] - The class name of the button in the overlay.
     * @property {int} [timeout] - The number of milliseconds to wait before checking the status.
     * @property {int} [iframePadding] - The padding of the iframe.
     * @example
     * redirectOverlay: {
     *   id: "drjs_overlay",
     *   type: "open", //iframe,open
     *   buttonClass: "dr_button",
     *   inlineStyle: "#drjs_overlay{display: block;position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 9999;background: rgba(1,1,1,0.85);} #drjs_overlay>div{position: absolute; text-align: center; width: 100%;} #drjs_overlay>div.drjs_open{top: 40%;} #drjs_overlay>div.drjs_iframe{padding-top:50px} #drjs_overlay h4 {color:#eee;margin:4px;} #drjs_overlay iframe {width:98%; border:0; } #drjs_overlay .drjs_backToCart { position: absolute; right: 10px; top: 8px; color: #eee; } #drjs_overlay .drjs_close { position: absolute; right: 10px; top: 8px; width: 32px; height: 32px; opacity: 0.3;z-index:10000; } #drjs_overlay .drjs_close:hover { opacity: 1;}#drjs_overlay .drjs_close:before,#drjs_overlay .drjs_close:after { position: absolute; left: 15px; content: ' '; height: 33px; width: 2px;background-color: #fff; } #drjs_overlay .drjs_close:before { transform: rotate(45deg); } #drjs_overlay .drjs_close:after {   transform: rotate(-45deg); }",
     *   timeout: 5000,
     *   iframePadding: 60
     * }
     */
    redirectOverlay: {
        id: "drjs_overlay",
        type: "open", //iframe,open
        buttonClass: "dr_button",
        inlineStyle: "#drjs_overlay{display: block;position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 9999;background: rgba(1,1,1,0.85);} #drjs_overlay>div{position: absolute; text-align: center; width: 100%;} #drjs_overlay>div.drjs_open{top: 40%;} #drjs_overlay>div.drjs_iframe{padding-top:50px} #drjs_overlay h4 {color:#eee;margin:4px;} #drjs_overlay iframe {width:98%; border:0; } #drjs_overlay .drjs_backToCart { position: absolute; right: 10px; top: 8px; color: #eee; } #drjs_overlay .drjs_close { position: absolute; right: 10px; top: 8px; width: 32px; height: 32px; opacity: 0.3;z-index:10000; } #drjs_overlay .drjs_close:hover { opacity: 1;}#drjs_overlay .drjs_close:before,#drjs_overlay .drjs_close:after { position: absolute; left: 15px; content: ' '; height: 33px; width: 2px;background-color: #fff; } #drjs_overlay .drjs_close:before { transform: rotate(45deg); } #drjs_overlay .drjs_close:after {   transform: rotate(-45deg); }",
        timeout: 5000,
        iframePadding: 60
    },
    /**
     * The options for AXIOS.
     * @name apiOption
     * @type {Object}
     * @memberOf module:Config
     * @instance
     * @property {int} [maxRedirects=0]
     * @property {string} [responseType='json']
     * @property {int} [timeout=250000]
     * @property {Object} [headers={}]
     * @property {Object} [params={expand:'all',format:'json'}] - The default parameters.
     */
    apiOption: {
        maxRedirects: 0,
        responseType: 'json',
        timeout: 250000,
        headers: {},
        params: {
            expand: 'all',
            format: 'json'
        }
    },
    /**
     * The external libraries used.
     * @name lib
     * @type {Object}
     * @memberOf module:Config
     * @instance
     * @property {Object} drjs
     * @property {Boolean} drjs.disable=false
     * @property {Boolean} drjs.url=https://js.digitalriverws.com/v1/DigitalRiver.js
     * @property {string} jQuery
     * @property {Boolean} jQuery.disable=true - Enable if there is a jQuery conflict or if a legacy version was loaded.
     * @property {string} jQuery.url=https://ui1.img.digitalrivercontent.net/Storefront/jquery/jquery-3.3.1.min.js
     * @property {string} paypal
     * @property {string} paypal.url=https://www.paypalobjects.com/api/checkout.js - The PayPal API SDK.
     * @property {string} gibberishAES
     * @property {string} gibberishAES.url=https://cdnjs.cloudflare.com/ajax/libs/gibberish-aes/1.0.0/gibberish-aes.min.js - The library for payload encryption.
     */
    lib: {
        drjs: {
            disable: false,
            url: "https://js.digitalriverws.com/v1/DigitalRiver.js",
            css: "https://js.digitalriverws.com/v1/css/DigitalRiver.css",
            options: {}
        },
        jQuery: {
            disable: true,
            url: "https://ui1.img.digitalrivercontent.net/Storefront/jquery/jquery-3.3.1.min.js"
        },
        paypal: {
            url: "https://www.paypalobjects.com/api/checkout.js"
        },
        gibberishAES: {
            url: "https://cdnjs.cloudflare.com/ajax/libs/gibberish-aes/1.0.0/gibberish-aes.min.js"
        }
    },
    cloudPayPayload: {},
    entity: {
        code: '',
    },
    consoleLog: true,
    debug: false,
};
