/* Definicion Léxica */
%lex
%options case-insensitive

//%x string

%%
//["]                                         { console.log('i'); this.begin("string"); }
//<string>[^\n\r"\\]+                         { builder += yytext; console.log(builder); }
//<string>["]                                 { console.log('e'); yytext = builder; console.log(yytext); this.popState(); return 'stringValue'}

\s+                                          // white spaces are ignored
"//".*									             	       // single line comments
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]	         // multiple line comments

// terminal symbols def start
"null"                                      return 'nullValue';
"true"                                      return 'trueValue';
"false"                                     return 'falseValue';
"integer"                                   return 'intType';
"double"                                    return 'doubleType';
"char"                                      return 'charType';
"boolean"                                   return 'booleanType';
"var"                                       return 'varKW';
"const"                                     return 'constKW';
"global"                                    return 'globalKW';
"import"                                    return 'importKW';
"if"                                        return 'ifKW';
"else"                                      return 'elseKW';
"switch"                                    return 'switchKW';
"case"                                      return 'caseKW';
"default"                                   return 'defaultKW';
"break"                                     return 'breakKW';
"continue"                                  return 'continueKW';
"return"                                    return 'returnKW';
"void"                                      return 'voidType';
"for"                                       return 'forKW';
"while"                                     return 'whileKW';
"define"                                    return 'defineKW';
"as"                                        return 'asKW';
"strc"                                      return 'strcKW';
"do"                                        return 'doKW';
"try"                                       return 'tryKW';
"catch"                                     return 'catchKW';
"throw"                                     return 'throwKW';
"print"                                     return 'printKW';

"==="                                       return 'equalsReference';

"=="                                        return 'equalsValue';
">="                                        return 'greaterEquals'; 
":="                                        return 'colonAsignment';
"++"                                        return 'incOp';
"--"                                        return 'decOp';
"^^"                                        return 'powOp';
"!="                                        return 'notEquals';
"<="                                        return 'lessEquals';
"&&"                                        return 'andOp';
"||"                                        return 'orOp';

","                                         return 'comma';
";"                                         return 'semicolon';
":"                                         return 'colon';
"."                                         return 'dot';
"="                                         return 'asignment';
"("                                         return 'leftP';
")"                                         return 'rightP';
"["                                         return 'leftS';
"]"                                         return 'rightS';
"{"                                         return 'leftC';
"}"                                         return 'rightC';
"+"                                         return 'plusOp';
"-"                                         return 'minusOp';
"*"                                         return 'timesOp';
"/"                                         return 'divOp';
"%"                                         return 'modOp';
"!"                                         return 'notOp';
"^"                                         return 'xorOp'; 
">"                                         return 'greaterThan';
"<"                                         return 'lessThan';
"$"                                         return 'byValue';
  
