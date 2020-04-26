const Node = {

    createChildrenlessNode: function(type, value, row, column) {
        return {
            type: type,
            value: value,
            children: [],
            row: row,
            column: column
        }
    },

    createSimpleNode: function(type) {
        return {
            type: type,
            value: null,
            children: [],
            row: -1,
            column: -1
        }
    },

    createNode: function(type, value, children, row, column) {
        return {
            type: type,
            value: value,
            children: children,
            row: row,
            column: column
        }
    },

    addChild: function(node, child) {
        node.children.push(child);
        return node;
    },

    addChildren: function(node, child) {
        child.children.forEach(element => {
            node.children.push(element);
        });
        return node;
    }

}

module.exports.Node = Node;