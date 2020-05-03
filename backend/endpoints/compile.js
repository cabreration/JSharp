
const parser = require('../Ast/Jison/grammar');
const TreePrinter = require('../Ast/Dot/treePrinter').TreePrinter;
const Singleton = require('../Procesor/Singleton/singleton').Singleton;
const Process = require('../Procesor/process').Process;
const Translator = require('../Procesor/C3D/translator').Translator;

module.exports = (app) => {

  app.post('/compile', async(req, res) => {
    let input = req.body.input;
    try {
      let ast = parser.parse(input);
      let treePrinter = new TreePrinter();
      let tree = treePrinter.getDot(ast.root);

      Singleton.restart();
      let process = new Process();
      process.firstApproach(ast);
      // now everything is stored in the singleton class static elements

      let translator = new Translator();
      let threeDCode = translator.translate(ast);

      res.send({ state: true, dot: tree, errors: Singleton.sharpErrors });
    }
    catch (e) {
      console.log(e);
      res.send({ state: false, message: 'El proceso ha fallado' });
    }
  });

}
