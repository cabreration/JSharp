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
"<"                                         return 'lessThan';
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
  
[\x27h][\x00-\xFF][\x27h]                   { yytext = yytext.substr(1, yyleng-2); return 'charValue'; }
([a-zA-ZñÑ0-9]|"."|"-")+".j"                return 'fileName'; // este debe ser arreglado
([a-zA-ZñÑ_])[a-zA-Z0-9_]*                  return 'id';
["]("\\"["\n\r\t\\]|[^"])*["]               { yytext = yytext.substr(1, yyleng-2); return 'stringValue'; }
[0-9]+"."[0-9]+\b                           return 'doubleValue';
[0-9]+\b                                    return 'intValue';


<<EOF>>				                              return 'EOF';

// terminal symbols def end

.                                           {} // lexical errors should be caught here

/lex

%{
  const Import = require('./Globals/import').Import;
  const Root = require('./Globals/root').Root;
  const Type = require('./Constants/Type').Type;
  const Function = require('./Globals/function').Function;
  const Identifier = require('./Constants/identifier').Identifier;
  const NodeList = require('./Utilities/NodeList').NodeList;
  const Parameter = require('./Globals/parameter').Parameter;
  const VarT1 = require('./Instructions/vart1').VarT1;
  const VarT2 = require('./Instructions/vart2').VarT2;
  const VarT3 = require('./Instructions/vart3').VarT3;
  const VarT4 = require('./Instructions/vart4').VarT4;
  const VarT5 = require('./Instructions/vart5').VarT5;
  const Operator = require('./Constants/operator').Operator;
  const Binary = require('./Expressions/binary').Binary;
  const Unary = require('./Expressions/unary').Unary;
  const BooleanValue = require('./Constants/booleanValue').BooleanValue;
  const CharValue = require('./Constants/charValue').CharValue;
  const DoubleValue = require('./Constants/doubleValue').DoubleValue;
  const IntValue = require('./Constants/intValue').IntValue;
  const StringValue = require('./Constants/stringValue').StringValue;
  const NullValue = require('./Constants/nullValue').NullValue;
  const Cast = require('./Expressions/Cast').Cast;
  const BreakSentence = require('./Instructions/breakSentence').BreakSentence;
  const ContinueSentence = require('./Instructions/continueSentence').ContinueSentence;
  const ReturnSentence = require('./Instructions/returnSentence').ReturnSentence;
  const NodeClass = require('./node').Node;
  let node;
  let aux;
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
    return $1;
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
    $$ = $1;
  }
  | fileName {
    node = new Identifier($1, @1.first_line, @1.first_column);
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
  | ARRAY_DECL semicolon {
    $$ = $1;
  }
  | STRC_DEF {
    $$ = $1;
  }
  | STRC_DEF semicolon {
    $$ = $1;
  }
;

FUNCTION_DECL 
  : TYPE id PARAMETERS BLOCK {
    node = new Function($1, new Identifier($2, @2.first_line, @2.first_column), $3, $4);
    $$ = node;
  }
  | TYPE leftS rightS id PARAMETERS BLOCK {
    $1.arrayFlag = true;
    node = new Function($1, new Identifier($4, @4.first_line, @4.first_column), $5, $6);
    $$ = node;
  }
  | id id PARAMETERS BLOCK {
    $$ = new Function(new Type($1, @1.first_line, @1.first_column, false), 
      new Identifier($2, @2.first_line, @2.first_column), $3, $4);
  }
  | id leftS rightS id PARAMETERS BLOCK {
    $$ = new Function(new Type($1, @1.first_line, @1.first_column, true), 
      new Identifier($2, @2.first_line, @2.first_column), $3, $4);
  }
  | voidType id PARAMETERS BLOCK {
    $$ = new Function(new Type('void', @1.first_line, @1.first_column, false), 
      new Identifier($2, @2.first_line, @2.first_column), $3, $4);
  }
;

TYPE 
  : intType {
    $$ = new Type('integer', @1.first_line, @1.first_column, false);
  }
  | doubleType {
    $$ = new Type('double', @1.first_line, @1.first_column, false);
  }
  | booleanType {
    $$ = new Type('boolean', @1.first_line, @1.first_column, false);
  }
  | charTypes {
    $$ = new Type('integer', @1.first_line, @1.first_column, false);
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
    $$ = new Parameter($1, new Identifier($2, @2.first_line, @2.first_column));
  }
  | TYPE leftS rightS id {
    $1.arrayFlag = true;
    $$ = new Parameter($1, new Identifier($2, @2.first_line, @2.first_column));
  }
  | id id {
    $$ = new Parameter(new Type($1, @1.first_line, @1.first_column, false),
     new Identifier($2, @2.first_line, @2.first_column));
  }
  | id leftS rightS id {
    $$ = new Parameter(new Type($1, @1.first_line, @1.first_column, true),
     new Identifier($2, @2.first_line, @2.first_column));
  }
  | varKW id {
    $$ = new Parameter(new Type('var', @1.first_line, @1.first_column, false),
     new Identifier($2, @2.first_line, @2.first_column));
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
    $1.push( new Identifier($3, @3.first_line, @3.first_column) );
    $$ = $1;
  }
  | id {
    $$ = [ new Identifier($1, @1.first_line, @1.first_column) ];
  }
;

VAR_T1 
  : TYPE ID_LIST asignment EXPRESSION {
    $$ = new VarT1($1, new NodeList($2, 'IDENTIFIERS LIST'), $4);
  }
  | id ID_LIST asignment EXPRESSION {
    $$ = new VarT1(new Type($1, @1.first_line, @1.first_column, false),
      new NodeList($2, 'IDENTIFIERS LIST'), $4);
  }
;

VAR_T2 
  : varKW id colonAsignment EXPRESSION {
    $$ = new VarT2(new Identifier($2, @2.first_line, @2.first_column), $4);
  }
;

VAR_T3 
  : constKW id colonAsignment EXPRESSION {
    $$ = new VarT3(new Identifier($2, @2.first_line, @2.first_column), $4);
  }
;

VAR_T4 
  : globalKW id colonAsignment EXPRESSION {
    $$ = new VarT4(new Identifier($2, @2.first_line, @2.first_column), $4);
  }
;

VAR_T5 
  : TYPE ID_LIST {
    $$ = new VarT5($1, new NodeList($2, 'IDENTIFIERS LIST'));
  }
  | id ID_LIST {
    $$ = new VarT5(new Type($1, @1.first_line, @1.first_column, false), new NodeList($2, 'IDENTIFIERS LIST'));
  }
;

ARRAY_DECL
  : TYPE leftS rightS ID_LIST asignment strcKW TYPE leftS EXPRESSION rightS {
    node = NodeClass.createSimpleNode('ARRAY');
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $4);
    node = NodeClass.addChild(node, $7);
    node = NodeClass.addChild(node, $9);
    $$ = node;
  }
  | id leftS rightS ID_LIST asignment strcKW id leftS EXPRESSION rightS {
    node = NodeClass.createSimpleNode('ARRAY');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', $1, @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, $4);
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', $7, @7.first_line, @7.first_column));
    node = NodeClass.addChild(node, $9);
    $$ = node;
  }
  | TYPE leftS rightS ID_LIST asignment leftC E_LIST rightC {
    node = NodeClass.createSimpleNode('ARRAY');
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $4);
    node = NodeClass.addChild(node, $7);
    $$ = node;
  }
  | id leftS rightS ID_LIST asignment leftC E_LIST rightC {
    node = NodeClass.createSimpleNode('ARRAY');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', $1, @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, $4);
    node = NodeClass.addChild(node, $7);
    $$ = node;
  }
