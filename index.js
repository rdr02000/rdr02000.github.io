//const fs = require('fs');

setConfig();

const initParams = {
  //srcDpaId: 'fa6f06599318a4912910c76d269aca923',
  srcDpaId: '2360e9a2-17a7-4766-b08a-a3aef372c643',
  //srcDpaId: '6441fbba-9602-4522-8ac6-bf12d1edc91a',
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
        var parElement = document.getElementById("result");
      const textField = document.createElement('input')
      const button = document.createElement('button')
      button.setAttribute("id","otpSave");
      textField.setAttribute("id", "otp");

      button.addEventListener("click", function(e) {
        var retVal = textField.value;
        const resp = instance.validate({value: retVal });
        console.log(resp);
      })


      parElement.appendChild(textField);
      parElement.appendChild(button);

      //var retVal = textField.value;
      //var req = {value : retVal};
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

function setConfig() {
  // localStorage.setItem('mcsrc.enablenewinit', 'true')
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
