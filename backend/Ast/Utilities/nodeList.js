const Updater = require('./updater').Updater;

class NodeList {
    constructor(children, name) {
        this.children = children; // [ Whatever node ]
        this.name = name; // String
    }

    getChildren() {
        return this.children;
    }

    getDot() {
        return '[label="' + this.name + '"];\n';
    }

    getTypeOf() {
        return 'nodelist';
    }

    getTDC(env, label, temp) {
        return new Updater(env, label, temp, null);
    }
}

module.exports.NodeList = NodeList;