[\x27h]([\x00-\xFF]|"\\n"|"\\"["]|"\\\\"|"\\r"|"\\t")[\x27h]   { yytext = yytext.substr(1, yyleng-2); return 'charValue'; }
([a-zA-ZñÑ0-9]|"."|"-")+".j"                return 'fileName'; // este debe ser arreglado
([a-zA-ZñÑ])[a-zA-Z0-9ñÑ_]*                 return 'id';
["]("\\"["\n\r\t\\]|[^"])*["]               { yytext = yytext.substr(1, yyleng-2); return 'stringValue'; }
[0-9]+"."[0-9]+\b                           return 'doubleValue';
[0-9]+\b                                    return 'intValue';


<<EOF>>				                              return 'EOF';

// terminal symbols def end

.                                           { Singleton.insertError(new SharpError("Lexico", `${yytext} no pertenece al lenguaje`, yylineno, yyleng)); } 

/lex

%{
  const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
  const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
  const Import = require('../Globals/import').Import;
  const Root = require('../Globals/root').Root;
  const Type = require('../Constants/type').Type;
  const Function = require('../Globals/function').Function;
  const Identifier = require('../Constants/identifier').Identifier;
  const NodeList = require('../Utilities/nodeList').NodeList;
  const Parameter = require('../Globals/parameter').Parameter;
  const VarT1 = require('../Instructions/vart1').VarT1;
  const VarT2 = require('../Instructions/vart2').VarT2;
  const VarT3 = require('../Instructions/vart3').VarT3;
  const VarT4 = require('../Instructions/vart4').VarT4;
  const VarT5 = require('../Instructions/vart5').VarT5;
  const Operator = require('../Constants/operator').Operator;
  const Binary = require('../Expressions/binary').Binary;
  const Unary = require('../Expressions/unary').Unary;
  const BooleanValue = require('../Constants/booleanValue').BooleanValue;
  const CharValue = require('../Constants/charValue').CharValue;
  const DoubleValue = require('../Constants/doubleValue').DoubleValue;
  const IntValue = require('../Constants/intValue').IntValue;
  const StringValue = require('../Constants/stringValue').StringValue;
  const NullValue = require('../Constants/nullValue').NullValue;
  const Cast = require('../Expressions/Cast').Cast;
  const BreakSentence = require('../Instructions/breakSentence').BreakSentence;
  const ContinueSentence = require('../Instructions/continueSentence').ContinueSentence;
  const ReturnSentence = require('../Instructions/returnSentence').ReturnSentence;
  const IfSentence = require('../Instructions/ifSentence').IfSentence;
  const SwitchSentence = require('../Instructions/switchSentence').SwitchSentence;
  const WhileSentence = require('../Instructions/whileSentence').WhileSentence;
  const DowhileSentence = require('../Instructions/dowhileSentence').DowhileSentence;
  const ForSentence = require('../Instructions/forSentence').ForSentence;
  const Case = require('../Instructions/case').Case;
  const PrintSentence = require('../Instructions/printSentence').PrintSentence;
  const Asignment = require('../Instructions/asignment').Asignment;
  const Call = require('../Instructions/call').Call;
  const ThrowSentence = require('../Instructions/throwSentence').ThrowSentence;
  const TryCatchSentence = require('../Instructions/tryCatchSentence').TryCatchSentence;
  const Access = require('../Utilities/access').Access;
  const Attribute = require('../Utilities/attribute').Attribute;
  const Strc = require('../Globals/strc').Strc;
  const New = require('../Expressions/new').New;
  const ArrayExpression = require('../Expressions/arrayExpression').ArrayExpression;
  let global_vars = [];
  let functions_list = [];
  let global_strcs = [];
  let imports = [];
  let node;
%}

// precedencia
%left xorOp
%left orOp
%left andOp
%right equalsValue equalsReference notEquals
%nonassoc lessThan lessEquals greaterThan greaterEquals
%left plusOp minusOp
%left timesOp divOp modOp
%left powOp
%left incOp decOp
%left UMINUS NOT
%left CASTING
%left DOT

%start INIT

%%

INIT 
  : SCRIPT EOF { 
    return { 
      root: $1,
      global_vars: global_vars,
      functions_list: functions_list,
      global_strcs: global_strcs,
      imports: imports
    };
  }
;

SCRIPT 
  : IMPORT DECL {
    node = new Root();
    node.addGlobal($1);
    node.addGlobals($2);
    $$ = node;
  }
  | DECL IMPORT DECL {
    node = new Root();
    node.addGlobals($1);
    node.addGlobal($2);
    node.addGlobals($3);
    $$ = node;
  }
  | DECL IMPORT {
    node = new Root();
    node.addGlobals($1);
    node.addGlobal($2);
    $$ = node;
  }
  | IMPORT {
    node = new Root();
    node.addGlobal($1);
    $$ = node;
  } 
  | DECL {
    node = new Root();
    node.addGlobals($1);
    $$ = node;
  }
;

IMPORT 
  : importKW FILES {
    $$ = new Import($2);
  }
  | importKW FILES semicolon {
    $$ = new Import($2);
  }
;

FILES 
  : FILES comma fileName {
    node = new Identifier($3, @3.first_line, @3.first_column);
    $1.push(node);
    imports.push(node);
    $$ = $1;
  }
  | fileName {
    node = new Identifier($1, @1.first_line, @1.first_column);
    imports.push(node);
    $$ = [ node ];
  }
;

DECL 
  : DECL DECL_OPT {
    $1.push($2);
    $$ = $1;
  }
  | DECL_OPT {
    $$ = [ $1 ];
  }
;

DECL_OPT
  : FUNCTION_DECL {
    functions_list.push($1);
    $$ = $1;
  }
  | VAR_DECL {
    global_vars.push($1);
    $$ = $1;
  }
  | VAR_DECL semicolon {
    global_vars.push($1);
    $$ = $1;
  }
  | ARRAY_DECL {
    global_vars.push($1);
    $$ = $1;
  }
  | ARRAY_DECL semicolon {
    global_vars.push($1);
    $$ = $1;
  }
  | STRC_DEF {
    global_strcs.push($1);
    $$ = $1;
  }
  | STRC_DEF semicolon {
    global_strcs.push($1);
    $$ = $1;
  }
;

FUNCTION_DECL 
  : TYPE id PARAMETERS BLOCK {
    $$ = new Function($1, new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), $3, $4);
  }
  | TYPE leftS rightS id PARAMETERS BLOCK {
    $1.arrayFlag = true;
    $1.name += '[]';
    $$ = new Function($1, new Identifier($4.toLowerCase(), @4.first_line, @4.first_column), $5, $6);
  }
  | id id PARAMETERS BLOCK {
    $$ = new Function(new Type($1.toLowerCase(), @1.first_line, @1.first_column, false), 
      new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), $3, $4);
  }
  | id leftS rightS id PARAMETERS BLOCK {
    $$ = new Function(new Type($1.toLowerCase()+'[]', @1.first_line, @1.first_column, true), 
      new Identifier($4.toLowerCase(), @4.first_line, @4.first_column), $5, $6);
  }
  | voidType id PARAMETERS BLOCK {
    $$ = new Function(new Type('void', @1.first_line, @1.first_column, false), 
      new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), $3, $4);
  }
