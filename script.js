let connect;
const transaction = {
  "totalAmount": 70000,
  "customerEmail": "test1@example.com",
  "customerPhone": "234",
  "sessionId": generateUniqueSessionId(15),
  "metaData": "",
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
let config = {
  publicKey: "YOUR_PUBLIC_KEY_HERE",
  signature: "YOUR_SIGNED_TRANSACTION_STRING",
  transaction: transaction,
  isLive: false,
  onSuccess: function (response) {
    console.log(JSON.stringify(response));
  },
  onClose: function () {
    console.log('User closed checkout widget.');
  },
  onError: function () {
      console.log('error occurred');
  }
};

  function generateUniqueSessionId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  function openCheckout() {
    transaction.sessionId = generateUniqueSessionId(15);
    config.signature = signTransaction(transaction);
    connect = new Connect(config);
    connect.setup();
    connect.open();
  }


  // Server code sample
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