import "./css/index.css";
import IMask from 'imask';

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path');
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path');
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');



function setCardType(type) {

const colors = {

  visa: ["#436D99", "#2D57F2"],
  mastercard: ["#DF6F29", "#C69347"],
  default: ["black", "gray"],

}

ccBgColor01.setAttribute('fill', colors[type][0]);
ccBgColor02.setAttribute('fill', colors[type][1]);
ccLogo.setAttribute('src', `cc-${type}.svg`)

}

// setCardType()
 // globalThis, deixa a função global
 globalThis.setCardType = setCardType

const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
  mask: "000"
};

const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expCode = document.querySelector('#expiration-date');
      
const date = String(new Date().getFullYear()).slice(2);
const date10 = String(new Date().getFullYear() + 10).slice(2);


const expCodePattern = {
  mask: "MM{/}YY",
  blocks: {
    
    YY: {
      mask: IMask.MaskedRange,
      from: `${date}`,
      to: `${date10}`,
    },

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,

    },
  },
}

const expCodeMasked = IMask(expCode, expCodePattern);

const cardNumber = document.querySelector('#card-number');

const cardNumberPattern = {

  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: 'visa'
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardtype: 'mastercard'
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: 'default',
    },

  ],
  dispatch: function(appended, dynamicMasked) {

     const number = (dynamicMasked.value + appended).replace(/\D/g,'');
     const foundMask = dynamicMasked.compiledMasks.find(function(item) { 
      
      return number.match(item.regex)

    })

    console.log(foundMask)
    return foundMask
  }
}


const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

// FORM 

const addButton = document.querySelector('#add-card');

const form = document.querySelector('form')

addButton.addEventListener('click', (e) => {

  alert('Clicado com sucesso!')

})

form.addEventListener('submit', (e) => {

  e.preventDefault()
});

const cardHolder = document.querySelector('#card-holder')

cardHolder.addEventListener('input', function() {
  const ccHolder = document.querySelector('.cc-holder .value')
  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value

})

// accept evento do IMask 
securityCodeMasked.on('accept', function() {
updateSecurityCode(securityCodeMasked.value)

})


function updateSecurityCode(code) {

  const ccSecurity = document.querySelector('.cc-security .value');
  ccSecurity.innerText = code.length === 0 ? '123' : code

}

cardNumberMasked.on('accept', () => {

  // Acessando o tipo da máscara do cartão e invocando função de cores e logos  de acordo com a máscara do cartão
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  //----------------------------------------------------------
  updateCardNumber(cardNumberMasked.value);
})


function updateCardNumber(number) {

  const ccNumber = document.querySelector('.cc-number');
  ccNumber.innerText = number.length === 0 ? '1234 5678 9012 3456' : number

}

expCodeMasked.on('accept', () => {


updateExpirationDate(expCodeMasked.value)

})

function updateExpirationDate(date) {

  const expDate = document.querySelector('.cc-extra .value');

  expDate.innerText = date.length === 0 ? `09/${date10}` : date 


}