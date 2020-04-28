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
"+"                                         return 'plusOp';
"-"                                         return 'minusOp';
"*"                                         return 'timesOp';
"/"                                         return 'divOp';
"%"                                         return 'modOp';
"!"                                         return 'notOp';
"^"                                         return 'xorOp'; 
">"                                         return 'greaterThan';

[a-zA-ZñÑ0-9]+".j"                          return 'fileName'; // este debe ser arreglado
([a-zA-ZñÑ_])[a-zA-Z0-9_]*                  return 'id';
["]("\\"["\n\r\t\\]|[^"])*["]               { yytext = yytext.substr(1, yyleng-2); return 'stringValue'; }
// char values missing
[0-9]+"."[0-9]+\b                           return 'doubleValue';
[0-9]+\b                                    return 'intValue';


<<EOF>>				                              return 'EOF';

// terminal symbols def end

.                                           {} // lexical errors should be caught here

/lex

%{
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
    node = NodeClass.createSimpleNode('ROOT');
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChildren(node, $2);
    $$ = node;
  }
  | DECL IMPORT DECL {
    node = NodeClass.createSimpleNode('ROOT');
    node = NodeClass.addChildren(node, $1);
    node = NodeClass.addChild(node, $2);
    node = NodeClass.addChildren(node, $3);
    $$ = node;
  }
  | DECL IMPORT {
    node = NodeClass.createSimpleNode('ROOT');
    node = NodeClass.addChildren(node, $1);
    node = NodeClass.addChild(node, $2);
    $$ = node;
  }
  | IMPORT {
    node = NodeClass.createSimpleNode('ROOT');
    node = NodeClass.addChild(node, $1);
    $$ = node;
  } 
  | DECL {
    node = NodeClass.createSimpleNode('ROOT');
    node = NodeClass.addChildren(node, $1);
    $$ = node;
  }
;

IMPORT 
  : importKW FILES {
    node = NodeClass.createSimpleNode('IMPORT');
    node = NodeClass.addChildren(node, $2);
    $$ = node;
  }
  | importKW FILES semicolon {
    node = NodeClass.createSimpleNode('IMPORT');
    node = NodeClass.addChildren(node, $2);
    $$ = node;
  }
;

FILES 
  : FILES comma fileName {
    node = $1;
    aux = NodeClass.createChildrenlessNode("file", $3, @3.first_line, @3.first_column);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
  | fileName {
    node = NodeClass.createSimpleNode('FILES');
    aux = NodeClass.createChildrenlessNode("file", $1, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
;

DECL 
  : DECL DECL_OPT {
    node = $1;
    node = NodeClass.addChild(node, $2);
    $$ = node;
  }
  | DECL_OPT {
    node = NodeClass.createSimpleNode('DECL_LIST');
    node = NodeClass.addChild(node, $1);
    $$ = node;
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
    node = NodeClass.createSimpleNode('FUNCTION');
    node = node.addChild($1);
    aux = NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column);
    node = node.addChild(aux);
    node = node.addChild($3);
    node = node.addChild($4);
    $$ = node;
  }
  | TYPE leftS rightS id PARAMETERS BLOCK {
    node = NodeClass.createSimpleNode('FUNCTION');
    $1.value += '[]';
    node = node.addChild($1);
    aux = NodeClass.createChildrenlessNode('identifier', $4, @4.first_line, @4.first_column);
    node = node.addChild(aux);
    node = node.addChild($5);
    node = node.addChild($6);
    $$ = node;
  }
  | id id PARAMETERS BLOCK {
    node = NodeClass.createSimpleNode('FUNCTION');
    aux = NodeClass.createChildrenlessNode('type', $1, @1.first_line, @1.first_column);
    node = node.addChild(aux);
    aux = NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column);
    node = node.addChild(aux);
    node = node.addChild($3);
    node = node.addChild($4);
    $$ = node;
  }
  | id leftS rightS id PARAMETERS BLOCK {
    node = NodeClass.createSimpleNode('FUNCTION');
    aux = NodeClass.createChildrenlessNode('type', $1+'[]', @1.first_line, @1.first_column);
    node = node.addChild(aux);
    aux = NodeClass.createChildrenlessNode('identifier', $4, @4.first_line, @4.first_column);
    node = node.addChild(aux);
    node = node.addChild($5);
    node = node.addChild($6);
    $$ = node;
  }
  | voidType id PARAMETERS BLOCK {
    node = NodeClass.createSimpleNode('FUNCTION');
    aux = NodeClass.createChildrenlessNode('type', 'void', @1.first_line, @1.first_column);
    node = node.addChild(aux);
    aux = NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column);
    node = node.addChild(aux);
    node = node.addChild($3);
    node = node.addChild($4);
    $$ = node;
  }
;

