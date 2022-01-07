const initParams = {
  //srcDpaId: 'fa6f0599318a4912910c76d269aca923',
  srcDpaId: '2360e9a2-17a7-4766-b08a-a3aef372c643',
  //cardBrands: ['mastercard', 'visa', 'amex', 'discover'],
  cardBrands: ['mastercard', 'visa', 'amex', 'discover'],
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
const selectOptions = document.getElementById("srcui")
const instance = new Click2Pay()
let encryptedCard

selectOptions.addEventListener('change', (async (e) => {
  var selectedValue  = selectOptions.options[selectOptions.selectedIndex].value;

  if (selectedValue === 'init') {
    try {
      displayResult("result", await instance.init(initParams));
    }catch(e ) {
      console.log(e);
    }
  }
  else if (selectedValue === 'lookup') {
    try {
      displayResult("result", await instance.idLookup({email: 'test@mastercard.com'}));
      //console.warn(resp)
    } catch (e) {
      console.error(e)
    }
  }
  else if (selectedValue === 'getCards') {
    try {
      displayResult("result", await instance.getCards());
    }catch(e) {
      console.error(e);
    }
  }
  else if (selectedValue === 'encryptCard') {
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
  } else if (selectedValue === 'checkoutWithNewCard') {
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
