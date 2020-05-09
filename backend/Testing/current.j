// Archivo de Operaciones y Expresiones

// Nivel 0
// Imprimir sin asignar

void nivel0() {
    print("Nivel 0\n");
    print(56);
    print('\n')
    print(8596.2145)
    print('\n')
    print(false);
    print('\n')
    print(true)
    print('\n')
    print('b')
    print('\n')
    print(null);
    print('\n');
}

// Nivel 1 - Imprimir con variables

int one = 1001;
double two = 5214.215
boolean three = false;
char four = 'y';
string five = "I can, i will, i must\n";

void nivel1() {
    print("Nivel 1:\n");
    print(one);
    print('\n');
    print(two);
    print('\n');
    print(three);
    print('\n');
    print(four);
    print('\n');
    print(five);
}

// Nivel 2 - le asignamos nuevos valores a las variables globales
void nivel2() {
    print("Nivel 2\n");
    one = 256;
    two = 453.2345
    three = true;
    four = 'x';
    five = "i am\n";
    print(five);
    print(four);
    print('\n');
    print(three);
    print('\n');
    print(two);
    print('\n');
    print(one);
    print('\n');
}


// Nivel 3 - operaciones aritmeticas

void nivel3() {
    print("Nivel 3\n");
    var a := (20-10+8/2*3+10-10-10+50); // 62
    const b := (50/50*50+50-100+100-100); // 0
    global c := (100/20*9-78+6-7+8-7+7*1*2*3/3); // -19
    int d = (2^^(10)); // 256
    print(a);
    print('\n');
    print(b);
    print('\n')
    print(c);
    print('\n');
    print(d);
    print('\n');
}


//Nivel 4 - Logicas
void nivel4() {
    print("\nNivel 4:\n");
    boolean bool, bool2 =  false || false || false && false && false || !false
    print(bool);
    bool2 = !bool2;
    print('\n');
    print(bool2);
    print('\n');
    boolean t = !!!!!!!!!!!!!!!!!!!!!!true
    print(t);
    print('\n')
    print(!t)
    print('\n');
    print(t ^ !t);
    print('\n')
    print(t ^ t);
}

void principal() {
    nivel0()
    nivel1();
    nivel2();
    nivel3();
    nivel4();
}