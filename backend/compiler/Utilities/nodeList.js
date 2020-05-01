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
}

module.exports.NodeList = NodeList;