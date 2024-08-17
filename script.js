const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@1/v1/currencies/";

// Define a fallback URL in case the primary URL fails
const FALLBACK_URL = "https://api.exchangerate-api.com/v4/latest/"; 

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".message"); 

for (let select of dropdowns) {
    for (currCode in countryList) { 
        let newOption = document.createElement("option");
        newOption.innerText = currCode; 
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount");
    let amtVal = amount.value; 
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1"; 
    }

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    
    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error('Primary URL failed');
        let data = await response.json();
        let rate = data[toCurr.value.toLowerCase()];
        let finalAmount = rate * amtVal;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        // Fallback mechanism
        console.error(error.message);
        const fallbackURL = `${FALLBACK_URL}${fromCurr.value.toUpperCase()}`;
        try {
            let response = await fetch(fallbackURL);
            if (!response.ok) throw new Error('Fallback URL failed');
            let data = await response.json();
            let rate = data.rates[toCurr.value.toUpperCase()];
            let finalAmount = rate * amtVal;
            msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
        } catch (error) {
            console.error('Both primary and fallback URLs failed:', error.message);
            msg.innerText = "Error retrieving exchange rate.";
        }
    }
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode]; 
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`; 
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});  

window.addEventListener("load", () => {
    updateExchangeRate();
});
