//try {
  // Create the performance observer.
  //const po = new PerformanceObserver((list) => {
    //for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      //console.log(entry.toJSON());
      //console.log('Server Timing', entry.serverTiming);
    //}
  //});

  //po.observe({entryTypes: ['element', 'first-input', 'largest-contentful-paint', 'layout-shift', 'longtask', 'mark', 'measure', 'navigation', 'paint', 'resource']})
//} catch (e) {
  //Do nothing if the browser doesn't support this API.
//}

const xoButton = document.getElementById('xo')
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

xoButton.addEventListener('click', async (e) => {
  //const iframe = document.createElement('iframe')
  //iframe.style.width = '420px'
  //iframe.style.height = '620px'

  //document.body.appendChild(iframe)
  //const windowRef = iframe.contentWindow
  const instance = new Click2Pay()
  let encryptedCard

  try {
    //performance.mark('init:start');
    const resp = await instance.init(initParams)
    //performance.mark('init:end');

    //performance.measure('init', 'init:start', 'init:end');
    //console.log("init() " + end - start);
    //debugger
    //document.body.appendChild("<p>" + resp + "</p>")
    var parElement = document.getElementById("result");
    var textNode = document.createTextNode(JSON.stringify(resp));
    parElement.appendChild(textNode);
    console.warn(resp)
  } catch (e) {
    console.error(e)
  }

  //performance.getEntriesByType('navigation').forEach((r) => {
  //  console.log(r);
  //});
  /*console.log("resource")
  performance.getEntriesByType('resource').forEach((r) => {
    console.log(`response time for ${r.name}: ${r.responseEnd - r.responseStart}`);
  });
  console.log("resource")

  console.log("longtask")
  performance.getEntriesByType('longtask').forEach((r) => {
    console.log(`response time for ${r.name}: ${r.responseEnd - r.responseStart}`);
  });
  console.log("longtask")

  console.log("navigation")
  performance.getEntriesByType('navigation').forEach((r) => {
    console.log(r.domContentLoadedEventEnd - r.domContentLoadedEventStart);
  });


  console.log("navigation")
*/
  /*try {
    const resp = await instance.getCards()
    console.warn(resp)
  } catch (e) {
    console.error(e)
  }
  try {
    const resp = await instance.idLookup({
      email: 'test@mastercard.com'
    })
    console.warn(resp)
  } catch (e) {
    console.error(e)
  }
  try {
    encryptedCard = await instance.encryptCard({
      primaryAccountNumber: '5555555555554444',
      panExpirationMonth: '11',
      panExpirationYear: '23',
      cardSecurityCode: '123',
    })
    console.warn(encryptedCard)
  } catch (e) {
    console.error(e)
  }

  try {
    const params = {
      ...encryptedCard,
      windowRef,
    }
    console.warn(params)
    const resp = await instance.checkoutWithNewCard(params)
    console.warn(resp)
  } catch (e) {
    debugger
    console.error(e)
  }*/
})