;

TYPE 
  : intType {
    $$ = new Type('int', @1.first_line, @1.first_column, false);
  }
  | doubleType {
    $$ = new Type('double', @1.first_line, @1.first_column, false);
  }
  | booleanType {
    $$ = new Type('boolean', @1.first_line, @1.first_column, false);
  }
  | charType {
    $$ = new Type('char', @1.first_line, @1.first_column, false);
  }
;

PARAMETERS 
  : leftP PARAMETERS_LIST rightP {
    $$ = new NodeList($2, 'PARAMETERS');
  }
  | leftP rightP {
    $$ = new NodeList([], 'PARAMETERS')
  }
;

PARAMETERS_LIST 
  : PARAMETERS_LIST comma PARAMS_VALUE {
    node = $1;
    node.push($3);
    $$ = node;
  }
  | PARAMS_VALUE {
    $$ = [ $1 ];
  }
;

PARAMS_VALUE
  : TYPE id {
    $$ = new Parameter($1, new Identifier($2.toLowerCase(), @2.first_line, @2.first_column));
  }
  | TYPE leftS rightS id {
    $1.arrayFlag = true;
    $1.name += '[]';
    $$ = new Parameter($1, new Identifier($4.toLowerCase(), @4.first_line, @4.first_column));
  }
  | id id {
    $$ = new Parameter(new Type($1.toLowerCase(), @1.first_line, @1.first_column, false),
     new Identifier($2.toLowerCase(), @2.first_line, @2.first_column));
  }
  | id leftS rightS id {
    $$ = new Parameter(new Type($1.toLowerCase()+'[]', @1.first_line, @1.first_column, true),
     new Identifier($4, @4.first_line, @4.first_column));
  }
  | varKW id {
    $$ = new Parameter(new Type('var', @1.first_line, @1.first_column, false),
     new Identifier($2.toLowerCase(), @2.first_line, @2.first_column));
  }
;

BLOCK 
  : leftC SENTENCES rightC {
    $$ = new NodeList($2, 'SENTENCES');
  }
  | leftC rightC {
    $$ = new NodeList([], 'SENTENCES');
  }
;

VAR_DECL 
  : VAR_T1 {
    $$ = $1;
  }
  | VAR_T2 {
    $$ = $1;
  }
  | VAR_T3 {
    $$ = $1;
  }
  | VAR_T4 {
    $$ = $1;
  }
  | VAR_T5 {
    $$ = $1;
  }
;

