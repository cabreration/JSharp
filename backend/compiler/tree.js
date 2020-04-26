
class TreePrinter {

    constructor() {
        this.counter = 1;
        this.graph = '';
    }

    getDot(root) {
        this.graph = 'digraph G{';
        this.graph += 'nodo0[label="';
        this.graph += root.type;
        this.graph += '"];\n';
        this.counter = 1;
        this.runTree('nodo0', root);
        this.graph += '}';
        return this.graph;
    }

    runTree(father, node) {
        node.children.forEach(element => {
            let childsName = 'Node' + this.counter.toString();
            this.graph += childsName;
            if (element.type === 'file')
                this.graph += '[label="' + element.value + '"];\n';
            else
                this.graph += '[label="' + element.type + '"];\n';
            this.graph +=father;
            this.graph += "->";
            this.graph += childsName;
            this.graph += ';\n';
            this.counter++;
            this.runTree(childsName, element);
        });
    }
}

module.exports.TreePrinter = TreePrinter;