//const fs = require('fs');

setCookies();

const initParams = {
  //srcDpaId: 'fa6f0599318a4912910c76d269aca923',
  //srcDpaId: '2360e9a2-17a7-4766-b08a-a3aef372c643',
  srcDpaId: '6441fbba-9602-4522-8ac6-bf12d1edc91a',
  cardBrands: ['mastercard', 'visa', 'amex', 'discover'],
  //cardBrands: ['discover'],
  dpaTransactionOptions: {
    transactionAmount: {
      transactionAmount: 123,
      transactionCurrencyCode: 'USD',
    },
    threeDsPreference: 'NONE',
    transactionType: 'PURCHASE',
    consumerEmailAddressRequested: true,
    consumerNameRequested: true,
    consumerPhoneNumberRequested: true,
    payloadTypeIndicatorCheckout: 'PAYMENT',
    payloadTypeIndicatorPayload: 'PAYMENT',
    dpaBillingPreference: 'FULL',
    dpaShippingPreference: 'FULL',
    dpaAcceptedBillingCountries: [],
    dpaAcceptedShippingCountries: [],
    dpaLocale: 'en_US',
    paymentOptions: [
      {
        dpaDynamicDataTtlMinutes: 15,
        dpaPanRequested: false,
        dynamicDataType: 'CARD_APPLICATION_CRYPTOGRAM_LONG_FORM',
      },
    ],
  },
  dpaData: {
    dpaName: 'SparkTmerch',
    dpaPresentationName: 'SparkTmerch',
  }
}

const instance = new Click2Pay({debug:true});
const debugPayloads = []
window.debugPayloads = debugPayloads
const log = console.log
console.log = (namespace, type, payload) => {
  try {
    const [paylaodType, data] = payload

    if (type === 'trace' && paylaodType === 'storing method result:') {
        debugPayloads.push(data)
        console.log(data);
      }
    } catch (e) {}

    log(namespace, type, payload);

}

const selectOptions = document.getElementById("srcui");

let encryptedCard
let isInit = false;

const timeDiff =[]

//document.querySelector('')