ID_LIST 
  : ID_LIST comma id {
    $1.push( new Identifier($3.toLowerCase(), @3.first_line, @3.first_column) );
    $$ = $1;
  }
  | id {
    $$ = [ new Identifier($1.toLowerCase(), @1.first_line, @1.first_column) ];
  }
;

VAR_T1 
  : TYPE ID_LIST asignment EXPRESSION {
    $$ = new VarT1($1, new NodeList($2, 'IDENTIFIERS LIST'), $4);
  }
  | id ID_LIST asignment EXPRESSION {
    $$ = new VarT1(new Type($1.toLowerCase(), @1.first_line, @1.first_column, false),
      new NodeList($2, 'IDENTIFIERS LIST'), $4);
  }
;

VAR_T2 
  : varKW id colonAsignment EXPRESSION {
    $$ = new VarT2(new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), $4);
  }
;

VAR_T3 
  : constKW id colonAsignment EXPRESSION {
    $$ = new VarT3(new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), $4);
  }
;

VAR_T4 
  : globalKW id colonAsignment EXPRESSION {
    $$ = new VarT4(new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), $4);
  }
;

VAR_T5 
  : TYPE ID_LIST {
    $$ = new VarT5($1, new NodeList($2, 'IDENTIFIERS LIST'));
  }
  | id ID_LIST {
    $$ = new VarT5(new Type($1.toLowerCase(), @1.first_line, @1.first_column, false), new NodeList($2, 'IDENTIFIERS LIST'));
  }
;

ARRAY_DECL
  : TYPE leftS rightS ID_LIST asignment strcKW TYPE leftS EXPRESSION rightS {
    $1.name += '[]';
    $1.arrayFlag = true;
    $7.name += '[]';
    $7.arrayFlag = true;
    $$ = new VarT1($1, $4, new ArrayExpression(null, $7, $9));
  }
  | id leftS rightS ID_LIST asignment strcKW id leftS EXPRESSION rightS {
    $$ = new VarT1(new Type($1+'[]', @1.first_line, @1.first_column, true), $4, new ArrayExpression(null, new Type($7+'[]', @7.first_line, @7.first_column),$9));
  }
  | TYPE leftS rightS ID_LIST asignment leftC E_LIST rightC {
    $1.name += '[]';
    $1.arrayFlag = true;
    $$ = new VarT1($1, $4, new ArrayExpression(new NodeList($7, 'ELEMENTS')));
  }
  | id leftS rightS ID_LIST asignment leftC E_LIST rightC {
    $$ = new VarT1(new Type($1+'[]', @1.first_line, @1.first_column, true), $4, new ArrayExpression(new NodeList($7, 'ELEMENTS')));
  }
  | TYPE leftS rightS ID_LIST {
    $1.name += '[]';
    $1.arrayFlag = true;
    $$ = new VarT5($1, $4);
  }
  | id leftS rightS ID_LIST {
    $$ = new VarT5(new Type($1+'[]', @1.first_line, @1.first_column, true), $4);
  }
;

E_LIST 
  : E_LIST comma EXPRESSION {
    $1.push($3);
    $$ = $1;
  }
  | EXPRESSION {
    $$ = [ $1 ];
  }
;

STRC_DEF
  : defineKW id asKW leftS ATT_LIST rightS {
    $$ = new Strc(new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), new NodeList($5, 'ATTRIBUTES'));
  }
;

ATT_LIST
  : ATT_LIST comma ATTRIBUTE {
    node = $1;
    node.push($3);
    $$ = node;
  }
  | ATTRIBUTE {
    $$ = [ $1 ];
  }
;

