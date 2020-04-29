
class Root {
    constructor() {
        this.globalIns = []; // [ whatever node ]
    }

    addGlobal(node) {
        this.globalIns.push(node);
    }

    addGlobals(node) {
        node.forEach(element => {
            this.globalIns.push(element);
        });
    }

    getDot() {
        return '[label="ROOT"];\n';
    }

    getChildren() {
        return this.globalIns;
    }
}

module.exports.Root = Root;