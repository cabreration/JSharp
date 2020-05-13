const parser = require('./Jison/tdc')
const fs = require('fs');
const Report = require('./report').Report;

class Prime {

    constructor() {

    }

    optimization() {
        console.log('optimus prime');
        fs.readFile('./Testing/test3DC.txt', 'utf8', (err, text) => {
            if (err) {
                console.error(err);
            }
            else {
                try {

                    // aqui optimizo el codigo
                    let lines = parser.parse(text);
                    let prime = [];
                    prime.push(lines[0].print()); // temporales
                    prime.push('var p, h;');
                    prime.push('var heap[];')
                    prime.push('var stack[];')
                    for (let i = 1; i < lines.length; i++) {
                        let result = lines[i].print();
                        if (result != null && result != '\n' && result != '') {
                            prime.push(lines[i].print());
                        }
                    }
                    fs.writeFile('./Testing/prime.txt', prime.join('\n'), (err, file) => {
                        if (err)
                            console.log(err);
                    });
                    console.log('done');
                    console.log(Report.changes);
                }
                catch (e) {
                    console.error(e);
                }
            }
        }); 
    }    

}

module.exports.Prime = Prime;

