
const parser = require('../compiler/grammar');
const TreePrinter = require('../compiler/tree').TreePrinter;

module.exports = (app) => {

  app.post('/compile', async(req, res) => {
    let input = req.body.input;
    try {
      let ast = parser.parse(input);
      let treePrinter = new TreePrinter();
      let tree = treePrinter.getDot(ast);
      //console.log(tree);
      res.send({ state: true, dot: tree });
    }
    catch (e) {
      console.log(e);
      res.send({ state: false, message: 'El proceso fallo' });
    }
  });

}
