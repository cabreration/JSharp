class ProcTDC {
    constructor(id, instructions, row) {
        this.id = id;
        this.instructions = instructions;
        this.row = row;
    }

    getTypeOf() {
        return 'proc';
    }

    print() {
        let code = [];
        code.push(`proc ${this.id} begin`);
        for (let i = 0; i < this.instructions.length; i++) {
            let ins = this.instructions[i];
            let opt = ins.print();
            code.push(opt);
        }
        code.push(`end`);
        return code.join('\n');
    }
}

module.exports.ProcTDC = ProcTDC;