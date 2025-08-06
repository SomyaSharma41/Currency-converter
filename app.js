const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

for(let select of dropdowns){
    for(currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        
        if(select.name === "from" && currCode === "USD"){
            newOption.selected = true;
        }
        else if(select.name === "to" && currCode === "INR"){
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) =>{
        updateFlag(evt.target);
    })
};

const updateExchangeRate = async() =>{
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value
    if (amtVal === "" || amtVal <1){
        amtVal = 1;
        amount.value = "1";
    }

    const fromCode = fromCurr.value;
    const toCode = toCurr.value;

    const URL = `${BASE_URL}/${fromCode}`;

    // console.log("Calling URL:", URL);

    try {
    let response = await fetch(URL);
    let data = await response.json();

    // console.log("API Response:", data);

    if (!data.rates || !data.rates[toCode]) {
            throw new Error("Invalid API response or currency not supported.");
        }

        const rate = data.rates[toCode];
        const finalAmount = rate * amtVal;

        document.querySelector(".msg").innerText =
            `${amtVal} ${fromCode.toUpperCase()} = ${finalAmount.toFixed(2)} ${toCode.toUpperCase()}`;

    } catch (err) {
        console.error("Fetch failed:", err);
        document.querySelector(".msg").innerText = `Error fetching exchange rate.`;
    }
};

const updateFlag = (element) =>{
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) =>{
    evt.preventDefault();
    updateExchangeRate();
});


window.addEventListener("load", () =>{
    updateExchangeRate();
});


