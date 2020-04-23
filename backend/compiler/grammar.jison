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
"print"                                     return 'printKW';

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
  : SCRIPT
;

SCRIPT 
  : IMPORT DECL
  | DECL IMPORT DECL
  | DECL IMPORT
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
  : DECL DECL_OPT
  | DECL_OPT
;

DECL_OPT
  : FUNCTION_DECL
  | VAR_DECL
  | VAR_DECL semicolon
  | ARRAY_DECL
  | ARRAY_DECL semicolon
  | STRC_DEF
  | STRC_DEF semicolon
;

FUNCTION_DECL 
  : TYPE id PARAMETERS BLOCK
  | TYPE leftS rightS id PARAMETERS BLOCK
  | id id PARAMETERS BLOCK
  | id leftS rightS id PARAMETERS BLOCK
  | voidType id PARAMETERS BLOCK
;

TYPE 
  : intType
  | doubleType
  | booleanType
  | charTypes
;

PARAMETERS 
  : leftP PARAMETERS_LIST rightP
  | leftP rightP
;

PARAMETERS_LIST 
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
  | VAR_T2
  | VAR_T3
  | VAR_T4 
  | VAR_T5
;

ID_LIST 
  : ID_LIST comma id
  | id
;

VAR_T1 
  : TYPE ID_LIST asignment EXPRESSION
  | id ID_LIST asignment EXPRESSION
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
  : TYPE ID_LIST
  | id ID_LIST
;

ARRAY_DECL
  : TYPE leftS rightS id asignment strcKW TYPE leftS EXPRESSION rightS
  | id leftS rightS id asignment strcKW id leftS EXPRESSION rightS
  | TYPE leftS rightS id asignment leftC E_LIST rightC
  | id leftS rightS id asignment leftC E_LIST rightC
;

E_LIST 
  : E_LIST comma EXPRESSION
  | EXPRESSION
;

STRC_DEF
  : defineKW id asKW leftS ATT_LIST rightS
;

ATT_LIST
  : ATT_LIST ATTRIBUTE
  | ATTRIBUTE
;

ATTRIBUTE 
  : TYPE id
  | id id
  | TYPE leftS rightS id
  | id left rightS id
  | TYPE id asignment EXPRESSION
  | id id asignment EXPRESSION
  | TYPE leftS rightS id asignment EXPRESSION
  | id leftS rightS asignment EXPRESSION
;

EXPRESSION 
  : EXPRESSION xorOp EXPRESSION
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
  | minusOp EXPRESSION %prec MINUS
  | id incOp
  | id decOp
  | leftP EXPRESSION rightP
  | stringValue
  | intValue
  | doubleValue
  | trueValue
  | falseValue
  | id
  | nullValue
  | CAST EXPRESSION %prec CASTING
  | strcKW id leftS EXPRESSION rightS
  | strcKW TYPE leftS EXPRESSION rightS
  | leftC E_LIST rightC
  | strcKW id leftP rightS
;

CAST 
  : leftP intType rightP
  | leftP doubleType rightP
  | leftP charType rightP
  | leftP booleanType rightP
;

SENTENCES 
  : SENTENCES SENTENCE
  | SENTENCE
;

SENTENCE 
  : VAR_DECL
  | VAR_DECL semicolon
  | ARRAY_DECL
  | ARRAY_DECL semicolon
  | ASIGNMENT
  | ASIGNMENT semicolon
  | IF_SENTENCE
  | SWITCH_SENTENCE
  | WHILE_SENTENCE
  | DOWHILE_SENTENCE
  | DOWHILE_SENTENCE semicolon
  | FOR_SENTENCE
  | PRINT_SENTENCE
  | PRINT_SENTENCE semicolon
  | THROW_SENTENCE
  | THROW_SENTENCE semicolon
  | TRY_SENTENCE
  | breakKW
  | breakKW semicolon
  | continueKW
  | continueKW semicolon
  | return
  | returnKW semicolon
  | returnKW EXPRESSION
  | returnKW EXPRESSION semicolon
;

ASIGNMENT 
  : id asignment EXPRESSION
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

CASES_LIST 
  : CASES_LIST SINGLE_CASE
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
  : printKW leftP EXPRESSION rightP
;

THROW_SENTENCE
  : throwKW strcKW CALL
;

TRY_SENTENCE
  : tryKW BLOCK catchKW leftP VAR_T5 rightP BLOCK
;





