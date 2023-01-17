## Initialize CheckoutJS instance

```html
<!--[if IE]-->
<script src="polyfills.js"></script>
<!--[endif]-->		
<script src="CheckoutJS.js?callback=initCheckoutJS" async ></script>
<script>
function initCheckoutJS() {
    (new CheckoutJS({
        "apiKey": "89e118bfc0a346719d534cb209a32dee",
        "drjsApiKey":"pk_26350724fa2640b5950641f49f4a108f",
        "payments": {
            "creditCard": {
                "disable": false
            }
        }
    })).then(function(checkoutJS){
        window.checkoutJS = checkoutJS;
    });
}
</script>
```


## Using standalone config json file
There is another way to add 'data-config' attribute on loading script to initialize by configurator json file.  
```html
<script src="CheckoutJS.js?callback=initCheckoutJS" data-config="config.json" data-instance="true" async ></script>
<script>
function initCheckoutJS() {
    console.log('CheckoutJS ready');
}
</script>
```

## Basic configurator json payload of CheckoutJS

```json
{
  "apiKey": "c9f0ce6755214355b89ef8179687ffee",
  "siteId": "stdtest2",
  "currency": "USD",
  "locale": "en_US",
  "lang": "en",
  "drjsApiKey":"pk_hc_60bdf4ec989f48088d3732ca1fa2518b",
  "apiRequestUrlBase":"https://dispatch-cte.digitalriverws.net",
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
    },
    "bankTransfer": {
      "disable": false
    },
    "payco": {
      "disable": false
    },
    "directDebit": {
      "disable": false
    },
    "onlineBanking": {
      "disable": false
    }
  }
}
```

## One-Click buttons implementation 

Put the following placeholder on page for rendering Apple Pay, Google Pay, PayPal buttons. 
**The terms and conditions must be provided for Apple Pay and Google Pay.**

- Apple Pay button placeholder
    ```html
    <span id="dr_applePayBtn"></span>
    ```
 
- Google Pay button placeholder
    ```html
    <span id="dr_googlePayBtn"></span>
    ```
  
- PayPal Pay button placeholder
    ```html
    <span id="dr_payPalBtn"></span>
    ```
  
- T&C placeholder
    ```html
    <span class="dr_cloudPayTsAndCs"></span>
    ```



