const fs = require('fs');

const initParams = {
  //srcDpaId: 'fa6f0599318a4912910c76d269aca923',
  srcDpaId: '2360e9a2-17a7-4766-b08a-a3aef372c643',
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
  },
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
        ///console.log(data);
      }
    } catch (e) {}

    log(namespace, type, payload);

}

const selectOptions = document.getElementById("srcui");

let encryptedCard
let isInit = false;

selectOptions.addEventListener('change', (async (e) => {
  var selectedValue  = selectOptions.options[selectOptions.selectedIndex].value;

  if (selectedValue === 'init') {
    try {
      const start = Date.now();
      const resp = await instance.init(initParams);
      const end = Date.now();
      const diff = end - start;
      console.log("Init: " + diff);

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
  else if (selectedValue === 'lookup' && isInit) {
    try {
      const start = Date.now();
      const resp = await instance.idLookup({email: 'test@mastercard.com'});
      const end = Date.now();
      const diff = end - start;
      console.log("Lookup " + diff);
      displayResult("result", resp);
      //console.warn(resp)
    } catch (e) {
      console.error(e)
    }
  }
  else if (selectedValue === 'getCards' && isInit) {
    try {
      const start = Date.now();
      const resp = await instance.getCards();
      const end = Date.now();
      const diff = end - start;
      console.log("getCards " + diff);
      displayResult("result", resp);
    }catch(e) {
      console.error(e);
    }
  }
  else if (selectedValue === 'encryptCard' && isInit) {
    try {
      encryptedCard = await instance.encryptCard({
        primaryAccountNumber: '5555555555554444',
        panExpirationMonth: '11',
        panExpirationYear: '23',
        cardSecurityCode: '123',
      })
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
      const resp = await instance.checkoutWithNewCard(params)
      console.warn(resp)
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
      const resp = await instance.validate("360354");
      console.log(resp);
    }catch(e) {
      console.error(e);
    }
  }
}));



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
