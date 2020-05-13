const Report = require('../report').Report;

class AsignmentTDC {
    constructor(left, right, row) {
        this.left = left;
        this.right = right;
        this.row = row;
    }

    getTypeOf() {
        return 'asignment';
    }

    print() {
        // Optimizar antes de imprimir
        if (this.left.type === 3) {
            // a heap
            return `heap[${this.left.value}] = ${this.right.getNormal()};`;
        }
        else if (this.left.type === 2) {
            // a stack
            return `stack[${this.left.value}] = ${this.right.getNormal()};`
        }
        else {
            // evaluate if a optimizacion can be performed
            //return `${this.left.value} = ${this.right.getNormal()};`;
            return this.performOptimization();
        }
    }

    performOptimization() {
        let original = `${this.left.value} = ${this.right.getNormal()};`
        if (this.right.type === 2 && this.right.operator === '+' ) {
            // regla 8
            if ((this.right.arg1 == this.left.value && this.right.arg2 == 0) 
            || (this.right.arg1 == 0 && this.right.arg2 == this.left.value)) {
                Report.changes.push({ regla: 8, original: original, optimizacion: '', linea: this.row });
                return null;
            }
            // regla 12
            else if (this.right.arg1 != this.left.value && this.right == 0) {
                let prime = `${this.left.value} = ${this.right.arg1};`;
                Report.changes.push({ regla: 12, original: original, optimizacion: prime, linea: this.row });
                return prime;
            } 
            else if (this.right.arg1 == 0 && this.right.arg2 == this.left.value) {
                let prime = `${this.left.value} = ${this.right.arg2};`;
                Report.changes.push({ regla: 12, original: original, optimizacion: prime, linea: this.row });
                return prime;
            }
            else {
                return original;
            }
        }
        if (this.right.type === 2 && this.right.operator === '-' ) {
            // regla 9
            if (this.right.arg1 == this.left.value && this.right.arg2 == 0) {
                Report.changes.push({ regla: 9, original: original, optimizacion: '', linea: this.row });
                return null;
            }
            // regla 13
            else if (this.right.arg1 != this.left.value && this.right.arg2 == 0) {
                let prime = `${this.left.value} = ${this.right.arg1};`;
                Report.changes.push({ regla: 13, original: original, optimizacion: prime, linea: this.row });
                return prime;
            }
            else {
                return original;
            }
        }  
        // regla 10
        if (this.right.type === 2 && this.right.operator === '*' ) {
            if ((this.right.arg1 == this.left.value && this.right.arg2 == 1) 
            || (this.right.arg1 == 1 && this.right.arg2 == this.left.value)) {
                Report.changes.push({ regla: 10, original: original, optimizacion: '', linea: this.row });
                return null;
            }
            // regla 14
            else if (this.right.arg1 != this.left.value && this.right.arg2 == 1) {
                let prime = `${this.left.value} = ${this.right.arg1};`
                Report.changes.push({regla: 14, original: original, optimizacion: prime, linea: this.row});
                return prime;
            }
            else if (this.right.arg1 == 1 && this.right.arg2 == this.left.value) {
                let prime = `${this.left.value} = ${this.right.arg2};`;
                Report.changes.push({regla: 14, original, original, optimizacion, prime, linea: this.row});
                return prime;
            }
            // regla 16
            else if (this.right.arg1 == 2) {
                let prime = `${this.left.value} = ${this.right.arg2} + ${this.right.arg2};`;
                Report.changes.push({regla: 16, original: original, optimizacion: prime, linea: this.row});
                return prime;
            }
            else if (this.right.arg2 == 2) {
                let prime = `${this.left.value} = ${this.right.arg1} + ${this.right.arg1};`;
                Report.changes.push({regla: 16, original: original, optimizacion: prime, linea: this.row});
                return prime;
            }
            // regla 17
            else if (this.right.arg1 == 0 || this.right.arg2 == 0) {
                let prime = `${this.left.value} = 0;`
                Report.changes.push({regla: 17, original: original, optimizacion: prime, line: this.row});
                return prime;
            }
            else {
                return original;
            }
        }
        if (this.right.type === 2 && this.right.operator === '/' ) {
            //regla 11
            if (this.right.arg1 == this.left.value && this.right.arg2 == 1) {
                Report.changes.push({ regla: 11, original: original, optimizacion: '', linea: this.row });
                return null;
            }
            // regla 15
            else if (this.right.arg1 != this.left.value && this.right.arg2 == 1) {
                let prime = `${this.left.value} = ${this.right.arg1};`;
                Report.changes.push({regla: 15, original: original, optimizacion: prime, linea: this.row});
                return prime;
            }
            // regla 18
            else if (this.right.arg1 == 0) {
                let prime = `${this.left.value} = 0;`;
                Report.changes.push({regla: 18, original: original, optimizacion: prime, linea: this.row});
                return prime;
            }
            else {
                return original;
            }
        }
        return original;
    }
}

module.exports.AsignmentTDC = AsignmentTDC;