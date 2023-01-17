## How to customize

```html
<script>
window.checkoutJS = {
    config:{
        
    },
    util:{
    
    },
    payments: {
    
    }
};
</script>
<script src="CheckoutJS.js?callback=initCheckoutJS" data-config="config.json" data-instance="true" async ></script>
<script>
function initCheckoutJS() {
    console.log('CheckoutJS ready');
}
</script>
```

## How to customize one-click button UI

```html
<script>
window.checkoutJS = {
    config:{
        payments: {
            applePay:{
                style: {
                    buttonType: "plain",         //buy,plain
                    buttonColor: "light-outline" //light,light-outline,dark
                }
            },
            googlePay:{
                style: {
                    buttonType: "long",	 //plain,long
                    buttonColor: "light" //dark,light
                }
            },
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
};
</script>
```

## How to customize Error Message
The example of customize errorMessage function.
```html 
<script>
window.checkoutJS = {
    util:{
        errorMessage: async function(ex){
            console.log('%cerror','color:Red',ex);
            const errorId = await checkoutJS.util.extractErrorId(ex);
            const errorMessage = await checkoutJS.util.extractErrorMessage(ex);
            console.error(errorId,errorMessage);
            alert(errorMessage);
        }
    }
};
</script>
```