ATTRIBUTE 
  : TYPE id {
    $$ = new Attribute($1, new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), null);
  }
  | id id {
    $$ = new Attribute(new Type($1.toLowerCase(), @1.first_line, @1.first_column, false), 
      new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), null);
  }
  | TYPE leftS rightS id {
    $1.value += '[]';
    $1.arrayFlag = true;
    $$ = new Attribute($1, new Identifier($4.toLowerCase(), @4.first_line, @4.first_column), null);
  }
  | id left rightS id {
    $$ = new Attribute(new Type($1.toLowerCase()+'[]', @1.first_line, @1.first_column, true), 
      new Identifier($4.toLowerCase(), @4.first_line, @4.first_column), null);
  }
  | TYPE id asignment EXPRESSION {
    $$ = new Attribute($1, new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), $4);
  }
  | id id asignment EXPRESSION {
    $$ = new Attribute(new Type($1.toLowerCase(), @1.first_line, @1.first_column, false), 
      new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), $4);
  }
  | TYPE leftS rightS id asignment EXPRESSION {
    $1.value += '[]';
    $1.arrayFlag = true;
    $$ = new Attribute($1, new Identifier($4.toLowerCase(), @4.first_line, @4.first_column), $6);
  }
  | id leftS rightS id asignment EXPRESSION {
    $$ = new Attribute(new Type($1+'[]', @1.first_line, @1.first_column, true), 
      new Identifier($4.toLowerCase(), @4.first_line, @4.first_column), $6);
  }
;

