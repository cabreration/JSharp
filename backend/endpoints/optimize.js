const fs = require('fs');
const Report = require('../Optimus/report').Report;
let parser = require('../Optimus/Jison/tdc');

module.exports = (app) => {

  app.post('/optimize', async(req, res) => {
    let text = req.body.input;
    try {
     
      // aqui optimizo el codigo
      let lines = parser.parse(text);
      let prime = [];
      prime.push(lines[0].print()); // temporales
      prime.push('var p, h;');
      prime.push('var heap[];')
      prime.push('var stack[];')
      for (let i = 1; i < lines.length; i++) {
          let result = lines[i].print();
          if (result != null && result != '\n' && result != '') {
              prime.push(lines[i].print());
          }
      }
      fs.writeFile('./Testing/prime.txt', prime.join('\n'), (err, file) => {
          if (err)
              console.log(err);
      });

      res.send({ state: true, optimized: prime.join('\n'), reporte: Report.changes });
      
    }
    catch (e) {
      console.log(e);
      res.send({ state: false, message: 'El proceso ha fallado' });
    }
  });

}