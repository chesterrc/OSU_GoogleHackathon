const fs = require('fs')
const { parse } = require("csv-parse");
const { getProfanityBank } = require("../backend/html_parse.js");
const { parseCSVWordBank } = require("../backend/html_parse.js");

// === TODO ===
// Take array of words to censor and use DOM manipulation to find and censor each word.
// ============


// === FOR OBTAINING TEXT AS ARRAY FROM WEBPAGE (UNCOMMENT FOR TESTING/PROD) ===
// function getTextNodes(element) {

//   let textNodes = [];

//   function traverse(element) {
//       if (element.nodeType === 3) {
//           let obtained_val = element.nodeValue.trim().toLowerCase();
//           const regex = /[.,'(){}[\]<>?!@#\$%""^/&*;:]/g;
//           let f_obtained = obtained_val.replace(regex, '');

//           if (f_obtained.includes(" ")) {
//             if (f_obtained != " " || f_obtained != "") {
//               let f_val = f_obtained.split(" ");
//               for (var i = 0; i < f_val.length; i++) {
//                   textNodes.push(f_val[i]);
//               }
//             }
//           }

//           else if (f_obtained != "") {
//               textNodes.push(f_obtained);
//           }
          
//       } else {
//           for (let i = 0; i < element.childNodes.length; i++) {
//               traverse(element.childNodes[i]);
//           }
//       }
//   }

//   traverse(element);
//   return textNodes;
// }

// const rootElement = document.body;

// ================================================

// DEPENDENT ON COMMENTED getTextNodes() FUNCTION
const textNodesArray = getTextNodes(rootElement);

// ================================================

// Checks for presence of censored words in Webpage array
// (NOTE) To be updated depending on final implementation (i.e. store array as JSON vs. function calls)
function checkArrayPresence(targetArray, indexArray) {
  let censor_words = []
  for (let i = 0; i < indexArray.length; i++) {
    if (targetArray.isArray(indexArray[i])) {
      censor_words.push(indexArray[i]);
    }
  }
  return censor_words;
}

// ================================================

// MAIN BACKEND LOGIC BELOW
const pathToCSV = './backend/profanity_en.csv'
getProfanityBank(pathToCSV).then(res => {
  let words_to_censor = checkArrayPresence(textNodesArray, res);
});