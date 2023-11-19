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

// ================================================


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

function isProfanity(wordBank, word, start, end) {
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


function wordGenerator(string, wordBank) {
    /**
     * Processes a given string, censoring words identified as profane.
     * Function splits the input string into words, checks each word for profanity,
     * and replaces profane words with asterisks.
     *
     * @param {String} string   The string to be processed.
     * @returns {String[]}      An array of words from the original string with profane words censored.
     *                          Each censored word is replaced with asterisks (*) of the same length as the word.
     */

    const words = string.split(/(\b|\W+)/).filter(w => w !== '');
    // Change filtering method to account for special characters in passed strings. Can be optimized?
    let profanityCount = 0;

    for (let i=0; i < words.length; i++) {
        if (isProfanity(wordBank, words[i], 0, wordBank.length-1) === true) {
            profanityCount = profanityCount + 1
            words[i] = '*'.repeat(words[i].length) // censor word
        }
    }
    return { censoredText: words.join(''), profanityCount }
}


function storeProfanityCount(profanityCount) {
    /**
     * Stores the profanity count of a page and total profanity count
     * in local storage.
     *
     * @param {Number} profanityCount   The total profanity count on a page
     * @todo    Delete console.log for prod
     */

    chrome.storage.local.set({ profanityPageCount: profanityCount })
    .then(() => {
        console.log(`Set Profanity count for page ${profanityCount}`)
    })

    // Add profanityCount to the lifetime profanity count
    chrome.storage.local.get(["totalProfanity"]).then((result) => {
        total = profanityCount + result["totalProfanity"]
        chrome.storage.local.set({ totalProfanity: total })
        .then(() => {
            console.log(`totalProfanity count ${total}`);
        })
      })
      .catch((error) => {
        chrome.storage.local.set({ totalProfanity: profanityCount })
        .then(() => {
            console.log("Set totalProfanity count");
        })
      });
}


async function main() {
    /**
     * Main function where we run everything.....
     * @todo Figure out how to traverse all the nodes in the body.
     *       Currently, the last for loop in this function breaks the webpage but that is
     *       because it edits the head of a dom tree. We need to edit only the body
     */

    console.time("Exec Time");

    const wordBank = await fetchWordBank();

    chrome.storage.sync.get('state', function(data) {
        console.log(data.state)
        if (data.state === 'on') {
            let profanityCount = 0;

            const paragraphs = document.body.getElementsByTagName("p");
            for (const paragraph of paragraphs) {
                const result = wordGenerator(paragraph.textContent, wordBank);
                paragraph.textContent = result.censoredText;
                profanityCount += result.profanityCount;
            }
        
            const arrayOfElements = ["h1", "h2", "h3", "h4", "h5", "h6", "a"];
        
            for (let i = 0; i < arrayOfElements.length; i++) {
                const nodes = document.body.getElementsByTagName(arrayOfElements[i]);
                if (nodes.length){
                    for (const node of nodes) {
                        node.childNodes.forEach(item => {
                            const result = wordGenerator(item.textContent, wordBank);
                            node.textContent = result.censoredText;
                            profanityCount += result.profanityCount;
                        })
                    }
                }
            }

            storeProfanityCount(profanityCount)

        }
    });




    // const arrayOfElementsSpec = ["cite", "li", "i"];
    // for (let i = 0; i < arrayOfElementsSpec.length; i++) {
    //     const lists = document.body.getElementsByTagName(arrayOfElementsSpec[i]);
    //     if (lists.length) {
    //         for (const list of lists) {
    //             list.childNodes.forEach(item => {
    //                 if (item.tagName.toLowerCase() !== "style") {
    //                     const result = wordGenerator(item.textContent, wordBank);
    //                     item.textContent = result.censoredText;
    //                     profanityCount += result.profanityCount;
    //                 }
    //             });
    //         }
    //     }
    // }
    


    console.timeEnd("Exec Time");


    // TODO: Fix CSS changing because of text changes

    //     const nodes = document.body.getElementsByTagName(arrayOfElements[i])
    //     console.log(nodes);
    //     for (const node of nodes) {
    //         const result = wordGenerator(node.innerHTML, wordBank)
    //         node.textContent = result.censoredText
    //         profanityCount += result.profanityCount
    //     }
    // }

    // console.log(profanityCount)

    // console.log(all[200].textContent);
    // for (const char of all[200].textContent) {
    //     console.log(char)
    // }


    // // --- Testing ---
    // // console.log(all[0].textContent)
    // console.log(all[612].textContent)
    // let result = wordGenerator(all[612].textContent, wordBank)
    // all[612].textContent = result.censoredText
    // profanityCount += result.profanityCount
    // console.log(all[612].textContent)
    // console.log(profanityCount)

    // // Store profanityCount of the page
    // storeProfanityCount(profanityCount)

    // @TODO
    // for (let i=0, max=all.length; i < max; i++) {
    //     all[i].textContent = wordGenerator(all[i].textContent, wordBank)
    //     console.log(all[i].textContent)
    // }
}
  
main();


