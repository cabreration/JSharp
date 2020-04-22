/* Definicion Léxica */
%lex
%options case-insensitive

%%
\s+                                          // white spaces are ignored
"//".*									             	       // single line comments
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]	         // multiple line comments

// terminal symbols def start

([a-zA-ZñÑ0-9_]".")+".j"                    return 'fileName';
([a-zA-ZñÑ_])[a-zA-Z0-9_]*                  return 'id';
\"[^\"]*\"				                          { yytext = yytext.substr(1, yyleng-2); return 'stringValue'; }
// char values missing
[0-9]+\b                                    return 'intValue';
[0-9]+"."[0-9]+\b                           return 'doubleValue';
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

","                                         return 'comma';
";"                                         return 'semicolon';
":"                                         return 'colon';
"."                                         return 'dot';
"="                                         return 'asignment';
":="                                        return 'colonAsignment';
"("                                         return 'leftP';
")"                                         return 'rightP';
"["                                         return 'leftS';
"]"                                         return 'rightS';
"+"                                         return 'plusOp';
"-"                                         return 'minusOp';
"*"                                         return 'timesOp';
"/"                                         return 'divOp';
"%"                                         return 'modOp';
"++"                                        return 'incOp';
"--"                                        return 'decOp';
"^^"                                        return 'powOp';
"=="                                        return 'equalsValue';
"==="                                       return 'equalsReference';
"!="                                        return 'notEquals';
"<"                                         return 'lessThan';
"<="                                        return 'lessEquals';
">"                                         return 'greaterThan';
">="                                        return 'greaterEquals'; 
"&&"                                        return 'andOp';
"||"                                        return 'orOp';
"!"                                         return 'notOp';
"^"                                         return 'xorOp';     

<<EOF>>				                              return 'EOF';

// terminal symbols def end

.                                           {} // lexical errors should be caught here

/lex

%{
%}

// precedencia
%left incOp decOp
%left xorOp
%left orOp
%left andOp
%right equalsValue equalsReference notEquals
%nonassoc lessThan lessEquals greaterThan greaterEquals
%left plusOp minusOp
%left timesOp divOp modOp
%left powOp
%left UMINUS NOT

%start INIT

%%

INIT
  : SCRIPT EOF
;

SCRIPT
  : IMPORT DECL
  | DECL IMPORT
  | DECL IMPORT DECL
;

IMPORT
  : importKW FILES
  | importKW FILES semicolon
;

FILES
  : FILES comma fileName
  | fileName
;

DECL
  : DECL FUNCTION_DECL
  | DECL VAR_DECL
  | FUNCTION_DECL
  | VAR_DECL 
;

FUNCTION_DECL
  : TYPE_R id PARAMETERS BLOCK 
  | voidType id PARAMETERS BLOCK
;

TYPE_R
  : TYPE leftS rightS
  | TYPE
;

TYPE
  : intType
  | doubleType
  | booleanType
  | charType
  | id
;

PARAMETERS
  : leftP PARAMETERS_LIST rightP
  | leftP rightP
;

PARATEMERS_LIST
  : PARAMETERS_LIST comma TYPE_R id
  | PARAMETERS_LIST comma varKW id
  | TYPE_R id
  | varKW id
;

BLOCK
  : leftC SENTENCES rightC
;

VAR_DECL 
  : VAR_T1
  | VAR_T1 asignment semicolon
  | VAR_T2 colonAsignment
  | VAR_T2 semicolon
  | VAR_T3
  | VAR_T3 semicolon
  | VAR_T4
  | VAR_T4 semicolon
  | VAR_T5
  | VAR_T5 semicolon
;

ID_LIST
  : ID_LIST comma id
  | id
;

VAR_T1
  : TYPE_R ID_LIST asignment EXPRESSION
;

VAR_T2
  : varKW id colonAsignment EXPRESSION
;

VAR_T3
  : constKW id colonAsignment EXPRESSION
;

VAR_T4
  : globalKW id colonAsignment EXPRESSION
;

VAR_T5
  : TYPE_R LIST
;

EXPRESSION
  : EXPRESSION incOp
  | EXPRESSION decOp
  | EXPRESION xorOp EXPRESSION
  | EXPRESSION orOp EXPRESSION
  | EXPRESSION andOp EXPRESSION
  | notOp EXPRESSION %prec NOT
  | EXPRESSION notEquals EXPRESSION
  | EXPRESSION equalsValue EXPRESSION
  | EXPRESSION equalsReference EXPRESSION
  | EXPRESSION lessThan EXPRESSION
  | EXPRESSION lessEquals EXPRESSION
  | EXPRESSION greaterThan EXPRESSION
  | EXPRESSION greaterEquals EXPRESSION
  | EXPRESSION plusOp EXPRESSION
  | EXPRESSION minusOp EXPRESSION
  | EXPRESSION timesOp EXPRESSION
  | EXPRESSION divOp EXPRESSION
  | EXPRESSION modOp EXPRESSION
  | EXPRESSION powOp EXPRESSION
  | minusOp EXPRESSION %prec UMINUS
  | leftP EXPRESSION rightP
  | stringValue
  | intValue
  | doubleValue
  | trueValue
  | falseValue
  | id
  | CALL
  | id ACCESS_LIST
;

SENTENCES
  : SENTENCES SENTENCE
  | SENTENCE
;

SENTENCE
  : ASIGNMENT
  | ASIGNMENT semicolon
  | IF_SENTENCE
  | SWITCH_SENTENCE
  | WHILE_SENTENCE
  | DOWHILE_SENTENCE
  | DOWHILE_SENTENCE semicolon
  | FOR_SENTENCE
;

ASIGNMENT 
  : id ACCESS_LIST asignment EXPRESSION
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
  : id leftP ID_LIST leftP
  | id leftP rightP
;

IF_SENTENCE 
  : ifKW leftP EXPRESSION rightP BLOCK
  | ifKW leftP EXPRESSION rightP BLOCK ELSE_SENTENCE
;

ELSE_SENTENCE 
  : elseKW BLOCK
  | elseKW IF_SENTENCE
;

SWITCH_SENTENCE 
  : switchKW leftP EXPRESSION rightP leftC SWITCH_BODY rightC
;

SWITCH_BODY 
  : CASES_LIST
  | CASES_LIST DEFAULT_CASE
;

CASES_LIST : CASES_LIST SINGLE_CASE
  | SINGLE_CASE                           
;

SINGLE_CASE 
  : caseKW EXPRESSION colon SENTENCES
;

DEFAULT_CASE 
  : defaultKW colon SENTENCES 
;

WHILE_SENTENCE 
  : whileKW leftP EXPRESSION rightP BLOCK
;

DOWHILE_SENTENCE 
  : doKW BLOCK whileKW leftP EXPRESSION rightP
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
;

FOR_START 
  : TYPE id asignment EXPRESSION
  | ASIGNMENT
;

FOR_END 
  : EXPRESSION
  | ASIGNMENT
;




