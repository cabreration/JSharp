const fs = require('fs');

module.exports = (app) => {

    app.post('/store', async(req, res) => {
        let input = req.body.input;
        let name = req.body.name;
        fs.writeFile(`./Imports/${name}`, input, (err, file) => {
            if (err) {
                res.send({state: false});
                console.log(err);
            }
            else {
                res.send({state: true});
            }
        });
    });

}  