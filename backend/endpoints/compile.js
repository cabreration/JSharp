const fs = require('fs');
let parser = require('../Ast/Jison/grammar');
const TreePrinter = require('../Ast/Dot/treePrinter').TreePrinter;
const Singleton = require('../Procesor/Singleton/singleton').Singleton;
const Process = require('../Procesor/process').Process;
const Translator = require('../Procesor/C3D/translator').Translator;

module.exports = (app) => {

  app.post('/compile', async(req, res) => {
    let input = req.body.input;
    try {
      let p = new parser.Parser();
      let ast = p.parse(input);
      let treePrinter = new TreePrinter();
      let tree = treePrinter.getDot(ast.root);

      Singleton.restart();
      let process = new Process();
      let bst = process.firstApproach(ast);
      // now everything is stored in the singleton class static elements
      ast.global_vars.splice(0, ast.global_vars.length);
      ast.functions_list.splice(0, ast.functions_list.length);
      ast.global_vars = bst.global_vars;
      ast.functions_list = bst.functions_list;

      let translator = new Translator();
      let threeDCode = translator.translate(ast);

      ast.global_vars.splice(0, ast.global_vars.length);
      ast.functions_list.splice(0, ast.functions_list.length);
      ast.global_strcs.splice(0, ast.global_strcs.length);
      ast.imports.splice(0, ast.imports.length);

      fs.writeFile(`./Testing/output.txt`, threeDCode, (err, file) => {
        if (err) {
            console.log(err);
        }
      });
      res.send({ state: true, dot: tree, errors: Singleton.sharpErrors, table: Singleton.symbolsTable, code: threeDCode });
      
    }
    catch (e) {
      console.log(e);
      res.send({ state: false, message: 'El proceso ha fallado' });
    }
  });

}
