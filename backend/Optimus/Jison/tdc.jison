/* Definicion Léxica */
%lex
%options case-insensitive

//%x string

%%

\s+                                          // white spaces are ignore
"#".*									             	       // single line comments
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
    const PrintTDC = require('../Logic/printTDC').PrintTDC;
    const CallTDC = require('../Logic/callTDC').CallTDC;
    const ProcTDC = require('../Logic/procTDC').ProcTDC;
    const ConditionTDC = require('../Logic/conditionTDC').ConditionTDC;
    const ConditionalJump = require('../Logic/conditionalJump').ConditionalJump;
    const Jump = require('../Logic/jump').Jump;
    const Destination = require('../Logic/destination').Destination;
    const AsignmentTDC = require('../Logic/asignmentTDC').AsignmentTDC;
    const Right = require('../Logic/right').Right;
    const Left = require('../Logic/left').Left;
    const Temps = require('../Logic/temps').Temps;
    let lines = [];
%}

%start INIT

%%

INIT
    : TDC EOF {
        return lines;
    }
;

TDC
    : HEADER BODY
;

HEADER
    : TEMPS_DECL P_DECL HEAP_DECL STACK_DECL 
;

TEMPS_DECL
    : varKW TEMPS_LIST semicolon {
        lines.push(new Temps($2));
    }
;

TEMPS_LIST
    : TEMPS_LIST comma temp {
        $1.push($3);
        $$ = $1;
    }
    | temp {
        $$ = [$1];
    }
;

P_DECL
    : varKW p comma h semicolon
    | varKW h comma p semicolon
;

HEAP_DECL
    : varKW heapKW leftS rightS semicolon
;

STACK_DECL
    : varKW stackKW leftS rightS semicolon
;

BODY
    : INSTRUCTIONS {
        $1.forEach(ins => {
            lines.push(ins);
        });
    }
;

INSTRUCTIONS
    : INSTRUCTIONS INSTRUCTION {
        $1.push($2);
        $$ = $1;
    }
    | INSTRUCTION {
        $$ = [$1];
    }
;

INSTRUCTION
    : ASIGNMENT {
        $$ = $1;
    }
    | DESTINATION {
        $$ = $1;
    }
    | JUMP {
        $$ = $1;
    }
    | CONDITIONAL_JUMP {
        $$ = $1;
    }
    | PROCEDURE {
        $$ = $1;
    }
    | CALL {
        $$ = $1;
    }
    | PRINT {
        $$ = $1;
    }
;

ASIGNMENT
    : A_OPT asignment EXPRESSION semicolon {
        $$ = new AsignmentTDC($1, $3, @2.first_line);
    }
;

A_OPT
    : temp {
        $$ = new Left(1, $1);
    }
    | p {
        $$ = new Left(1, $1);
    }
    | h {
        $$ = new Left(1, $1);
    }
    | stackKW leftS temp rightS {
        $$ = new Left(2, $3);
    }
    | stackKW leftS int rightS {
        $$ = new Left(2, $3);
    }
    | stackKW leftS p rightS {
        $$ = new Left(2, $3);
    }
    | heapKW leftS temp rightS {
        $$ = new Left(3, $3);
    }
    | heapKW leftS int rightS {
        $$ = new Left(3, $3);
    }
    | heapKW leftS h rightS {
        $$ = new Left(3, $3);
    }
;

EXPRESSION
    : minusOp E_OPT {
        $$ = new Right(1, $2, null, $1);
    }
    | E_OPT OPERATOR E_OPT {
        $$ = new Right(2, $1, $3, $2);
    }
    | E_OPT {
        $$ = new Right(3, $1, null, null);
    }
    | stackKW leftS temp rightS {
        $$ = new Right(4, $3, null, null);
    }
    | stackKW leftS int rightS {
        $$ = new Right(4, $3, null, null);
    }
    | stackKW leftS p rightS {
        $$ = new Right(4, $3, null, null);
    }
    | heapKW leftS temp rightS {
        $$ = new Right(5, $3, null, null);
    }
    | heapKW leftS int rightS {
        $$ = new Right(5, $3, null, null);
    }
    | heapKW leftS h rightS {
        $$ = new Right(5, $3, null, null);
    }
;

E_OPT
    : temp {
        $$ = $1;
    }
    | int {
        $$ = Number($1);
    }
    | float {
        $$ = Number($1);
    }
    | p {
        $$ = $1;
    }
    | h {
        $$ = $1;
    }
;

OPERATOR
    : plusOp {
        $$ = $1;
    }
    | minusOp {
        $$ = $1;
    }
    | divOp {
        $$ = $1;
    }
    | timesOp {
        $$ = $1;
    }
    | modOp {
        $$ = $1;
    }
;

DESTINATION
    : label colon {
        $$ = new Destination($1, @1.first_line);
    }
;

JUMP
    : gotoKW label semicolon {
        $$ = new Jump($2, @1.first_line);
    }
;

CONDITIONAL_JUMP
    : ifKW leftP CONDITION rightP gotoKW label semicolon {
        $$ = new ConditionalJump($3, $6, @1.first_line);
    }
;

CONDITION
    : C_OPT COND_OP C_OPT {
        $$ = new ConditionTDC($1, $3, $2)
    }
;

C_OPT
    : int {
        $$ = $1;
    }
    | float {
        $$ = $1;
    }
    | temp {
        $$ = $1;
    }
;

COND_OP
    : notEquals {
        $$ = $1;
    }
    | equals {
        $$ = $1;
    }
    | lessThan {
        $$ = $1;
    }
    | lessEquals {
        $$ = $1;
    }
    | greaterThan {
        $$ =$1;
    }
    | greaterEquals {
        $$ = $1;
    }
;

PROCEDURE
    : procKW id beginKW INSTRUCTIONS endKW {
        $$ = new ProcTDC($2, $4, @1.first_line);
    }
;

CALL
    : callKW id semicolon {
        $$ = new CallTDC($2, @1.first_line);
    }
;

PRINT
    : printKW leftP PRINT_OPT comma PRINT_VALUES rightP semicolon {
        $$ = new PrintTDC($3, $5, @1.first_line);
    }
;

PRINT_OPT
    : printChar {
        $$ = $1;
    }
    | printDouble {
        $$ = $1;
    }
    | printInt {
        $$ = $1;
    }
;

PRINT_VALUES
    : temp {
        $$ = $1;
    }
    | int {
        $$ = $1;
    }
    | float {
        $$ = $1;
    }
    | h {
        $$ = $1;
    }
    | p {
        $$ = $1;
    }
;

