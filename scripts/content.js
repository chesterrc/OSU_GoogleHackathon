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

// Sorry Jeremy, commenting this out for testing ------

// DEPENDENT ON COMMENTED getTextNodes() FUNCTION
// const textNodesArray = getTextNodes(rootElement);



// function checkArrayPresence(targetArray, indexArray) {
//   let censor_words = []
//   for (let i = 0; i < indexArray.length; i++) {
//     if (targetArray.isArray(indexArray[i])) {
//       censor_words.push(indexArray[i]);
//     }
//   }

//   return censor_words;
// }

// const pathToCSV = './backend/profanity_en.csv'
// getProfanityBank(pathToCSV).then(res => {
//   console.log(res)
//   let words_to_censor = checkArrayPresence(textNodesArray, res);
// });

// ------



console.log("Content script loaded");

async function fetchWordBank() {
    try {
        const response = await fetch(chrome.runtime.getURL('data/wordBank.json'));
        const wordBankArray = await response.json();
        return wordBankArray;
    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
    }
}

async function isProfanity(wordBank, word, start, end) {
    /**
     * Uses divide and conquer technique to check a word against
     * a word bank
     * @param  {Array} wordBank     An array of profanity.
     * @param  {String} word        The word to check.
     * @param  {Number} start       The start of the subarray to check.
     * @param  {Number} end         The end of the subarray to check.
     * @return {Boolean}            If the word is a profanity
    */
    if (start > end) {
        return false; // Base case: word not found
    }
    
    const midNumber = Math.floor((start + end) / 2);
    const midWord = wordBank[midNumber];
    if (word.toLowerCase() === midWord.toLowerCase()) {
        return true; // Word found
    } else if (word.toLowerCase() < midWord) {
        return isProfanity(wordBank, word, start, midNumber - 1); // Search in the left half
    } else {
        return isProfanity(wordBank, word, midNumber + 1, end); // Search in the right half
    }
}


function wordGenerator(string) {
    /**
     * Processes a given string, censoring words identified as profane.
     * Function splits the input string into words, checks each word for profanity,
     * and replaces profane words with asterisks.
     *
     * @param {string} string   The string to be processed.
     * @returns {string[]}      An array of words from the original string with profane words censored.
     *                          Each censored word is replaced with asterisks (*) of the same length as the word.
     */
    const words = string.split(' ').filter(w => w !== '');

    for (let i=0; i < words.length; i++) {
        if (isProfanity(data, words[i], 0, data.length-1) === true) {
            words[i] = '*'.repeat(words[i].length) // censor word
        }
    }
    return words.join(' ')
}

async function useWordBank() {
    const wordBank = await fetchWordBank();
    // console.log(wordBank[wordBank.length-1])
    const all = document.getElementsByTagName("*");
    // console.log(all[200].textContent);
    // for (const char of all[200].textContent) {
    //     console.log(char)
    // }
    for (let i=0, max=all.length; i < max; i++) {
        // all[i].textContent = wordGenerator
        console.log(all[i].textContent)
    }
}
  
useWordBank();


