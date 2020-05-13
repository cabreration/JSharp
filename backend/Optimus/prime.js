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
                    lines = this.rules6n7(lines, true); // applying rule 7
                    prime.push(lines[0].print()); // temporales
                    prime.push('var p, h;');
                    prime.push('var heap[];')
                    prime.push('var stack[];')
                    for (let i = 1; i < lines.length; i++) {
                        let result = lines[i].print();
                        if (result != null && result != '\n' && result != '') {
                            prime.push(result);
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

    rules6n7(lines, flag) {
        for (let i = 0; i < lines.length; i++) {
            if (flag) {
                flag = false;
                continue;
            }

            let current = lines[i];
            if (current.getTypeOf() === 'conditional' || current.getTypeOf() === 'jump') {
                // the destination label
                let gt = current.label;
                for (let j = i + 1; j < lines.length; j++) {
                    let runner = lines[j];
                    if (runner.getTypeOf() === 'destination') {
                        if (gt === runner.label) {
                            // aqui veremos la siguiente etiqueta y si es un goto la cambiamos
                            if (j + 1 == lines.length)
                                break;
                            if (lines[j+1].getTypeOf() === 'jump') {
                                let original = current.print();
                                current.label = lines[j+1].label;
                                let prime = current.print();
                                Report.changes.push({regla: current.getTypeOf() === 'jump' ? 6 : 7, original: original, optimization: prime, linea: current.row });
                            }
                            break;
                        }
                    }
                }
            }
            else if (current.getTypeOf() === 'proc') {
                current.instructions = this.rules6n7(current.instructions, false);
            }
        }
        return lines;
    }

}

module.exports.Prime = Prime;