;

E_LIST 
  : E_LIST comma EXPRESSION {
    node = $1;
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION {
    node = NodeClass.createSimpleNode('E_LIST');
    node = NodeClass.addChild(node, $1);
    $$ = node;
  }
;

STRC_DEF
  : defineKW id asKW leftS ATT_LIST rightS {
    node = NodeClass.createSimpleNode('STRC_DEF');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column));
    node = NodeClass.addChild(node, $5);
    $$ = node;
  }
;

ATT_LIST
  : ATT_LIST comma ATTRIBUTE {
    node = $1;
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | ATTRIBUTE {
    node = NodeClass.createSimpleNode('ATT_LIST');
    node = NodeClass.addChild(node, $1);
    $$ = node;
  }
;

ATTRIBUTE 
  : TYPE id {
    node = NodeClass.createSimpleNode('ATTRIBUTE');
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column));
    $$ = node;
  }
  | id id {
    node = NodeClass.createSimpleNode('ATTRIBUTE');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', $1, @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column));
    $$ = node;
  }
  | TYPE leftS rightS id {
    node = NodeClass.createSimpleNode('ATTRIBUTE');
    $1.value += '[]';
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $4, @4.first_line, @4.first_column));
    $$ = node;
  }
  | id left rightS id {
    node = NodeClass.createSimpleNode('ATTRIBUTE');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', $1+'[]', @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $4, @4.first_line, @4.first_column));
    $$ = node;
  }
  | TYPE id asignment EXPRESSION {
    node = NodeClass.createSimpleNode('ATTRIBUTE');
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column));
    node = NodeClass.addChild(node, $4);
    $$ = node;
  }
  | id id asignment EXPRESSION {
    node = NodeClass.createSimpleNode('ATTRIBUTE');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', $1, @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column));
    node = NodeClass.addChild(node, $4);
    $$ = node;
  }
  | TYPE leftS rightS id asignment EXPRESSION {
    node = NodeClass.createSimpleNode('ATTRIBUTE');
    $1.value += '[]';
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $4, @4.first_line, @4.first_column));
    node = NodeClass.addChild(node, $6);
    $$ = node;
  }
  | id leftS rightS id asignment EXPRESSION {
    node = NodeClass.createSimpleNode('ATTRIBUTE');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', $1+'[]', @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $4, @4.first_line, @4.first_column));
    node = NodeClass.addChild(node, $6);
    $$ = node;
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
    $$ = new Binary(new Operator('not equal', $2, @2.first_line, @2.first_column), $1, $3);
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
      new Identifier($1, @1.first_line, @1.first_column));
  }
  | id decOp {
    $$ = new Unary(new Operator('decrement', $2, @2.first_line, @2.first_column),
      new Identifier($1, @1.first_line, @1.first_column));
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
    $$ = new Identifier($1, @1.first_line, @1.first_column);
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
  | strcKW id leftS EXPRESSION rightS
  | strcKW TYPE leftS EXPRESSION rightS
  | leftC E_LIST rightC
  | strcKW id leftP rightS
  | id dot id
  | id dot id ACCESS_LIST
  | id leftS EXPRESSION rightS
  | id leftS EXPRESSION rightS ACCESS_LIST
  | id dot CALL
  | id dot CALL ACCESS_LIST
  | CALL
;

CAST 
  : leftP intType rightP {
    $$ = new Type('integer', @2.first_line, @2.first_column, false);
  }
  | leftP doubleType rightP {
    $$ = new Type('double', @2.first_line, @2.first_column, false);
  }
  | leftP charType rightP {
    $$ = new Type('char', @2.first_line, @2.first_column, false);
  } 
  | leftP booleanType rightP {
    $$ = new Type('boolean', @2.first_line, @2.first_column, false);
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
;

ASIGNMENT 
  : id asignment EXPRESSION {
    node = NodeClass.createSimpleNode('ASIGNMENT');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $1, @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | id dot id asignment EXPRESSION
  | id dot id ACCESS_LIST asignment EXPRESSION
  | id leftS EXPRESSION rightS asignment EXPRESSION
  | id leftS EXPRESSION rightS ACCESS_LIST asignment EXPRESSION
  | id dot CALL asignment EXPRESSION
  | id dot CALL ACCESS_LIST asignment EXPRESSION
;

ACCESS_LIST 
  : ACCESS_LIST ACCESS
  | ACCESS
;

ACCESS 
  : dot id
  | leftS EXPRESSION rightS
  | dot CALL
;

CALL 
  : id leftP EXP_LIST rightP
  | id leftP rightP
;

EXP_LIST 
  : EXP_LIST comma EXPRESSION
  | EXP_LIST comma id asignment EXPRESSION
  | EXPRESSION
  | id asignment EXPRESSION
;

IF_SENTENCE 
  : ifKW leftP EXPRESSION rightP BLOCK {
    node = NodeClass.createChildrenlessNode('IF SENTENCE', null, @1.first_line, @1.first_column);
    aux = NodeClass.createSimpleNode('CONDITION');
    aux = NodeClass.addChild(aux, $3);
    node = NodeClass.addChild(node, aux);
    node = NodeClass.addChild(node, $5);
    $$ = node;
  }
  | ifKW leftP EXPRESSION rightP BLOCK ELSE_SENTENCE {
    node = NodeClass.createChildrenlessNode('IF SENTENCE', null, @1.first_line, @1.first_column);
    aux = NodeClass.createSimpleNode('CONDITION');
    aux = NodeClass.addChild(aux, $3);
    node = NodeClass.addChild(node, aux);
    node = NodeClass.addChild(node, $5);
    node = NodeClass.addChild(node, $6);
    $$ = node;
  }
;

ELSE_SENTENCE 
  : elseKW BLOCK {
    node = NodeClass.createChildrenlessNode('ELSE SENTENCE', null, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, $2);
    $$ = node;
  }
  | elseKW IF_SENTENCE {
    node = NodeClass.createChildrenlessNode('ELSE IF SENTENCE', null, @1.first_line, @1.first_column);
    node = NodeClass.addChildren(node, $2);
  }
;

SWITCH_SENTENCE 
  : switchKW leftP EXPRESSION rightP leftC SWITCH_BODY rightC {
    node = NodeClass.createChildrenlessNode('SWITCH SENTENCE', null, @1.first_line, @1.first_column);
    aux = NodeClass.createSimpleNode('CONDITION');
    aux = NodeClass.addChild(aux, $3);
    node = NodeClass.addChild(node, $6);
  }
;

SWITCH_BODY 
  : CASES_LIST {
    $$ = $1;
  }
  | CASES_LIST DEFAULT_CASE {
    node = $1;
    node = NodeClass.addChild(node, $2);
    $$ = node;
  }
;

CASES_LIST 
  : CASES_LIST SINGLE_CASE {
    node = $1;
    node = NodeClass.addChild($2);
    $$ = node;
  }
  | SINGLE_CASE {
    node = NodeClass.createSimpleNode('CASES LIST');
    node = NodeClass.addChild(node, $1);
    $$ = node;
  }                           
;

SINGLE_CASE 
  : caseKW EXPRESSION colon SENTENCES {
    node = NodeClass.createChildrenlessNode('CASE', null, @1.first_line, @1.first_column);
    aux = NodeClass.createSimpleNode('VALUE');
    aux = NodeClass.addChild(aux, $1);
    node = NodeClass.addChild(node, aux);
    node = NodeClass.addChild(node, $4);
    $$ = node;
  }
;

DEFAULT_CASE 
  : defaultKW colon SENTENCES {
    node = NodeClass.createChildrenlessNode('DEFAULT', null, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
;

WHILE_SENTENCE 
  : whileKW leftP EXPRESSION rightP BLOCK {
    node = NodeClass.createChildrenlessNode('WHILE SENTENCE', null, @1.first_line, @1.first_column);
    aux = NodeClass.createSimpleNode('CONDITION');
    aux = NodeClass.addChild(aux, $3);
    node = NodeClass.addChild(node, aux);
    node = NodeClass.addChild(node, $5);
    $$ = node;
  }
;

DOWHILE_SENTENCE 
  : doKW BLOCK whileKW leftP EXPRESSION rightP {
    node = NodeClass.createChildrenlessNode('DOWHILE SENTENCE', null, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, $2);
    aux = NodeClass.createSimpleNode('CONDITION');
    aux = NodeClass.addChild(aux, $5);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
;

FOR_SENTENCE 
  : forKW leftP FOR_BODY rightP BLOCK {
    node = NodeClass.createChildrenlessNode('FOR SENTENCE', null, @1.first_line, @1.first_column);
    node = NodeClass.addChildren(node, $3);
    node = NodeClass.addChild(node, $5);
    $$ = node;
  }
;

FOR_BODY 
  : FOR_START semicolon EXPRESSION semicolon FOR_END {
    node = NodeClass.createSimpleNode('FOR BODY');
    node = NodeClass.addChild(node, $1);
    aux = NodeClass.createSimpleNode('FOR MIDDLE');
    aux = NodeClass.addChild(aux, $3);
    node = NodeClass.addChild(node, aux);
    node = NodeClass.addChild(node, $5);
    $$ = node;
  }
  | FOR_START semicolon semicolon FOR_END {
    node = NodeClass.createSimpleNode('FOR BODY');
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $4);
    $$ = node;
  }
  | FOR_START semicolon EXPRESSION semicolon {
    node = NodeClass.createSimpleNode('FOR BODY');
    node = NodeClass.addChild(node, $1);
    aux = NodeClass.createSimpleNode('FOR MIDDLE');
    aux = NodeClass.addChild(aux, $3);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
  | FOR_START semicolon semicolon {
    node = NodeClass.createSimpleNode('FOR BODY');
    node = NodeClass.addChild(node, $1);
    $$ = node;
  }
  | semicolon EXPRESSION semicolon FOR_END {
    node = NodeClass.createSimpleNode('FOR BODY');
    aux = NodeClass.createSimpleNode('FOR MIDDLE');
    aux = NodeClass.addChild(aux, $2);
    node = NodeClass.addChild(node, aux);
    node = NodeClass.addChild(node, $4);
    $$ = node;
  }
  | semicolon EXPRESSION semicolon {
    node = NodeClass.createSimpleNode('FOR BODY');
    aux = NodeClass.createSimpleNode('FOR MIDDLE');
    aux = NodeClass.addChild(aux, $2);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
  | semicolon semicolon FOR_END {
    node = NodeClass.createSimpleNode('FOR BODY');
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | semicolon semicolon {
    $$ = NodeClass.createSimpleNode('FOR BODY');
  }
;

FOR_START 
  : TYPE id asignment EXPRESSION {
    node = NodeClass.createSimpleNode('FOR START');
    aux = NodeClass.createSimpleNode('VAR_T1');
    aux = NodeClass.addChild(aux, NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column));
    aux = NodeClass.addChild(aux, $4);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
  | ASIGNMENT {
    node = NodeClass.createSimpleNode('FOR START');
    node = NodeClass.addChild(node, $1);
    $$ = node;
  }
;

FOR_END 
  : EXPRESSION {
    node = NodeClass.createSimpleNode('FOR END');
    node = NodeClass.addChild(node, $1);
    $$ = node;
  }
  | ASIGNMENT {
    node = NodeClass.createSimpleNode('FOR END');
    node = NodeClass.addChild(node, $1);
    $$ = node;
  }
;

PRINT_SENTENCE
  : printKW leftP EXPRESSION rightP {
    node = NodeClass.createChildrenlessNode('PRINT', null, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, $3);
  }
;

THROW_SENTENCE
  : throwKW strcKW CALL 
;

TRY_SENTENCE
  : tryKW BLOCK catchKW leftP VAR_T5 rightP BLOCK
;