selectOptions.addEventListener('change', (async (e) => {
  var selectedValue  = selectOptions.options[selectOptions.selectedIndex].value;

  if (selectedValue === 'init') {
    try {
      document.cookie = "appInstanceId=50a79d45-a714-498b-8156-70ac39a7955e";
      const start = Date.now();
      const resp = await instance.init(initParams);
      console.log("init " + JSON.stringify(resp));
      const end = Date.now();
      const diff = end - start;
      console.log("Time of Init: " + diff);
      const timeDiff = {};
      timeDiff.methodName = "Init";
      timeDiff.responseTime = diff;
      debugPayloads.push(timeDiff);

      // console.warn(windows.debugPayloads);
      for (var i = 0; i < selectOptions.length; i++) {
        selectOptions.options[i].disabled = false;
      }
      isInit = true;
    //  debugger

      displayResult("result", resp);
    }catch(e) {
      console.log(e);
    }
  }
  else if (selectedValue === 'lookup_true' && isInit) {
    try {
      const start = Date.now();
      const resp = await instance.idLookup({email: 'mcprod02112022@mailinator.com'});
      const end = Date.now();
      const diff = end - start;
      console.log("Time of Lookup " + diff);
      const timeDiff = {};
      timeDiff.methodName = "Lookup_true";
      timeDiff.responseTime = diff;
      debugPayloads.push(timeDiff);
      displayResult("result", resp);
      //console.warn(resp)
    } catch (e) {
      console.error(e)
    }
  }
  else if (selectedValue === 'lookup_false' && isInit) {
    try {
      const start = Date.now();
      const resp = await instance.idLookup({email: 'does_not_exist_email@mastercard.com'});
      const end = Date.now();
      const diff = end - start;
      console.log("Time of Lookup " + diff);
      const timeDiff = {};
      timeDiff.methodName = "Lookup_false";
      timeDiff.responseTime = diff;
      debugPayloads.push(timeDiff);
      displayResult("result", resp);
      //console.warn(resp)
    } catch (e) {
      console.error(e)
    }
  }
  else if (selectedValue === 'getCards' && isInit) {
    try {
    //  const srcCardList = document.querySelector("src-card-list");
      const start = Date.now();
      const resp = await instance.getCards();
      const end = Date.now();
      //srcCardList.loadCards(resp);
      const diff = end - start;
      console.log("Time of getCards " + diff);
      const timeDiff = {};
      timeDiff.methodName = "getCards";
      timeDiff.responseTime = diff;

      debugPayloads.push(timeDiff)
      displayResult("result", resp);
    }catch(e) {
      console.error(e);
    }
  }

  else if (selectedValue === 'encryptCard' && isInit) {
    try {
      const start = Date.now();
      encryptedCard = await instance.encryptCard({
        primaryAccountNumber: '5555555555554444',
        panExpirationMonth: '11',
        panExpirationYear: '23',
        cardSecurityCode: '123',
      })
      const end = Date.now();
      const diff = end -start;
      console.log("Time of encryptCard " + diff)
      const timeDiff = {};
      timeDiff.methodName = "encryptCard";
      timeDiff.responseTime = diff;
      debugPayloads.push(timeDiff);
      displayResult("result", encryptedCard);
    } catch (e) {
      console.error(e)
    }
  } else if (selectedValue === 'checkoutWithNewCard' && isInit) {
    try {

      const iframe = document.createElement('iframe')
      iframe.style.width = '420px'
      iframe.style.height = '620px'

      document.body.appendChild(iframe)
      const windowRef = iframe.contentWindow

      const params = {
        ...encryptedCard,
        windowRef,
      }
      console.warn(params)
      const start = Date.now();
      const resp = await instance.checkoutWithNewCard(params)
      const  end = Date.now();
      const diff = end - start;
      console.log("Time of checkoutWithNewCard " + diff);
      const timeDiff = {};
      timeDiff.methodName = "checkoutWithNewCard";
      timeDiff.responseTime = diff;
      debugPayloads.push(timeDiff);
      console.warn(resp);
    } catch (e) {

      console.error(e)
    }
  } else if (selectedValue == 'initiateValidation') {
    try {
      const resp = await instance.initiateValidation();
      console.log(resp);
    }catch (e) {
      console.error(e)
    }
    try {
      //
      //const resp = await instance.initiateValidation({identityProvider:"SRC",identityType:"EMAIL",maskedValidationChannel:"m*****2@mailinator.com",validationEmailId:"EMAIL" });
      const resp = await instance.initiateValidation({requestedValidationChannelId:"EMAIL"});
      console.log(resp);
    }catch( e) {
      console.log(e);
    }
  } else if (selectedValue === 'checkoutWithCard') {
    try{
      const iframe = document.createElement('iframe')
      iframe.style.width = '420px'
      iframe.style.height = '620px'

      document.body.appendChild(iframe)
      const windowRef = iframe.contentWindow

      const resp = await instance.checkoutWithCard({
        "srcDigitalCardId": "361a8d27-0b74-413d-a318-db5dc568e908",
        "windowRef": windowRef
      })
    }catch(e) {
      console.error(e);
    }
  } else if (selectedValue === 'validate') {
    try {

      const textField = document.createElement('textField')
      textField.style.width = '420px'
      textField.style.height = '620px'

      document.body.appendChild(textField);


      var retVal = textField.value;
      var req = {value : retVal};
      //
      //const resp = await instance.validate({value: retVal });
    //  console.log(resp);
    }catch(e) {
      console.error(e);
    }
  }else if (selectedValue === 'debugPayloads') {
    console.log(debugPayloads);
     displayResult("result", JSON.stringify(debugPayloads));
  }
}));

function save() {
//  var data = document.getElementById("txtData").value;
  var c = document.createElement("a");
  c.download = "metrics.txt";
//debugger
console.log(debugPayloads)
  var t = new Blob([JSON.stringify(debugPayloads)], {
    type: "text/plain"
  });
  c.href = window.URL.createObjectURL(t);
  c.click();
}