TYPE 
  : intType {
    $$ = NodeClass.createChildrenlessNode('type', 'integer', @1.first_line, @1.first_column);
  }
  | doubleType {
    $$ = NodeClass.createChildrenlessNode('type', 'double', @1.first_line, @1.first_column);
  }
  | booleanType {
    $$ = NodeClass.createChildrenlessNode('type', 'boolean', @1.first_line, @1.first_column);
  }
  | charTypes {
    $$ = NodeClass.createChildrenlessNode('type', 'char', @1.first_line, @1.first_column);
  }
;

PARAMETERS 
  : leftP PARAMETERS_LIST rightP {
    $$ = $2;
  }
  | leftP rightP {
    $$ = NodeClass.createSimpleNode('PARAMETERS');
  }
;

PARAMETERS_LIST 
  : PARAMETERS_LIST comma PARAMS_VALUE {
    node = $1;
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | PARAMS_VALUE {
    node = NodeClass.createSimpleNode('PARAMETERS');
    node = NodeClass.addChild(node, $1);
    $$ = node;
  }
;

PARAMS_VALUE
  : TYPE id {
    node = NodeClass.createSimpleNode('PARAMETER');
    node = NodeClass.addChild(node, $1);
    aux = NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
  | TYPE leftS rightS id {
    node = NodeClass.createSimpleNode('PARAMETER');
    $1.value += '[]';
    node = NodeClass.addChild(node, $1);
    aux = NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
  | id id {
    node = NodeClass.createSimpleNode('PARAMETER');
    aux = NodeClass.createChildrenlessNode('type', $1, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, aux);
    aux = NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
  | id leftS rightS id {
    node = NodeClass.createSimpleNode('PARAMETER');
    aux = NodeClass.createChildrenlessNode('type', $1+'[]', @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, aux);
    aux = NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
  | varKW id {
    node = NodeClass.createSimpleNode('PARAMETER');
    aux = NodeClass.createChildrenlessNode('type', 'var', @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, aux);
    aux = NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
;

BLOCK 
  : leftC SENTENCES rightC {
    $$ = $2;
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
    node = $1;
    aux = NodeClass.createChildrenlessNode('identifier', $1, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
  | id {
    node = NodeClass.createSimpleNode('ID_LIST');
    aux = NodeClass.createChildrenlessNode('identifier', $1, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, aux);
    $$ = node;
  }
;

VAR_T1 
  : TYPE ID_LIST asignment EXPRESSION {
    node = NodeClass.createSimpleNode('VAR_T1');
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $2);
    node = NodeClass.addChild(node, $4);
    $$ = node;
  }
  | id ID_LIST asignment EXPRESSION {
    node = NodeClass.createSimpleNode('VAR_T1');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', $1, @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, $2);
    node = NodeClass.addChild(node, $4);
    $$ = node;
  }
;

VAR_T2 
  : varKW id colonAsignment EXPRESSION {
    node = NodeClass.createSimpleNode('VAR_T2');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', 'var', @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column));
    node = NodeClass.addChild(node, $4);
    $$ = node;
  }
;

VAR_T3 
  : constKW id colonAsignment EXPRESSION {
    node = NodeClass.createSimpleNode('VAR_T3');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', 'const', @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column));
    node = NodeClass.addChild(node, $4);
    $$ = node;
  }
;

VAR_T4 
  : globalKW id colonAsignment EXPRESSION {
    node = NodeClass.createSimpleNode('VAR_T4');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', 'global', @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $2, @2.first_line, @2.first_column));
    node = NodeClass.addChild(node, $4);
    $$ = node;
  }
;

VAR_T5 
  : TYPE ID_LIST {
    node = NodeClass.createSimpleNode('VAR_T5');
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $2);
    $$ = node;
  }
  | id ID_LIST {
    node = NodeClass.createSimpleNode('VAR_T5');
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('type', $1, @1.first_line, @1.first_column));
    node = NodeClass.addChild(node, $2);
    node = NodeClass.addChild(node, $4);
    $$ = node;
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
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION orOp EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION andOp EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | notOp EXPRESSION %prec NOT {
    node = NodeClass.createChildrenlessNode('UNARY OPERATION', $1, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, $2);
    $$ = node;
  }
  | EXPRESSION notEquals EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION equalsValue EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION equalsReference EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION lessThan EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION lessEquals EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION greaterThan EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION greaterEquals EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION plusOp EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION minusOp EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION timesOp EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION divOp EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION modOp EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | EXPRESSION powOp EXPRESSION {
    node = NodeClass.createChildrenlessNode('BINARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, $1);
    node = NodeClass.addChild(node, $3);
    $$ = node;
  }
  | minusOp EXPRESSION %prec MINUS {
    node = NodeClass.createChildrenlessNode('UNARY OPERATION', $1, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, $2);
    $$ = node;
  }
  | id incOp {
    node = NodeClass.createChildrenlessNode('UNARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $1, @1.first_line, @1.first_column));
    $$ = node;
  }
  | id decOp {
    node = NodeClass.createChildrenlessNode('UNARY OPERATION', $2, @2.first_line, @2.first_column);
    node = NodeClass.addChild(node, NodeClass.createChildrenlessNode('identifier', $1, @1.first_line, @1.first_column));
    $$ = node;
  }
  | leftP EXPRESSION rightP {
    $$ = $2;
  }
  | stringValue {
    $$ = NodeClass.createChildrenlessNode('string value', $1, @1.first_line, @1.first_column);
  }
  | intValue {
    $$ = NodeClass.createChildrenlessNode('int value', Number($1), @1.first_line, @1.first_column)
  }
  | doubleValue {
    $$ = NodeClass.createChildrenlessNode('double value', Number($1), @1.first_line, @1.first_column);
  }
  | trueValue {
    $$ = NodeClass.createChildrenlessNode('bool value', true, @1.first_line, @1.first_column);
  }
  | falseValue {
    $$ = NodeClass.createChildrenlessNode('bool value', false, @1.first_line, @1.first_column);
  }
  | id {
    $$ = NodeClass.createChildrenlessNode('identifier', $1, @1.first_line, @1.first_column);
  }
  | nullValue {
    $$ = NodeClass.createChildrenlessNode('null value', null, @1.first_line, @1.first_column);
  }
  | CAST EXPRESSION %prec CASTING {
    node = $1;
    node = NodeClass.addChild(node, $2);
    $$ = node;
  }
  | strcKW id leftS EXPRESSION rightS
  | strcKW TYPE leftS EXPRESSION rightS
  | leftC E_LIST rightC
  | strcKW id leftP rightS
  | id dot id
  | id dot id ACCESS_LIST
;

CAST 
  : leftP intType rightP {
    $$ = NodeClass.createChildrenlessNode('CAST', 'integer', @2.first_line, @2.first_column);
  }
  | leftP doubleType rightP {
    $$ = NodeClass.createChildrenlessNode('CAST', 'double', @2.first_line, @2.first_column);
  }
  | leftP charType rightP {
    $$ = NodeClass.createChildrenlessNode('CAST', 'char', @2.first_line, @2.first_column);
  } 
  | leftP booleanType rightP {
    $$ = NodeClass.createChildrenlessNode('CAST', 'boolean', @2.first_line, @2.first_column);
  }
;

SENTENCES 
  : SENTENCES SENTENCE {
    node = $1;
    node = NodeClass.addChild(node, $2);
    $$ = node;
  }
  | SENTENCE {
    node = NodeClass.createSimpleNode('SENTENCES');
    node = NodeClass.addChild(node, $1);
    $$ = node;
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
    $$ = NodeClass.createChildrenlessNode('BREAK SENTENCE', null, @1.first_line, @1.first_column);
  }
  | breakKW semicolon {
    $$ = NodeClass.createChildrenlessNode('BREAK SENTENCE', null, @1.first_line, @1.first_column);
  }
  | continueKW {
    $$ = NodeClass.createChildrenlessNode('CONTINUE SENTENCE', null, @1.first_line, @1.first_column);
  }
  | continueKW semicolon {
    $$ = NodeClass.createChildrenlessNode('CONTINUE SENTENCE', null, @1.first_line, @1.first_column);
  }
  | 'return' {
    $$ = NodeClass.createChildrenlessNode('RETURN SENTENCE', null, @1.first_line, @1.first_column);
  }
  | returnKW semicolon {
    $$ = NodeClass.createChildrenlessNode('RETURN SENTENCE', null, @1.first_line, @1.first_column);
  }
  | returnKW EXPRESSION {
    node = NodeClass.createChildrenlessNode('RETURN SENTENCE', null, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, $2);
    $$ = node;
  }
  | returnKW EXPRESSION semicolon {
    node = NodeClass.createChildrenlessNode('RETURN SENTENCE', null, @1.first_line, @1.first_column);
    node = NodeClass.addChild(node, $2);
    $$ = node;
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
  : forKW leftP FOR_BODY rightP BLOCK
;

FOR_BODY 
  : FOR_START semicolon EXPRESSION semicolon FOR_END
  | FOR_START semicolon semicolon FOR_END
  | FOR_START semicolon EXPRESSION semicolon
  | FOR_START semicolon semicolon
  | semicolon EXPRESSION semicolon FOR_END
  | semicolon EXPRESSION semicolon
  | semicolon semicolon FOR_END
  | semicolon semicolon
;

FOR_START 
  : TYPE id asignment EXPRESSION
  | ASIGNMENT
;

FOR_END 
  : EXPRESSION
  | ASIGNMENT
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





