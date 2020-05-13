const fs = require('fs');
let parser = require('../Optimus/Jison/tdc');

module.exports = (app) => {

  app.post('/optimize', async(req, res) => {
    let input = req.body.input;
    try {
     

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