function setCookies() {
  console.log("set cookies");
  //document.cookie = "bm_sv=BE027DC0B644B5FB70195E9C50225AC3~5Z8g+YgqCHpuLDm1kc2Q7/MrAkm++OCgCL5d5fW0WSt/zWdfe8lngc0ibNMgKeXZR4ZZIa/470a06AVmJdWcDxcD2lj+e3d7NChKfr4pthUbw9Tpxv/bHMkfa3vbtVYYVppOxScp9Hpc45n2YYAEdzqpf8o2Vg5ucXuv8fE1gDU=;" + " Domain=.mastercard.com;" + "Path=/; Max-Age=7199;" + "HttpOnly";
  //document.cookie = "TS01c106a3=0129c5f8e114ef13c261bdac7a66e09d3b69e6dac3f417e8d9cb713ba20ea5b5213aa87da14b3402dc05dfe11f510e8d4667ea8a3d92f379cd09847451f414d77cd2890c48; Domain=src.mastercard.com; Path=/; Secure";
  document.cookie = "appInstanceId=" + encodeURIComponent("50a79d45-a714-498b-8156-70ac39a7955e");// Domain=src.mastercard.com; Path=/; Secured; HttpOnly";
  //document.cookie = "s_sq=%5B%5BB%5D%5D; Domain=.mastercard.com; Path=/;Secure";
  //document.cookie = "s_cc=true; Domain=.mastercard.com; Path=/; Secure";
  //document.cookie = "__cfruid=446d14e79787365b6121baab66ce669ec2931da8-1646829437; Domain=.secure.checkout.visa.com; Path=/;SameSite=None; Secured";
  //document.cookie = "AMCVS_919F3704532951060A490D44%40AdobeOrg=1; Domain=.mastercard.com; Path=/;Secure";
  //document.cookie = "x-via-hint=D9D9F7D820693030312E762E303030BF0058567B3030317D3A41414D784F55455353526364434D4431305252366C4D6B684950415879492B42426C36414E66785A78462F357331577562426454544372692F2B594345752F72364E6343734A774A636F6E5A444C4E6FFF; Domain=.visa.com;	Path=/;Secure";
  //document.cookie = "ndcd=wc1.1.w-729460.1.2.e83BpgydqhvBrOZ4mZ_LfA%252C%252C.2Eym3c1cyxLySV-iRld5G17OBQYhZkBUfFvIN3kCI_SqSXIWmDk8q7SLlaXqGp7Tj3WT9KYcjzNLusYrbSHrAqiMk3vNPjqEjBLMF-JJc2Dzb4JC2TE_B9gtuuexWTgkQEQJuIoGYt0qa1oAzkgHIsthdn65Yv_P8VAns_IbrDJVYG2sNkBACGLvy_700i_wPnpzh7EXBcgeoRBXH_JvYg%252C%252C; Domain=.mastercard.com; Path=/; SameSite=None;Secure";
  //document.cookie = "ak_bmsc=3C71F097191C2C22D11A83DDDBE73C80~000000000000000000000000000000~YAAQtKomF02WY25/AQAA3A+vbg8F/XYEfF0EW9p/axQ2QBMsRpOUgjXQdQCsbL/7OD5LDlDMhqwlEbpBPouRsXgtO+BtK4IdtMIiIV3ysPI+r/k7Y09UByoNDCYtgGi6EbS9RAWxJ1NJrsfK6CJhuwC5QrSjhc6/b5xK3WwtpFjCr/lhfVUoML+LcIE8AJjNoyr1TkBRCHehWM+23lBUeegT6R3C2GhAKJ/nthYVefjBD/rMek3IDYFz75XH3kOSd4xjbQjEDkeEC8dI29GQ5OiotX2yFpSBnaIzpJT72e53vTtX3xAkCRRtYrUj24SvAQaWD3zu2FsOe9DfqD1EQAWYke+VMhJEZolxgJaUR4pdPHgyWX1Qi/ANl/ZqLBxUAPQzYj0tm42hZQxXsYqBwXCPb4KnAMeTHCn579FnkxB7pmXgR1TqWWIdpy4/SjhbJ/6b6wwJJZlWBQE/LZqSvaWVuEtQl4Jdoyse+QcSB5+T8oGFDbCLywT0XwTpCQ==; Domain=.mastercard.com; Path=/; Secure;SameSite=None; HttpOnly";
  //document.cookie = "AMCV_919F3704532951060A490D44%40AdobeOrg=-1124106680%7CMCMID%7C65959686740281829530139848383378972749%7CMCAAMLH-1647434333%7C7%7CMCAAMB-1647434333%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1646836733s%7CNONE%7CvVersion%7C5.2.0; Domain=.mastercard.com; Path=/; HttpOnly";
//  document.cookie = "OptanonConsent=isIABGlobal=false&datestamp=Wed+Mar+09+2022+07%3A38%3A52+GMT-0500+(Eastern+Standard+Time)&version=6.8.0&hosts=&consentId=0a5bba49-5229-4337-83f2-07fbef333d10&interactionCount=0&landingPath=https%3A%2F%2Fsrc.mastercard.com%2Fpay%2Freview&groups=C0001%3A1%2CC016%3A1%2CC015%3A1%2CC018%3A1%2CC032%3A1%2CC0002%3A1%2CC006%3A1%2CC0003%3A1%2CC017%3A1; Domain=.src.mastercard.com; Path=/;Secure";

  var arr = document.cookie.split(";");
  console.log("size " + arr.length);
}

function displayResult(resultDiv, response) {
  var parElement = document.getElementById(resultDiv);
  var textNode = document.createTextNode(JSON.stringify(response));
  var pElement = document.createElement("p");
  pElement.appendChild(textNode);

  var child = parElement.lastElementChild;

  while(child) {
    parElement.removeChild(child);
    child = parElement.lastElementChild;
  }

  parElement.appendChild(pElement);
}
