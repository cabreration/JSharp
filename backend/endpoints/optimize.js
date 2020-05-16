const fs = require('fs');
const Report = require('../Optimus/report').Report;
let parser = require('../Optimus/Jison/tdc');
const Prime = require('../Optimus/prime').Prime;

module.exports = (app) => {

  app.post('/optimize', async(req, res) => {
    let text = req.body.input;
    try {
      Report.changes =[];
      // aqui optimizo el codigo
      let p = new parser.Parser();
      let ast = p.parse(text);
      let lines = ast.lines;
      let prime = [];
      prime.push(lines[0].print(false));
      let optimizer = new Prime();
      let b = optimizer.blocks(lines, true, null);
      let dot = optimizer.blocksDot(b);
      lines = optimizer.rule1(lines, true);
      lines = optimizer.rule2(lines, true);
      lines = optimizer.rule3(lines, true);
      lines = optimizer.rules4n5(lines, true);
      lines = optimizer.rules6n7(lines, true);
      lines = optimizer.rule19(lines, true);
      lines = optimizer.rule20(lines, true);
      lines = optimizer.rule23(lines, true, null);
      prime.push('var p, h;');
      prime.push('var heap[];')
      prime.push('var stack[];')
      for (let i = 1; i < lines.length; i++) {
          let result = lines[i].print(true);
          if (result != null && result != '\n' && result != '') {
              prime.push(result);
          }
      }
      fs.writeFile('./Testing/prime.txt', prime.join('\n'), (err, file) => {
          if (err)
              console.log(err);
      });

      res.send({ state: true, optimized: prime.join('\n'), reporte: Report.changes, diagrama: dot });
      ast.lines.splice(0, ast.lines.length);
    }
    catch (e) {
      console.log(e);
      res.send({ state: false, message: 'El proceso ha fallado' });
    }
  });

}