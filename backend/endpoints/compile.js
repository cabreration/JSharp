
const parser = require('../compiler/grammar');
const TreePrinter = require('../compiler/tree').TreePrinter;
const TreeProcesor = require('../compiler/Procesor/treeProcesor').TreeProcesor;

module.exports = (app) => {

  app.post('/compile', async(req, res) => {
    let input = req.body.input;
    try {
      let ast = parser.parse(input);
      let treePrinter = new TreePrinter();
      //console.log(JSON.stringify(ast));
      let tree = treePrinter.getDot(ast);
      const procesor = new TreeProcesor();
      let st = procesor.processTree(ast.getChildren());
      //console.log(tree);
      res.send({ state: true, dot: tree });
    }
    catch (e) {
      console.log(e);
      res.send({ state: false, message: 'El proceso fallo' });
    }
  });

}
