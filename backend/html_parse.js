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


parseCSVWordBank("./profanity_en.csv")
    .then(profanityBank => console.log(profanityBank))
    .catch(error => console.error(error));
