const initParams = {
  //srcDpaId: 'fa6f0599318a4912910c76d269aca923',
  srcDpaId: '2360e9a2-17a7-4766-b08a-a3aef372c643',
  cardBrands: ['mastercard', 'visa', 'amex', 'discover'],
  //cardBrands: ['mastercard'],
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
let isInit = false;

selectOptions.addEventListener('change', (async (e) => {
  var selectedValue  = selectOptions.options[selectOptions.selectedIndex].value;

  if (selectedValue === 'init') {
    try {
      //debugger
      const resp = await instance.init(initParams);

      for (var i = 0; i < selectOptions.length; i++) {
        selectOptions.options[i].disabled = false;
      }
      isInit = true;

      displayResult("result", resp);
    }catch(e ) {
      console.log(e);
    }
  }
  else if (selectedValue === 'lookup' && isInit) {
    try {
      const resp = await instance.idLookup({email: 'test@mastercard.com'});
      displayResult("result", resp);
      //console.warn(resp)
    } catch (e) {
      console.error(e)
    }
  }
  else if (selectedValue === 'getCards' && isInit) {
    try {
      const resp = await instance.getCards();
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
