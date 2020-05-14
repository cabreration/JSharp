const parser = require('./Jison/tdc')
const fs = require('fs');
const Report = require('./report').Report;
const Jump = require('./Logic/jump').Jump;

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
                    let b = this.blocks(lines, true, null);
                    this.blocksDot(b)
                    lines = this.rule1(lines, true);
                    lines = this.rule2(lines, true);
                    lines = this.rule3(lines, true);
                    lines = this.rules4n5(lines, true);
                    lines = this.rules6n7(lines, true);
                    // lines = this.rule19(lines, true);
                    lines = this.rule20(lines, true);
                    // lines = this.rule23(lines, true, null);
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

    rule1(lines, flag) {
        for (let i = 0; i < lines.length; i++) {
            if (flag) {
                flag = false;
                continue;
            }

            let current = lines[i];
            if (current == null) {
                continue;
            }

            if (current.getTypeOf() === 'asignment') {
                if (current.rule1Form()) {
                    let name = current.left.value;
                    let other = current.right.arg1;
                    for (let j = i + 1; j < lines.length; j++) {
                        let asig = lines[j];
                        if (asig == null) {
                            continue;
                        }
                        if (asig.getTypeOf() === 'destination') {
                            break;
                        }
                        if (asig.getTypeOf() === 'asignment') {
                            if (asig.left.value === name) {
                                break;
                            }
                            else if (asig.right.arg1 === name && asig.left.value === other) {
                                Report.changes.push({ regla: 1, original: asig.print(), optimizacion: '', linea: asig.row });
                                lines[j] = null;
                            }
                        }
                    }
                }
            }
            else if (current.getTypeOf() === 'proc') {
                current.instructions = this.rule1(current.instructions, false);
            }
        }
        lines = lines.filter(val => val != null);
        return lines;
    }

    rule2(lines, flag) {
        for (let i = 0; i < lines.length; i++) {
            if (flag) {
                flag = false;
                continue;
            }

            let current = lines[i];
            if (current == null) {
                continue;
            }
            if (current.getTypeOf() === 'jump') {
                let flag = false;
                for (let j = i + 1; j < lines.length; j++) {
                    if (lines[j].getTypeOf() === 'destination') {
                        if (current.label === lines[j].label) {
                            flag = true;
                        }
                        break;
                    }
                }
                if (flag) {
                    // puedo eliminar todas las instrucciones
                    let original = '';
                    let prime = '';
                    for (let j = i; j < lines.length; j++) {
                        if (lines[j].getTypeOf() === 'destination') {
                            prime = lines[j].print();
                            break;
                        }
                        original += lines[j].print() + '\n';
                        lines[j] = null;
                    }
                    Report.changes.push({regla: 2, original: original, optimzacion: prime, linea: current.row});
                }
            }
            else if (current.getTypeOf() === 'proc') {
                current.instructions = this.rule2(current.instructions, false);
            }
        }
        lines = lines.filter(val => val != null);
        return lines;
    }

    rule3(lines, flag) {
        for (let i = 0; i < lines.length; i++) {
            if (flag) {
                flag = false;
                continue;
            }

            let current = lines[i];
            if (current == null) {
                continue;
            }
            if (current.getTypeOf() === 'conditional') {
                let lab = current.label;
                let cond = current.condition;
                if (i+1 < lines.length) {
                    let jmp = lines[i+1];
                    if (jmp.getTypeOf() === 'jump') {
                        if (i + 2 < lines.length) {
                            let dest = lines[i + 2];
                            if (dest.getTypeOf() === 'destination' && dest.label === lab) {
                                // All the conditions met, now update
                                let original = current.print();
                                original += '\n' + jmp.print();
                                original += '\n' + dest.print();
                                let neg = cond.negate();
                                let prime = `if ${neg} goto ${dest.label};`;
                                lines[i + 1] = null;
                                lines[i + 2] = null;
                                lines[i].label = dest.label;
                                Report.changes.push({regla: 3, original: original, optimizacion: prime, linea: current.row});
                            }
                        }
                    }
                }
            }
            else if (current.getTypeOf() === 'proc') {
                current.instructions = this.rule3(current.instructions, false);
            }
        }
        lines = lines.filter(val => val != null);
        return lines;
    }

    rules4n5(lines, flag) {
        for (let i = 0; i < lines.length; i++) {
            if (flag) {
                flag = false;
                continue;
            }

            let current = lines[i];
            if (current == null) {
                continue;
            }
            if (current.getTypeOf() === 'conditional') {
                let cond = current.condition
                let label = current.label;
                if (typeof(cond.arg1)==='number' && typeof(cond.arg2)==='number') {
                    let res;
                    switch (cond.operator) {
                        case "<>":
                            res = cond.arg1 != cond.arg2;
                            break;
                        case "==":
                            res = cond.arg1 == cond.arg2;
                            break;
                        case ">=":
                            res = cond.arg1 >= cond.arg2;
                            break;
                        case "<=":
                            res = cond.arg1 <= cond.arg2;
                            break;
                        case ">":
                            res = cond.arg1 >cond.arg2;
                            break;
                        case "<":
                            res = cond.arg1 < cond.arg2;
                            break;
                    }
                    if (res) {
                        if (i+1 < lines.length && lines[i+1].getTypeOf() === 'jump') {
                            let original = current.print();
                            let prime = '';
                            original += '\n' + lines[i+1].print();
                            lines[i+1]= null;    
                            lines[i] = new Jump(label, current.row);
                            prime = lines[i].print();
                            Report.changes.push({regla: 4, original: original, optimizacion: prime, linea: current.row})
                        }
                    }
                    else {
                        if (i + 1 < lines.length && lines[i+1].getTypeOf() === 'jump') {
                            let original = current.print();
                            let prime = '';
                            original += '\n'+ lines[i+1].print();
                            prime = lines[i+1].print();    
                            Report.changes.push({regla: 5, original: original, optimizacion: prime, linea: current.row});
                            lines[i] = null;
                        }
                    }
                }
            }
            else if (current.getTypeOf() === 'proc') {
                current.instructions = this.rules4n5(current.instructions, false);
            }
        }
        lines = lines.filter(val => val != null);
        return lines;
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
                                Report.changes.push({regla: current.getTypeOf() === 'jump' ? 6 : 7, original: original, optimizacion: prime, linea: current.row });
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

    rule19(lines, flag) {
        for (let i = 0; i < lines.length; i++) {
            if (flag) {
                flag = false;
                continue;
            }

            let current = lines[i];
            if (current == null) {
                continue;
            }

            if (current.getTypeOf() === 'conditional') {
                let cond = current.condition
                let label = current.label;
                if (typeof(cond.arg1)==='number' && typeof(cond.arg2)==='number') {
                    let res;
                    switch (cond.operator) {
                        case "<>":
                            res = cond.arg1 != cond.arg2;
                            break;
                        case "==":
                            res = cond.arg1 == cond.arg2;
                            break;
                        case ">=":
                            res = cond.arg1 >= cond.arg2;
                            break;
                        case "<=":
                            res = cond.arg1 <= cond.arg2;
                            break;
                        case ">":
                            res = cond.arg1 >cond.arg2;
                            break;
                        case "<":
                            res = cond.arg1 < cond.arg2;
                            break;
                    }
                    if (!res) {
                        let state = false;
                        let original = '';
                        for (let j = i + 1; j < lines.length; j++) {
                            let now = lines[j];
                            if (now.getTypeOf() === 'destination' && now.label === label) {
                                state = true;
                            }
                            else if (now.getTypeOf() === 'destination' && now.label != label) {
                                if (state) {
                                    break;
                                }
                            }

                            if (state) {
                                original += lines[j].print() + '\n';
                                lines[j] = null;
                            }
                        }
                        if (original != '') {
                            Report.changes.push({regla: 19, original: original, optimizacion: '', linea: current.row});
                        }
                    }
                }
            }
            else if (current.getTypeOf() === 'proc') {
                current.instructions = this.rules4n5(current.instructions, false);
            }

        }
        lines = lines.filter(val => val != null);
        return lines;
    }

    rule20(lines, flag) {
        for (let i = 0; i < lines.length; i++) {
            if (flag) {
                flag = false;
                continue;
            }

            let current = lines[i];
            if (current == null) {
                continue;
            }
            if (current.getTypeOf() === 'jump') {
                let original = '';
                for (let j = i + 1; j < lines.length; j++) {
                    let now = lines[j];
                    if (now.getTypeOf() === 'destination') {
                        break;
                    }
                    else {
                        original += lines[j].print() + '\n';
                        lines[j] = null;
                    }
                }
                if (original != '') {
                    Report.changes.push({regla: 20, original: original, optimizacion: '', linea: current.row});
                }
            }
            else if (current.getTypeOf() === 'proc') {
                current.instructions = this.rule20(current.instructions, false);
            }
        }
        lines = lines.filter(val => val != null);
        return lines;
    }

    rule21(lines, flag) {
        for (let i = 0; i < lines.length; i++) {
            if (flag) {
                flag = false;
                continue;
            }

            let current = lines[i];
            // solo pueden usarse de forma valida los que el lado izquierdo no aparece en el lado derecho
        }
    }

    rule22(lines, flag) {}

    rule23(lines, flag, container) {
        let wholeA = [];
        let wholeP = [];
        let wholeC = [];
        if (flag) {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].getTypeOf() === 'asignment') {
                    wholeA.push(lines[i]);
                }
                else if (lines[i].getTypeOf() === 'print') {
                    wholeP.push(lines[i]);
                }
                else if (lines[i].getTypeOf() === 'conditional') {
                    wholeC.push(lines[i]);
                }
                else if (lines[i].getTypeOf() === 'proc') {
                    for (let j = 0; j < lines[i].instructions.length; j++) {
                        let ins = lines[i].instructions[j];
                        if (ins.getTypeOf() === 'asignment') {
                            wholeA.push(ins);
                        }
                        else if (ins.getTypeOf() === 'print') {
                            wholeP.push(ins);
                        }
                        else if (ins.getTypeOf() === 'conditional') {
                            wholeC.push(ins);
                        }
                    }
                }
            }
        }
        else {
            wholeA = container.wholeA;
            wholeP = container.wholeP;
            wholeC = container.wholeC;
        }
        

        for (let i = 0; i < lines.length; i++) {
            if (flag) {
                flag = false;
                continue;
            }

            let current = lines[i];
            if (current == null) {
                continue;
            }
            if (current.getTypeOf() === 'asignment') {
                if (current.left.type === 1 && current.left.value != 'p' && current.left.value != 'h') {
                    let name = current.left.value;
                    let ocurrencies = wholeA.filter(el => el.right.arg1 == name || el.right.arg2 == name);
                    if (ocurrencies.length > 0) {
                        continue;
                    }
                    ocurrencies = wholeP.filter(el => el.value == name);
                    if (ocurrencies.length > 0) {
                        continue;
                    }
                    ocurrencies = wholeC.filter(el => el.condition.arg1 == name || el.condition.arg2 == name);
                    if (ocurrencies.length > 0) {
                        continue;
                    }
                    lines[i] = null;
                }
            }
            else if (current.getTypeOf() === 'proc') {
                current.instructions = this.rule23(current.instructions, false, { wholeA: wholeA, wholeP: wholeP, wholeC: wholeC });
            }
        }   
        lines = lines.filter(val => val != null);
        return lines;
    }

    rule24(lines, flag) {} 

    blocks(lines, flag, id) {
        // un bloque tiene las instrucciones y etiqueta del bloque al que saltaria y su etiqueta propia
        let blocks = [];
        let runner = '';
        let runLabel = id;
        let runJump = null;
        if (flag) {
            runLabel = 'node0';
            runner = 'var temps_list\nvar p, h;\nvar heap[];\nvar stack[];';
        }

        for (let i = 0; i < lines.length; i++) {
            if (flag) {
                flag = false;
                continue;
            }
            let current = lines[i];
            if (current.getTypeOf() === 'conditional') {
                let lab = runLabel == null ? blocks.length : runLabel;
                runJump = current.label;
                if (runner == '') {
                    blocks.push( { instructions: current.print(), label: lab, jump: runJump, elseJump: blocks.length+1});
                }
                else {
                    blocks.push({instructions: runner, label: lab, jump: blocks.length + 1, elseJump: null});
                    blocks.push({ instructions: current.print(), label: blocks.length, jump: runJump, elseJump: blocks.length+1 });
                }
                runner = '';
                runLabel = null;
                runJump = null;
            }
            else if (current.getTypeOf() === 'jump') {
                let lab = runLabel == null ? blocks.length : runLabel;
                runJump = current.label;
                if (runner == '') {
                    blocks.push( { instructions: current.print(), label: lab, jump: runJump, elseJump: null});
                }
                else {
                    blocks.push({instructions: runner, label: lab, jump: blocks.length + 1, elseJump: null});
                    blocks.push({ instructions: current.print(), label: blocks.length, jump: runJump, elseJump: null });
                } 
                runner = '';
                runLabel = null;
                runJump = null;
            }
            else if (current.getTypeOf() === 'destination') {
                if (runner == '') {
                    runLabel = current.label;
                }
                else {
                    let lab = runLabel == null ? blocks.length : runLabel;
                    blocks.push({ instructions: runner, label: lab, jump: current.label, elseJump: null });
                    runLabel = current.label;
                    runner = '';
                }
            }
            else if (current.getTypeOf() === 'call') {
                let lab = runLabel == null ? blocks.length : runLabel;
                runJump = current.id;
                if (runner == '') {
                    blocks.push( { instructions: current.print(), label: lab, jump: runJump, elseJump: null});
                }
                else {
                    blocks.push({instructions: runner, label: lab, jump: blocks.length + 1, elseJump: null});
                    blocks.push({ instructions: current.print(), label: blocks.length, jump: runJump, elseJump: null });
                } 
                runner = '';
                runLabel = null;
                runJump = null;
            }
            else if (current.getTypeOf() === 'proc') {
                // probably should call another method to take care of this
                let b = this.blocks(current.instructions, false, current.id);
                b.forEach(sq => {
                    if (typeof(sq.jump) === 'number') {
                        sq.jump = blocks.length + sq.jump - 1;
                    }
                    if (typeof(sq.label) === 'number') {
                        sq.label = blocks.length;
                    }
                    if (typeof(sq.elseJump) === 'number') {
                        sq.elseJump = blocks.length + sq.elseJump - 2;
                    }
                    blocks.push(sq);
                });
                blocks[blocks.length - 1].jump = blocks.length;
                blocks.push({ instructions: 'end', label: blocks.length, jump: null, elseJump: null });
            }
            else {
                if (current.getTypeOf() === 'print')
                    runner += 'print\n';
                else
                    runner += current.print() + '\n';
                if (i + 1 == lines.length) {
                    let lab = runLabel == null ? blocks.length : runLabel;
                    blocks.push( { instructions: runner, label: lab, jump: blocks.length, elseJump: null} );
                }
            }
        }

        return blocks;
    }

    blocksDot(blocks) {
        let dot = [];
        dot.push(`digraph G {\n node[shape=box]`);
        // nodos
        blocks.forEach(block => {
            if (typeof(block.label) === 'number') {
                dot.push(`node${block.label}[label="${block.instructions}"]`);
                block.label = `node${block.label}`;
            }
            else {
                dot.push(`${block.label}[label="${block.instructions}"]`);
            }
        })

        blocks.forEach(block => {
            if (block.jump != null) {
                if (typeof(block.jump) === 'number') {
                    dot.push(`${block.label}->node${block.jump}`);
                }
                else {
                    dot.push(`${block.label}->${block.jump}`);
                }
            }

            if (block.elseJump != null) {
                if (typeof(block.elseJump) === 'number') {
                    dot.push(`${block.label}->node${block.elseJump}`);
                }
                else {
                    dot.push(`${block.label}->${block.elseJump}`);
                }
            }
        })

        dot.push('}');
        // relaciones
        let joined = dot.join('\n');
        fs.writeFile('./Testing/blocks.dot', joined, (err, file) => {
            if (err)
                console.log(err);
        });

        return joined;
    }
}

module.exports.Prime = Prime;

