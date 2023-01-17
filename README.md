# CheckoutJS

- Written in Node.js
- Supports Global Commerce (gC) hosted sites (Rivulet/Latte Template)
- Supports [Commerce API](https://commerceapi.digitalriver.com/docs)
- Integrated with [DigitalRiver.js](https://developers.digitalriver.com/payment-integrations/digitalriver.js/overview)

## Payments Supported

- Credit Card
- Alipay
- Apple Pay

	Example of a customized button:
	```JS
	window.checkoutJS = {
      config:{
        payments: {
          applePay:{
            route: "info", //info,confirm,thankyou
            style: {
              buttonType: "plain", //buy,plain
              buttonColor: "light-outline" //light,light-outline,dark
            }
          }
        }
      }
	}
	```
- Google Pay

	Example of a customized button:
	```JS
	window.checkoutJS = {
      config:{
        payments: {
          route: "info", //info,confirm,thankyou
          googlePay: {
            style: {
                buttonType: "long", //plain,long
                buttonColor: "light" //dark,light
            }
          }
        }
      }
	}
	```
- PayPal

	Example of a customized button, see [Customize the PayPal Buttons](https://developer.paypal.com/docs/checkout/integration-features/customize-button/) page for style options:
	```JS
	window.checkoutJS = {
      config:{
        payments: {
          payPal: {
            style: {
              layout: 'horizontal',
              label: 'checkout',
              size: 'responsive',
              color: 'gold',
              shape: 'rect',
              tagline: false,
              fundingicons: false,
              height: 40
            }
          }
        }
      }
	}
	```
- Payco (Korea payment)
- Bank Transfer (Korea payment)
- Cash on Delivery (Japan payment)
- Direct Debit (SEPA)
- Online Banking - IBP
- `*` Klarna Credit
- `*` MSTS
- `*` Bancontact

`*` Required Payment session enable on this site 

## Requirements

- Support last 1 version for each browser (JS library and built-in support for UMD module)
- Node 10.x LTS (install from npm)

## Demos and Tools

- [Single-page application](https://github.digitalriverws.net/pages/ProfessionalServices/CheckoutJS/demo/index.html) (Vue.js with UIKit)
- [gC-hosted site](https://store.digitalriver.com/store/stdtest2/home/)
- [Key Verification Tool](https://github.digitalriverws.net/pages/ProfessionalServices/CheckoutJS/demo/KeyVerifyTool.html)

# How to Implement

- **Headless**
    1. Download the .zip file from the [latest release](https://github.digitalriverws.net/ProfessionalServices/CheckoutJS/releases) and copy **CheckoutJS.js**, **paymentCallBank.html**, **polyfills.js** from the dist folder to the hosting path.
    2. Insert the following code inside the head tag of your HTML. The below example uses **initCheckoutJS** as the callback function.
        ```html
        <!--[if IE]-->
        <script src="polyfills.js"></script>
        <!--[endif]-->
        <script src="CheckoutJS.js?callback=initCheckoutJS" async ></script>
        ```
    3. Create the callback function **initCheckoutJS** to initialize the CheckoutJS object with payload settings.
        ```html
        <script>
          function initCheckoutJS() {
            (new CheckoutJS({
              "apiKey": "c9f0ce6755214355b89ef8179687ffee",
              "siteId": "stdtest2",
              "currency": "USD",
              "locale": "en_US",
              "lang": "en",
              "drjsApiKey":"pk_hc_60bdf4ec989f48088d3732ca1fa2518b",
              "apiRequestUrlBase":"https://dispatch-cte.digitalriverws.net", //Prod: https://api.digitalriver.com, CTE: https://api-cte-ext.digitalriver.com
              "payments": {
                "applePay": {
                  "disable": false
                },
                "googlePay": {
                  "disable": false
                },
                "creditCard": {
                  "disable": false
                },
                "payPal": {
                  "disable": false
                }
              },
              "debug": true
            })).then(function(checkoutJS){
              window.checkoutJS = checkoutJS;
            });
          }
        </script>
        ```
- **Global Commerce hosted site**

    Refer to the implementation instructions in the [CheckoutJS-GC](https://github.digitalriverws.net/ProfessionalServices/CheckoutJS-GC) repository.

# References

- [API Documentation](https://github.digitalriverws.net/pages/ProfessionalServices/CheckoutJS/docs)

# For Developers

## First time build

```
$ npm install

$ npm run dev:mkcert
```

## Starting the dev server

```
$ npm run server:dev
```

## Useful scripts

```
$ npm run build // Builds the client and server library into dist.

$ npm run build:dev // Builds in deveopment mode into dist.

$ npm run start // Run webpack server.

$ npm run start:dev // Run webpack server in development mode.

$ npm run dev:mkcert // Create certification for webpack server for development.

```
