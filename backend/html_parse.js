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
        return profanityBank;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function main() {
    const wordBank = await getProfanityBank('./profanity_en.csv');
    // Use wordBank here, it's the array you wanted
    console.log(wordBank);
}

main();
