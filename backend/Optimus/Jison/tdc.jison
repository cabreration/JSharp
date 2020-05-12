/* Definicion Léxica */
%lex
%options case-insensitive

//%x string

%%

\s+                                          // white spaces are ignore
"##".*									             	       // single line comments
[#][*][^*]*[*]+([^#*][^*]*[*]+)*[#]	         // multiple line comments

// terminal symbols def start
"t"[0-9]+                                   return 'temp';
"L"[0-9]+                                   return 'label';
"var"                                       return 'varKW';
"begin"                                     return 'beginKW';
"if"                                        return 'ifKW';
"stack"                                     return 'stackKW';
"end"                                       return 'endKW';
"heap"                                      return 'heapKW';
"call"                                      return 'callKW';
"goto"                                      return 'gotoKW';
"print"                                     return 'printKW';
"proc"                                      return 'procKW';
"p"                                         return 'p';
"h"                                         return 'h';

">="                                        return 'greaterEquals';
"<="                                        return 'lessEquals';
"=="                                        return 'equals';
"<>"                                        return 'notEquals';

"+"                                         return 'plusOp';
"-"                                         return 'minusOp';
"*"                                         return 'timesOp';
"/"                                         return 'divOp';
"%"                                         return 'modOp';
">"                                         return 'greaterThan';
"<"                                         return 'lessThan';
";"                                         return 'semicolon';
":"                                         return 'colon';
"="                                         return 'asignment';
"("                                         return 'leftP';
")"                                         return 'rightP';
"["                                         return 'leftS';
"]"                                         return 'rightS';
","                                         return 'comma';

["]"%c"["]                                  return 'printChar';
["]"%i"["]                                  return 'printInt';
["]"%d"["]                                  return 'printDouble';
([a-zA-ZñÑ])[a-zA-Z0-9ñÑ_]*                 return 'id';
[0-9]+"."[0-9]+\b                           return 'float';
[0-9]+\b                                    return 'int';


<<EOF>>				                              return 'EOF';

// terminal symbols def end

.                                           {}

/lex

%{
%}

%start INIT

%%

INIT
    : TDC EOF
;

TDC
    : HEADER BODY
;

HEADER
    : TEMPS_DECL P_DECL HEAP_DECL STACK_DECL 
;

TEMPS_DECL
    : varKW TEMPS_LIST semicolon
;

TEMPS_LIST
    : TEMPS_LIST comma temp
    | temp
;

P_DECL
    : varKW p comma h semicolon
;

HEAP_DECL
    : varKW heapKW leftS rightS semicolon
;

STACK_DECL
    : varKW stackKW leftS rightS semicolon
;

BODY
    : INSTRUCTIONS
;

INSTRUCTIONS
    : INSTRUCTIONS INSTRUCTION
    | INSTRUCTION
;

INSTRUCTION
    : ASIGNMENT
    | DESTINATION
    | JUMP
    | CONDITIONAL_JUMP
    | PROCEDURE
    | CALL
    | PRINT
;

ASIGNMENT
    : A_OPT asignment EXPRESSION semicolon
;

A_OPT
    : temp
    | p
    | h
    | stackKW leftS temp rightS
    | stackKW leftS int rightS
    | stackKW leftS p rightS
    | heapKW leftS temp rightS
    | heapKW leftS int rightS
    | heapKW leftS h rightS
;

EXPRESSION
    : minusOp E_OPT
    | E_OPT OPERATOR E_OPT
    | E_OPT
    | stackKW leftS temp rightS
    | stackKW leftS int rightS
    | stackKW leftS p rightS
    | heapKW leftS temp rightS
    | heapKW leftS int rightS
    | heapKW leftS h rightS
;

E_OPT
    : temp
    | int
    | float
    | p
    | h
;

OPERATOR
    : plusOp
    | minusOp
    | divOp
    | timesOp
    | modOp
;

DESTINATION
    : label colon
;

JUMP
    : gotoKW label semicolon
;

CONDITIONAL_JUMP
    : ifKW leftP CONDITION rightP gotoKW label semicolon
;

CONDITION
    : C_OPT COND_OP C_OPT
;

C_OPT
    : int 
    | float
    | temp 
;

COND_OP
    : notEquals
    | equals
    | lessThan
    | lessEquals
    | greaterThan
    | greaterEquals 
;

PROCEDURE
    : procKW id beginKW INSTRUCTIONS endKW
;

CALL
    : callKW id semicolon
;

PRINT
    : printKW leftP PRINT_OPT comma PRINT_VALUES rightP semicolon
;

PRINT_OPT
    : printChar
    | printDouble
    | printInt
;

PRINT_VALUES
    : temp
    | int
    | float
    | h
    | p
;

