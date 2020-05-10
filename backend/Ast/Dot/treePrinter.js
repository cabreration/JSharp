
class TreePrinter {

    constructor() {
        this.counter = 1;
        this.graph = '';
    }

    getDot(root) {
        this.graph = 'digraph G{';
        this.graph += 'nodo0';
        this.graph += root.getDot();
        this.counter = 1;
        this.runTree('nodo0', root);
        this.graph += '}';
        return this.graph;
    }

    runTree(father, node) {
        //console.log(node)
        //console.log(node);
        node.getChildren().forEach(element => {
            let childsName = 'Node' + this.counter.toString();
            this.graph += childsName;
            this.graph += element.getDot();
            this.graph += father;
            this.graph += "->";
            this.graph += childsName;
            this.graph += ';\n';
            this.counter++;
            this.runTree(childsName, element);
        });
    }
}

module.exports.TreePrinter = TreePrinter;