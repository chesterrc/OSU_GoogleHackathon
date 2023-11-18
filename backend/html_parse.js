const fs = require('fs')
const { parse } = require("csv-parse");


function parseCSVWordBank(pathToCSV) {
    return new Promise((resolve, reject) => {
        let profanityBank = [];
        fs.createReadStream(pathToCSV)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
                for (const word of row) {
                    if (word.length > 0) {
                        profanityBank.push(word);
                    }
                }
            })
            .on("error", function (error) {
                reject(error);
            })
            .on("end", function () {
                resolve(profanityBank);
            });
    });
}

async function getProfanityBank(pathToCSV) {
    try {
        const profanityBank = await parseCSVWordBank(pathToCSV);

        let uniqueChars = [];
        profanityBank.forEach((word) => {
            if (!uniqueChars.includes(word)) {
                uniqueChars.push(word);
            }
        });
        return uniqueChars;
    } catch (error) {
        console.error(error);
        return [];
    }
}



async function main() {
    const wordBank = await getProfanityBank('./profanity_en.csv');
    const body = document.querySelector("article");
}

// main();

module.exports = {
    parseCSVWordBank,
    getProfanityBank
}