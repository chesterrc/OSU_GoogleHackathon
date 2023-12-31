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
    const words = string.split(/(\b|\W+)/).filter(w => w !== '');
    let profanityCount = 0;

    for (let i = 0; i < words.length; i++) {
        if (isProfanity(wordBank, words[i], 0, wordBank.length - 1)) {
            profanityCount += 1;
            words[i] = '*'.repeat(words[i].length); // censor word
        }
    }

    return { censoredText: words.join(''), profanityCount };
}

function storeProfanityCount(profanityCount) {
    chrome.storage.local.set({ profanityPageCount: profanityCount })
        .then(() => {
            console.log(`Set Profanity count for page ${profanityCount}`);
        });

    chrome.storage.local.get(["totalProfanity"]).then((result) => {
        const total = profanityCount + result["totalProfanity"];
        chrome.storage.local.set({ totalProfanity: total })
            .then(() => {
                console.log(`totalProfanity count ${total}`);
            });
    }).catch((error) => {
        chrome.storage.local.set({ totalProfanity: profanityCount })
            .then(() => {
                console.log("Set totalProfanity count");
            });
    });
}

async function main() {
    console.time("Exec Time");

    const wordBank = await fetchWordBank();
    chrome.storage.local.get(['state']).then(function (data) {
        console.log(data.state);
        if (data.state === 'on') {
            let profanityCount = 0;

            const paragraphs = document.body.getElementsByTagName("p");
            for (const paragraph of paragraphs) {
                const result = wordGenerator(paragraph.textContent, wordBank);
                paragraph.textContent = result.censoredText;
                profanityCount += result.profanityCount;
            }

            const arrayOfElements = ["h1", "h2", "h3", "h4", "h5", "h6"];

            for (let i = 0; i < arrayOfElements.length; i++) {
                const nodes = document.body.getElementsByTagName(arrayOfElements[i]);
                if (nodes.length) {
                    for (const node of nodes) {
                        node.childNodes.forEach(item => {
                            const result = wordGenerator(item.textContent, wordBank);
                            node.textContent = result.censoredText;
                            profanityCount += result.profanityCount;
                        });
                    }
                }
            }

            const links = document.body.getElementsByTagName("a");
            if (links.length) {
                for (const link of links) {
                    if (link.childNodes) {
                        link.childNodes.forEach(item => {
                            const result = wordGenerator(item.textContent, wordBank);
                            link.textContent = result.censoredText;
                            profanityCount += result.profanityCount;
                        });
                    }
                    else {
                        const result = wordGenerator(link.textContent, wordBank);
                        node.textContent = result.censoredText;
                        profanityCount += result.profanityCount;
                    }
                }
            }

            try {
                const arrayOfElementsSpec = ["cite", "li", "i"];
                for (let i = 0; i < arrayOfElementsSpec.length; i++) {
                    const lists = document.body.getElementsByTagName(arrayOfElementsSpec[i]);
                    if (lists.length) {
                        for (const list of lists) {
                            list.childNodes.forEach(item => {
                                if (item.tagName.toLowerCase() !== "style") {
                                    const result = wordGenerator(item.textContent, wordBank);
                                    item.textContent = result.censoredText;
                                    profanityCount += result.profanityCount;
                                }
                            });
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
            storeProfanityCount(profanityCount);
        }
    });

    console.timeEnd("Exec Time");
}



// const arrayOfSpecElements = ["li", "cite", "i"];

    // for (let i = 0; i < arrayOfSpecElements.length; i++) {
    //     const nodes = document.body.getElementsByTagName(arrayOfSpecElements[i]);
        
    //     if (nodes && nodes.length) {
    //         for (const node of nodes) {
    //             if (node.childNodes && node.parentNode) {
    //                 node.childNodes.forEach(item => {
    //                     if (item && item.nodeType === 1 && item.tagName) {
    //                         if (item.tagName.toLowerCase!== "style") {
    //                             const result = wordGenerator(item.textContent, wordBank);
    //                             item.textContent = result.censoredText;
    //                             profanityCount += result.profanityCount;
    //                         }
    //                     }
    //                 });
    //             }
    //         }
    //     }
    // }



    // const arrayOfSpecElements = ["li", "cite", "i"];

    // for (let i = 0; i < arrayOfSpecElements.length; i++) {
    //     const nodes = document.body.getElementsByTagName(arrayOfSpecElements[i]);
        
    //     if (nodes && nodes.length) {
    //         for (const node of nodes) {
    //             if (node.childNodes && node.parentNode) {
    //                 node.childNodes.forEach(item => {
    //                     if (item && item.nodeType === 1 && item.tagName) {
    //                         if (item.tagName.toLowerCase!== "style") {
    //                             const result = wordGenerator(item.textContent, wordBank);
    //                             item.textContent = result.censoredText;
    //                             profanityCount += result.profanityCount;
    //                         }
    //                     }
    //                 });
    //             }
    //         }
    //     }
    // }
    

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

  
main();