EXPRESSION 
  : EXPRESSION xorOp EXPRESSION {
    $$ = new Binary(new Operator('xor', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION orOp EXPRESSION {
    $$ = new Binary(new Operator('or', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION andOp EXPRESSION {
    $$ = new Binary(new Operator('and', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | notOp EXPRESSION %prec NOT {
    $$ = new Unary(new Operator('not', $1, @1.first_line, @1.first_column), $2);
  }
  | EXPRESSION notEquals EXPRESSION {
    $$ = new Binary(new Operator('not equals', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION equalsValue EXPRESSION {
    $$ = new Binary(new Operator('equal value', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION equalsReference EXPRESSION {
    $$ = new Binary(new Operator('equal reference', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION lessThan EXPRESSION {
    $$ = new Binary(new Operator('less than', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION lessEquals EXPRESSION {
    $$ = new Binary(new Operator('less or equal to', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION greaterThan EXPRESSION {
    $$ = new Binary(new Operator('greater than', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION greaterEquals EXPRESSION {
    $$ = new Binary(new Operator('greater or equal to', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION plusOp EXPRESSION {
    $$ = new Binary(new Operator('plus', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION minusOp EXPRESSION {
    $$ = new Binary(new Operator('minus', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION timesOp EXPRESSION {
    $$ = new Binary(new Operator('times', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION divOp EXPRESSION {
    $$ = new Binary(new Operator('div', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION modOp EXPRESSION {
    $$ = new Binary(new Operator('mod', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | EXPRESSION powOp EXPRESSION {
    $$ = new Binary(new Operator('power', $2, @2.first_line, @2.first_column), $1, $3);
  }
  | minusOp EXPRESSION %prec MINUS {
    $$ = new Unary(new Operator('minus', $1, @1.first_line, @1.first_column), $2);
  }
  | id incOp {
    $$ = new Unary(new Operator('increment', $2, @2.first_line, @2.first_column),
      new Identifier($1.toLowerCase(), @1.first_line, @1.first_column));
  }
  | id decOp {
    $$ = new Unary(new Operator('decrement', $2, @2.first_line, @2.first_column),
      new Identifier($1.toLowerCase(), @1.first_line, @1.first_column));
  }
  | leftP EXPRESSION rightP {
    $$ = $2;
  }
  | stringValue {
    $$ = new StringValue($1, @1.first_line, @1.first_column);
  }
  | intValue {
    $$ = new IntValue(Number($1), @1.first_line, @1.first_column);
  }
  | doubleValue {
    $$ = new DoubleValue(Number($1), @1.first_line, @1.first_column);
  }
  | trueValue {
    $$ = new BooleanValue(true, @1.first_line, @1.first_column);
  }
  | falseValue {
    $$ = new BooleanValue(false, @1.first_line, @1.first_column);
  }
  | id {
    $$ = new Identifier($1.toLowerCase(), @1.first_line, @1.first_column);
  }
  | nullValue {
    $$ = new NullValue(@1.first_line, @1.first_column);
  }
  | CAST EXPRESSION %prec CASTING {
    $$ = new Cast($1, $2);
  }
  | charValue {
    $$ = new CharValue($1, @1.first_line, @1.first_column);
  }
  | strcKW id leftS EXPRESSION rightS {
    $$ = new ArrayExpression(null, new Type($2, @2.first_line, @2.first_column, false), $4, @1.first_line, @1.first_column);
  }
  | strcKW TYPE leftS EXPRESSION rightS {
    $$ = new ArrayExpression(null, $2, $4, @1.first_line, @1.first_column);
  }
  | leftC E_LIST rightC {
    $$ = new ArrayExpression(new NodeList($2, 'VALUES'), null, null, @1.first_line, @1.first_column);
  }
  | strcKW id leftP rightP {
    $$ = new New(new Identifier($2.toLowerCase(), @2.first_line, @2.first_column));
  }
  | id dot id
  | id dot id ACCESS_LIST
  | id leftS EXPRESSION rightS
  | id leftS EXPRESSION rightS ACCESS_LIST
  | id dot CALL
  | id dot CALL ACCESS_LIST
  | CALL {
    $$ = $1;
  }
;

CAST 
  : leftP intType rightP {
    $$ = new Type('int', @2.first_line, @2.first_column, false);
  }
  | leftP doubleType rightP {
    $$ = new Type('double', @2.first_line, @2.first_column, false);
  }
  | leftP charType rightP {
    $$ = new Type('char', @2.first_line, @2.first_column, false);
  }
;

SENTENCES 
  : SENTENCES SENTENCE {
    $1.push($2);
    $$ = $1;
  }
  | SENTENCE {
    $$ = [ $1 ];
  }
;

SENTENCE 
  : STRC_DEF {
    $$ = $1;
  }
  | STRC_DEF semicolon {
    $$ = $1;
  }
  | VAR_DECL {
    $$ = $1;
  }
  | VAR_DECL semicolon {
    $$ = $1;
  }
  | ARRAY_DECL {
    $$ = $1;
  }
  | ARRAY_DECL semicolon{
    $$ = $1;
  }
  | ASIGNMENT {
    $$ = $1;
  }
  | ASIGNMENT semicolon {
    $$ = $1;
  }
  | IF_SENTENCE {
    $$ = $1;
  }
  | SWITCH_SENTENCE {
    $$ = $1;
  }
  | WHILE_SENTENCE {
    $$ = $1;
  }
  | DOWHILE_SENTENCE {
    $$ = $1;
  }
  | DOWHILE_SENTENCE semicolon{
    $$ = $1;
  }
  | FOR_SENTENCE {
    $$ = $1;
  }
  | PRINT_SENTENCE {
    $$ = $1;
  }
  | PRINT_SENTENCE semicolon {
    $$ = $1;
  }
  | THROW_SENTENCE {
    $$ = $1;
  }
  | THROW_SENTENCE semicolon {
    $$ = $1;
  }
  | TRY_SENTENCE {
    $$ = $1;
  }
  | breakKW {
    $$ = new BreakSentence(@1.first_line, @1.first_column);
  }
  | breakKW semicolon {
    $$ = new BreakSentence(@1.first_line, @1.first_column);
  }
  | continueKW {
    $$ = new ContinueSentence(@1.first_line, @1.first_column);
  }
  | continueKW semicolon {
    $$ = new ContinueSentence(@1.first_line, @1.first_column);
  }
  | returnKW semicolon {
    $$ = new ReturnSentence(null, @1.first_line, @1.first_column);
  }
  | returnKW EXPRESSION {
    $$ = new ReturnSentence($2, @1.first_line, @1.first_column);
  }
  | returnKW EXPRESSION semicolon {
    $$ = new ReturnSentence($2, @1.first_line, @1.first_column);
  }
  | CALL {
    $$ = $1;
  }
  | CALL semicolon {
    $$ = $1;
  }
  | id incOp {
    $$ = new Unary(new Operator('increment', $2, @2.first_line, @2.first_column),
      new Identifier($1.toLowerCase(), @1.first_line, @1.first_column));
  }
  | id incOp semicolon {
    $$ = new Unary(new Operator('increment', $2, @2.first_line, @2.first_column),
      new Identifier($1.toLowerCase(), @1.first_line, @1.first_column));
  }
  | id decOp {
    $$ = new Unary(new Operator('decrement', $2, @2.first_line, @2.first_column),
      new Identifier($1.toLowerCase(), @1.first_line, @1.first_column));
  }
  | id decOp semicolon {
    $$ = new Unary(new Operator('decrement', $2, @2.first_line, @2.first_column),
      new Identifier($1.toLowerCase(), @1.first_line, @1.first_column));
  }
;

ASIGNMENT 
  : id asignment EXPRESSION {
    $$ = new Asignment(new Identifier($1.toLowerCase(), @1.first_line, @1.first_column), [], $3, @2.first_line, @2.first_column);
  }
  | id dot id asignment EXPRESSION
  | id dot id ACCESS_LIST asignment EXPRESSION
  | id leftS EXPRESSION rightS asignment EXPRESSION
  | id leftS EXPRESSION rightS ACCESS_LIST asignment EXPRESSION
  | id dot CALL asignment EXPRESSION
  | id dot CALL ACCESS_LIST asignment EXPRESSION
;

ACCESS_LIST 
  : ACCESS_LIST ACCESS {
    $1.push($2);
    $$ = $1;
  }
  | ACCESS {
    $$ = [ $1 ];
  }
;

ACCESS 
  : dot id {
    $$ = new Access(1, new Identifier($2.toLowerCase(), @2.first_line, @2.first_column), @1.first_line, @1.first_column);
  }
  | leftS EXPRESSION rightS {
    $$ = new Access(2, $2, @1.first_line, @1.first_column);
  }
  | dot CALL {
    $$ = new Access(3, $2, @1.first_line, @1.first_column);
  }
;

CALL 
  : id leftP EXP_LIST rightP {
    $$ = new Call(new Identifier($1.toLowerCase(), @1.first_line, @1.first_column), new NodeList($3, 'VALUES LIST'));
  }
  | id leftP rightP {
    $$ = new Call(new Identifier($1.toLowerCase(), @1.first_line, @1.first_column), new NodeList([], 'VALUES LIST'));
  }
;

EXP_LIST 
  : EXP_LIST comma EXP_OPT {
    $1.push($3);
    $$ = $1;
  }
  | EXP_OPT {
    $$ = [ $1 ];
  }
;

EXP_OPT
  : EXPRESSION {
    $$ = $1;
  }
  | id asignment EXPRESSION {
    $$ = new Asignment(new Identifier($1.toLowerCase(), @1.first_line, @1.first_column), [], $3, @1.first_line, @1.first_column);
  }
  | byValue EXPRESSION {
    $2.byValue();
    $$ = $2;
  }
  | id asignment byValue EXPRESSION {
    $4.byValue();
    $$ = new Asignment(new Identifier($1.toLowerCase(), @1.first_line, @1.first_column), [], $4, @1.first_line, @1.first_column);
  }
;

IF_SENTENCE 
  : ifKW leftP EXPRESSION rightP BLOCK {
    $$ = new IfSentence(new NodeList([$3], 'CONDITION'), $5, null, @1.first_line, @1.first_column);
  }
  | ifKW leftP EXPRESSION rightP BLOCK ELSE_SENTENCE {
    $$ = new IfSentence(new NodeList([$3], 'CONDITION'), $5, $6, @1.first_line, @1.first_column);
  }
;

ELSE_SENTENCE 
  : elseKW BLOCK {
    $$ = new IfSentence(null, $2, null, @1.first_line, @1.first_column);
  }
  | elseKW IF_SENTENCE {
    $$ = $2;
  }
;

SWITCH_SENTENCE 
  : switchKW leftP EXPRESSION rightP leftC SWITCH_BODY rightC {
    $$ = new SwitchSentence(new NodeList([$3], 'CONDITION'), $6, @1.first_line, @1.first_column);
  }
;

SWITCH_BODY 
  : CASES_LIST {
    $$ = new NodeList($1, 'CASES');
  }
  | CASES_LIST DEFAULT_CASE {
    node = $1;
    node.push($2);
    $$ = new NodeList(node, 'CASES');
  }
;

CASES_LIST 
  : CASES_LIST SINGLE_CASE {
    $1.push($2);
    $$ = $1;
  }
  | SINGLE_CASE {
    $$ = [ $1 ];
  }                           
;

SINGLE_CASE 
  : caseKW EXPRESSION colon SENTENCES {
    $$ = new Case(new NodeList([$2], 'VALUE'), new NodeList($4, 'SENTENCES'), @1.first_line, @1.first_column);
  }
  | caseKW EXPRESSION colon {
    $$ = new Case(new NodeList([$2], 'VALUE'), new NodeList([], 'SENTENCES'), @1.first_line, @1.first_column);
  }
;

DEFAULT_CASE 
  : defaultKW colon SENTENCES {
    $$ = new Case(null, new NodeList($3, 'SENTENCES'), @1.first_line, @1.first_column);
  }
;

WHILE_SENTENCE 
  : whileKW leftP EXPRESSION rightP BLOCK {
    $$ = new WhileSentence(new NodeList([$3], 'CONDITION'), $5, @1.first_line, @1.first_column);
  }
;

DOWHILE_SENTENCE 
  : doKW BLOCK whileKW leftP EXPRESSION rightP {
    $$ = new DowhileSentence($2, new NodeList([$5], 'CONDITION'), @1.first_line, @1.first_column);
  }
;

FOR_SENTENCE 
  : forKW leftP FOR_BODY rightP BLOCK {
    $$ = new ForSentence($3[0], $3[1], $3[2], $5, @1.first_line, @1.first_column);
  }
;

FOR_BODY 
  : FOR_START semicolon EXPRESSION semicolon FOR_END {
    $$ = [$1, new NodeList([$3], 'FOR MIDDLE'), $5];
  }
  | FOR_START semicolon semicolon FOR_END {
    $$ = [$1, new NodeList([], 'FOR MIDDLE'), $4];
  }
  | FOR_START semicolon EXPRESSION semicolon {
    $$ = [$1, new NodeList([$3], 'FOR MIDDLE'), new NodeList([], 'FOR END')];
  }
  | FOR_START semicolon semicolon {
    $$ = [$1, new NodeList([], 'FOR MIDDLE'), new NodeList([], 'FOR END')];
  }
  | semicolon EXPRESSION semicolon FOR_END {
    $$ = [new NodeList([], 'FOR START'), new NodeList([$2], 'FOR MIDDLE'), $4];
  }
  | semicolon EXPRESSION semicolon {
    $$ = [new NodeList([], 'FOR START'), new NodeList([$2], 'FOR MIDDLE'), new NodeList([], 'FOR END')];
  }
  | semicolon semicolon FOR_END {
    $$ = [new NodeList([], 'FOR START'), new NodeList([], 'FOR MIDDLE'), new NodeList($3, 'FOR END')];
  }
  | semicolon semicolon {
    $$ = [new NodeList([], 'FOR START'), new NodeList([], 'FOR MIDDLE'), new NodeList([], 'FOR END')];
  }
;

FOR_START 
  : TYPE id asignment EXPRESSION {
    $$ = new NodeList([new VarT1($1, new NodeList([new Identifier($2.toLowerCase(), @2.first_line, @2.first_column)], 'ID'), $4)], 'FOR START');
  }
  | ASIGNMENT {
    $$ = new NodeList($1, 'FOR START');
  }
;

FOR_END 
  : id incOp {
    $$ = new NodeList([new Unary(new Operator('increment', $2, @2.first_line, @2.first_column),
      new Identifier($1.toLowerCase(), @1.first_line, @1.first_column))], 'FOR END');
  }
  | id decOp {
    $$ = new NodeList([new Unary(new Operator('decrement', $2, @2.first_line, @2.first_column),
      new Identifier($1.toLowerCase(), @1.first_line, @1.first_column))], 'FOR END');
  }
  | ASIGNMENT {
    $$ = new NodeList([$1], 'FOR END');
  }
;

PRINT_SENTENCE
  : printKW leftP EXPRESSION rightP {
    $$ = new PrintSentence($3, @1.first_line, @1.first_column);
  }
;

THROW_SENTENCE
  : throwKW strcKW CALL {
    $$ = new ThrowSentence($3, @1.first_line, @1.first_column);
  }
;

TRY_SENTENCE
  : tryKW BLOCK catchKW leftP VAR_T5 rightP BLOCK {
    $$ = new TryCatchSentence($2, $5, $7, @1.first_line, @1.first_column);
  }
;





