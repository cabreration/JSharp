'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//app.listen(3000, () => console.log('I love you 3000'));

const compile = require('./endpoints/compile')(app);
const store = require('./endpoints/store')(app);

/* This is only to maker easier the testing part of the project, ill have to erase it later*/
const fs = require('fs');
const Singleton = require('./Procesor/Singleton/singleton').Singleton;
const Process = require('./Procesor/process').Process;
const Translator = require('./Procesor/C3D/translator').Translator;
const TreePrinter = require('./Ast/Dot/treePrinter').TreePrinter;
const parser = require('./Ast/Jison/grammar');

console.log('reading test.j');
fs.readFile('./Testing/current.j', 'utf8', (err, text) => {
    if (err) {
        console.error(err);
    }
    else {
        try {
            let ast = parser.parse(text);
            let treePrinter = new TreePrinter();
            let tree = treePrinter.getDot(ast.root);
            fs.writeFile('./Testing/treeTest.dot', tree, (err, file) => {
                if (err)
                    console.error(err);
            });
      
            console.log('tree done');
            Singleton.restart();
            let process = new Process();
            process.firstApproach(ast);
            // now everything is stored in the singleton class static elements
      
            let translator = new Translator();
            let threeDCode = translator.translate(ast);
            fs.writeFile('./Testing/test3DC.txt', threeDCode, (err, file) => {
                if (err)
                    console.log(err);
            });
            console.log('done');
          }
          catch (e) {
            console.error(e);
          }
    }
}); 

