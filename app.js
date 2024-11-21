const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selections
    if (select.name === "from" && currCode === "INR") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "USD") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Add event listener to update the flag when currency is changed
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update the exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Set amount to 1 if input is invalid
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Construct the URL to fetch data from the API
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    // Fetch the data
    let response = await fetch(URL);
    let data = await response.json();

    // Retrieve the exchange rate from the data
    let rateData = data[fromCurr.value.toLowerCase()];
    if (rateData && rateData[toCurr.value.toLowerCase()]) {
      let rate = rateData[toCurr.value.toLowerCase()];
      let finalAmount = amtVal * rate;

      // Display the exchange rate result
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } else {
      // Handle case where the exchange rate is not available
      msg.innerText = `Exchange rate for ${fromCurr.value} to ${toCurr.value} is not available.`;
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Failed to fetch exchange rate. Please try again later.";
  }
};

// Function to update the flag image when currency is changed
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Event listener to fetch exchange rate when the button is clicked
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); // Prevent form submission
  updateExchangeRate(); // Call the function to update the exchange rate
});

// Fetch the exchange rate when the page loads
window.addEventListener("load", () => {
  updateExchangeRate();
});
