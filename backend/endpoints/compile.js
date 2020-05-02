
const parser = require('../Ast/grammar');
const TreePrinter = require('../Ast/Dot/treePrinter').TreePrinter;
const Singleton = require('../Procesor/Singleton/singleton').Singleton;
const Process = require('../Procesor/process').Process;

module.exports = (app) => {

  app.post('/compile', async(req, res) => {
    let input = req.body.input;
    try {
      let ast = parser.parse(input);
      let treePrinter = new TreePrinter();
      let tree = treePrinter.getDot(ast.root);

      let reps = Process.firstApproach(ast);

      res.send({ state: true, dot: tree, errors: Singleton.sharpErrors });
    }
    catch (e) {
      console.log(e);
      res.send({ state: false, message: 'El proceso ha fallado' });
    }
  });

}
