//handle to ipc - for sending messages
//between back end and front end
const { ipcRenderer } = require("electron");
const cl = (x) => console.log(x);

// ========================================
// SPINNER

var loadingDiv = document.getElementById("loading");

function showSpinner() {
  loadingDiv.style.visibility = "visible";
}

function hideSpinner() {
  loadingDiv.style.visibility = "hidden";
}

// ========================================
// NAVBAR
var menu = document.querySelector(".menu");
var menuList = document.querySelector(".menu-items");

var menuOpened = false;

//hover over the menu icon -- opens the mini menu
menu.addEventListener("mouseover", function () {
  menuList.style.left = "0";
});
//meave the menu-icon hides mini-icons
menu.addEventListener("mouseleave", function () {
  menuList.style.left = "-81px";
});

menuList.addEventListener("mouseover", function () {
  menuList.style.width = "300px";
  menuList.style.left = "0";
});

menuList.addEventListener("mouseleave", function () {
  menuList.style.width = "80px";
  menuList.style.left = "-81px";
});

// ========================================
// SCAN
function scan() {
  let resultsElement = document.getElementById("results-container");
  deleteChildren(resultsElement);
  //send message to main process to perform scan
  ipcRenderer.send("scan-button-clicked", "click");
  //turn on spinner (loading)
  showSpinner();
}

// SCAN button listener
// needs to be BELOW the listener (ipcRenderer.on)
document.getElementById("scan").addEventListener("click", scan);

// ======================================== DISPLAY DATA FUNCTIONS

//remove all child elements
function deleteChildren(myNode) {
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
}
//multiply by 100 to get %
//multiply by 100 again and divide by 100 to round
let ratePercent = (rate) => Math.round((rate - 1) * 100 * 100) / 100;
//round to 2 decimal places
let roundToTwo = (x) => (x * 100) / 100;
//creates and appends attributes with values to elements
let addAttribute = (att, value, element) => {
  let a = document.createAttribute(att);
  a.value = value;
  element.setAttributeNode(a);
};

//handle to container
let resultsContainer = document.getElementById("results-container");

//abstract function that creates specified element with attribute and text
let createElement = (parent, element, text, attribute, attributeName) => {
  //create node
  let node = document.createElement(element);
  //add text node
  let textNode = document.createTextNode(text);
  // append text to node
  node.appendChild(textNode);
  //add attribute to element
  addAttribute(attribute, attributeName, node);
  //append div for each rate
  parent.appendChild(node);
  return node;
};

const getCurrency1 = (pair) => pair.substring(0, 3);
const getCurrency2 = (pair) => pair.substring(3, 7);

//returns number of keys
let getNumberOfKeys = (obj) => Object.keys(obj).length;

let insertResults = (obj) => {
  //turn off spinner (loading)
  hideSpinner();
  //save data for future reference
  let data = obj;
  //loop over all keys (rates)
  cl("this is the whole object after it gets passed to function ==========");
  cl(obj);
  Object.keys(obj).forEach((rate) => {
    let ele = createElement(resultsContainer, "div", "", "class", "result");
    createElement(
      ele,
      "div",
      "RETURN : " + ratePercent(rate) + " %",
      "class",
      "result-rate"
    );
    createElement(
      ele,
      "div",
      "JUMPS : " + getNumberOfKeys(data[rate]),
      "class",
      "result-numberOfJumps"
    );
    createElement(ele, "button", "DETAILS", "class", "result-button");

    //create handle to details element (starts hidden )
    let details = createElement(ele, "div", "", "class", "result-details");
    Object.keys(data[rate]).forEach((pair) => {
      let jump = createElement(details, "div", "", "class", "result-jump");
      let getMarketName = (obj) => data[rate][pair][2];
      let getRate = (obj) => data[rate][pair][1][0];
      createElement(
        jump,
        "span",
        getCurrency1(pair),
        "class",
        "result-jump-currency-1"
      );
      createElement(jump, "span", getRate(data), "class", "result-jump-rate");
      createElement(
        jump,
        "span",
        getCurrency2(pair),
        "class",
        "result-jump-currency-2"
      );
      createElement(
        jump,
        "div",
        getMarketName(data).toUpperCase(),
        "class",
        "result-jump-market"
      );
    });
  });
  getHandlesToButtons();
};
// ============================== DATA FROM SCAN

//receives scan data from main process
ipcRenderer.on("scan-data", (event, data) => {
  insertResults(JSON.parse(data));
});

function getHandlesToButtons() {
  function toggleResults(e) {
    //get the target of the event (click in this case)
    //and then get second sibling of this (button) element
    //first is Text, seoncd is the details div
    let x = e.target.nextSibling;
    //toggle between visible and not
    if (x.style.display === "") {
      x.style.display = "block";
    } else {
      x.style.display = "";
    }
  }

  let resultArray = document.getElementsByClassName("result-button");
  for (var i = 0; i < resultArray.length; i++) {
    resultArray[i].addEventListener("click", toggleResults);
  }
}

// ========================================
// FILTER RESULTS BY RETURN

function testRate(text, min) {
  let key = /[0-9]*\.[0-9]*/g;
  let result = text.match(key);
  let minimum = parseFloat(min);

  //hide element if its below minimum
  return result < minimum ? true : false;
}

function testJumps(text, max) {
  let key = /[0-9]/g;
  let result = text.match(key);
  let maximum = parseInt(max);
  cl(`result jump ${result}`);
  cl(`maximum  ${maximum}`);
  //hide element if over max
  cl(result > maximum);
  // return (result > maximum)? true : false
  if (result > maximum) {
    return true;
  } else {
    return false;
  }
}

let filterButton = document.getElementById("filterButton");
let minReturn = document.getElementById("min-return");
let maxJumps = document.getElementById("max-jumps");

function filterResults() {
  //minimum return
  let minR = minReturn.children[1].value;
  //max jumps
  let maxJ = maxJumps.children[1].value;

  let arr = document.querySelectorAll(".result");

  arr.forEach((ele) => {
    let children = ele.children;
    let rate = children[0].textContent;
    let jumps = children[1].textContent;
    let isReturnUnderMinimum = testRate(rate, minR);
    let areJumpsOverMaximum = testJumps(jumps, maxJ);
    if (isReturnUnderMinimum || areJumpsOverMaximum) {
      ele.style.display = "none";
    } else {
      ele.style.display = "";
    }
  });
}
//listener
filterButton.addEventListener("click", filterResults);
