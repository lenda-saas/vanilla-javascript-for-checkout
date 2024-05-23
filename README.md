# Vanilla-js-for-checkout

Welcome to the documentation for integrating with our Checkout Lending Buy-Now-Pay-Later (BNPL) service. This service allows merchants to send transactions securely and encrypted to our BNPL checkout service. This document provides an overview of the process and details on how to use our APIs.


## Step 1: Get your api keys
Get your merchant private and public keys from your dashboard.


## Step 2: Update your html
- Copy the checkout.min.js script tag and paste just before the close of body tag.
```
<script src="https://checkout.creditdirect.ng/bnpl/checkout.min.js" type="application/javascript"></script>
```
- Add an extra button to your checkout page with a click function.
```
<button class="custom-class" onclick="openCheckout()">Launch Checkout</button>
```

## Step 3: Sign your transaction on your server
Here is a sample JS function to sign your transaction on your server using your private key

```javascript
function signTransaction(transaction) {
    const privateKey = 'YOUR_PRIVATE_KEY';
    const sm = transaction.sessionId + transaction.customerEmail + transaction.totalAmount;
    const st = signTransactionRequest(sm, privateKey);
    return st;
  }

  function signTransactionRequest(message, privateKey) {
    const key = CryptoJS.enc.Utf8.parse(privateKey);
    const messageData = CryptoJS.enc.Utf8.parse(message);
    const signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(messageData, key));
    return signature;
  }
```


## Step 4: Initialise Checkout in your checkout page js script

```javascript
let connect;

// Sample transaction object

const transaction = {
    "totalAmount": 70000,
    "customerEmail": "test1@example.com",
    "customerPhone": "234",
    "sessionId": generateUniqueSessionId(15),
    "products": [
        {
            "productName": "Iphone",
            "productAmount": 400,
            "productId": "2"
        },
        {
            "productName": "Iphone 2",
            "productAmount": 200,
            "productId": "3"
        }
    ]
}

// configure checkout widget
let config = {
    publicKey: "YOUR_PUBLIC_KEY_HERE",
    signature: "YOUR_SIGNED_TRANSACTION_STRING", /** Your will send your transaction to your server
                 and sign it with your private key as explained in Step 3 above **/
    transaction: transaction,
    isLive: false,
    onSuccess: function () {
      /** 
        send this checkoutTransactionId back to your server to listen to 
         payout notification with webhook.
        */
    },
    onClose: function () {
      console.log('User closed checkout widget.');
    },
    onPopup: function (response) {
        console.log(JSON.stringify(response));
        response: { checkoutTransactionId: 75455457879vjh566 }
        /**
            Save this checkoutTransactionId to your database so as to
            be able to use it to listen to webhook notification after onSuccess is emitted.
        **/
    }
  };
  connect = new Connect(config);
  connect.setup();

// Generic session id function

function generateUniqueSessionId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }


// trigger checkout widget
  function openCheckout() {
    transaction.sessionId = generateRandomString(15); // generate new session Id each time the popup is triggered
    config.signature = signTransaction(transaction); // sign the transaction each time the checkout popup is triggered
    connect = new Connect(config);
    connect.setup();
    connect.open();
  }


```

## Final Step: Notification
We send notifications for events that occur during the customer checkout process via a webhook notification system. Below are the events that can occur during the checkout process:

`Checkout_Customer_Payment_Completed`: Customer completed the checkout process 🎉.

`Checkout_Merchant_Payment_Completed`: Payment has been successful made to the merchant store

And that's all!!! You are all set. 


## Reference
[Checkout Webhook Verification](https://developer.lendastack.io/products-guide/webhooks/webhooks-verification.)


