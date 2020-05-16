// Archivo de prueba - basicos


void principal() {
    nivel1();
    print("FIN NIVEL 1\n\n")
    nivel2Switch(10, "Salomon", "Otorrinolaringologo")
    switchAnidado();
    print('\n');
    pruebaAmbitos()
    print('\n');
    operacionFunciones();
    print('\n');
    inicio()
}

// DECLARACIONES SIMPLES

integer int1, int2, int3, int4, int5 = 47
double doub1, doub2, doub3, doub4, doub4 = 563.21
boolean bool1, bool2, bool3, bool4, bool5 = true;
char c1, c2, c3, c4, c5 = 'A';
string str1, str2, str3, str4, str5 = "Hola Mundo";

/*
 * Nivel 1
 * Imprimir algunas de las variables
 * Cambiar su valor y volver a imprimirlas
 * Declarar variables locales del metodo 
 * Imprimir esas variables
 * Incluye algunos casteos implicitos
*/
void nivel1() {
    print("El valor integer: " + int4 + "\n"); 
    print("El valor double: " + doub3 + "\n");
    print("El valor booleano: " + bool1 + "\n");
    print("El valor char: " + c5 + "\n");
    print("El valor de string: " + str2 + "\n");

    int4 = 'a';
    doub3 = int4;
    bool1 = !bool1;
    c5 = 'B';
    str2 = "Adios Mundo"

    print("El valor integer: " + int4 + "\n");
    print("El valor double: " + doub3 + "\n");
    print("El valor booleano: " + bool1 + "\n");
    print("El valor char: " + c5 + "\n");
    print("El valor de string: " + str2 + "\n");

    integer localI_1, localI_2, localI_3;
    boolean localB_1, localB_2, localB_3;
    double localD_1, localD_2, localD_3;
    char localC_1, localC_2, localC_3;
    string localS_1, localS_2, localS_3;

    // Imprimiendo los valores por defecto
    print("El valor integer: " + localI_2 + "\n");
    print("El valor double: " + localD_3 + "\n");
    print("El valor booleano: " + localB_1 + "\n");
    print("El valor char: " + localC_1 + "\n");
    print("El valor de string: " + localS_3 + "\n");

    // Cambiando valores
    localI_1 = 777
    localB_2 = !localB_2
    localD_3 = localD_3 + 88.88
    localC_1 = 't'
    localS_2 = "si alguien mas con su carinio"

    print("El valor integer: " + localI_1 + "\n");
    print("El valor double: " + localD_3 + "\n");
    print("El valor booleano: " + localB_2 + "\n");
    print("El valor char: " + localC_1 + "\n");
    print("El valor de string: " + localS_2 + "\n");
    print("\n\n");
}

/*
 * NIVEL 2
 * Una funcion por  cada sentencia de control, poco anidamiento
 */

void nivel2Switch(integer primero, string segundo, string tercero) {
    switch(primero) {
        case 6:
            print("Switch incorrecto\n");
            break;
        case 7:
            print("Aqui tambien es incorrecto\n")
            break
        case 8:
            print("Otro que es incorrecto\n");
        default:
            print("Justamente aqui es el lugar correcto: " + primero + "\n");
    }

    switch (segundo) {
        case "Salomon":
        case "David":
            print("Cases sin break correctos\n");
        default:
            print("Uff, segundo switch incorrecto\n");
    }

    switch(Tercero) {
        case "Dentista":
            print("Tercer Switch incorrecto :(");
            break;
        case "Dogtor":
            print("Tercer Switch incorrecto :'v");
        case "Otorrinolaringologo":
            print("Aqui si es!!! - Tercer Switch\n")
        default:
            print("Incorrecto - el default solo se imprime si no hay ninguna coincidencia \n");
    }

    print("\n\n");
}

void switchAnidado() {
    integer a=1
    switch(a)
    {
        case 1:
            print('l')
            a=a+3
            switch(a)
            {
                case 1:
                    print('l')
                    
                case 2:
                    print('m')
                    
                case 3:
                    print('w')
                    break
                case 4:
                    print('j')
                    
                case 5:
                    print('v')
                    
                default:
                    print('d')
                    
            }
            break
        case 2:
            print('m')
            break
        case 3:
            print('w')
            break
        case 4:
            print('j')
            break
        case 5:
            print('v')
            break
        default:
            print('d')
            break
    }
}

void nivel2While() {
    print("Funcion de While:\n")
    int i = 0;
    while (i < 100) {
        if (i == 15) {
            i++
            continue
        }
        else if (i == 30) {
            break
        }
        else if (i == 26) {
            print("retornando sin hacer break\n");
            return;
        }
        print(i);
        print('\n');
        i++
    }
    print("aplicando break\n");
}

void pruebaAmbitos() {

    integer i = 1;
    while (i <= 3) {
        integer j = 1;
        while (j <= 3) {
            print(i * j);
            print("\n");
            j++;
        }
        print("===========\n");
        i++;
    }

}

void operacionFunciones() {
    print(multiplicador(3,3));
    print("\n");
    print(multiplicador(6,4));
    print("\n");
    print(multiplicador(8,7));
    print("\n");
}

integer multiplicador(integer a, integer b){
    if (a * b < 15) {
        return 1;
    }else if (a * b >= 15 && a * b < 30) {
        return 2;
    }else {
        return 3;
    }
}

void piramide(integer limite) {
    for (integer i = 0; i < limite; i++) {
        if (i % 2 == 0) {
            print('\n');
            continue
        }
        for (integer j = i; j < limite; j++) {
            print("*")
        }
        print("\n");
    }

    print("Fin de la piramide\n\n");
}


/*
 * NIVEL 3 - sentencias de control complicadas
*/

void corazon(double n) {
    string figura = "";
    double i = -3 * n / 2;
    while (i < n + 1) {
        figura = "";
        double j = -3*n/2;
        while (j < ((3*n/2)+1)) {
            double absolutoI = i;
            double absolutoJ = j;
            if (i < 0) {
                absolutoI = i * -1;
            }
            if (j < 0) {
                absolutoJ = j*-1;
            }
            if ((absolutoI + absolutoJ < n) || ((-n/2-i) * (-n/2-i) + ( n/2-j) * ( n/2-j) <= n*n/2) || ((-n/2-i) * (-n/2-i) + (-n/2-j) * (-n/2-j) <= n*n/2)) {
                if (figura == null) {
                    figura = "* ";
                }
                else {  
                    figura = figura + "* ";
                }
            }
            else {
                if (figura == null) {
                    figura = ". "
                }
                else {
                    figura = figura + ". ";
                }
            }
            j = j + 1;
        }
        print(figura + "\n");
        i = i + 1;
    }

    print("\nFin del Corazon\n\n");
}

void arbol(){
    string figura = " ";
    string c = "* ";
    string b = "  ";
    double altura = 10;
    integer ancho = 1;
    integer i = 0;
    while (i < (altura/4)){
        integer k = 0
        integer j = 0
        while (k < (altura - i)){
            figura = figura+b
            k = k+1;
        }
        while (j < (i*2 + ancho)){
            figura = figura + c;
            j = j+1;
        }

        print(figura + "\n");
        figura =" ";
        i = i+1
    }
    figura = " ";
    i = 0
    while(i < (altura/4)){
        integer k = 0
        integer j = 0
        while(k < ((altura - i) - 2)){
            figura = figura + b;
            k = k+1
        }
        while(j < (i*2 + 5)){
            figura = figura + c;
            j = j+1
        }

        print(figura + "\n");
        figura = " ";
        i = i+1;
    }
    figura = " ";
    i = 0;
    while(i < (altura/4)){
        integer k = 0
        integer j = 0;
        while(k < ((altura - i) - 4)){
            figura = figura + b;
            k = k+1
        }
        while(j < (i*2 + 9)){
            figura = figura +c;
            j = j+1;
        }

        print(figura + '\n');
        figura = " ";
        i = i+1
    }

    figura = " ";
    i = 0;
    while(i < (altura/4)){
        integer k = 0;
        while(k < ((altura - i) - 6)){
            figura = figura + b;
            k = k+1
        }
        integer j = 0
        while(j < (i*2 + 13)){
            figura = figura + c;
            j = j+1;
        }

        print(figura + '\n');
        figura = " ";
        i = i+1;
    }
    figura = " ";
    i = 0;
    while(i < (altura/4)){
        integer k = 0;
        integer j = 0
        while(k < (altura -2)){
            figura = figura + b;
            k = k+1;
        }
        while(j < (5)){
            figura = figura + c;
            j = j+1
        }

        print(figura+"\n");
        figura = " ";
        i = i+1;
    }

    print("if la figura es un Arbol +10 <3\n");

}


integer var1 = 79;

void Inicio() {
    print("-----------------CALIFICACION-----------------\n");
    integer var1 = 0;

    if (var1 != 0)
    {
        print("No se toma con prioridad la variable local ante la global\n");
    }
    else{
        print("Tu manejo de los ambitos parece correcto\n")
    }

    Declaracion();

    Ambitos2();

    Aritmeticas();

    boolean logic = Logicas();
    print("Resultado de Logicas: " + logic + "\n");

    Relacionales();
}

 void declaracion(){
    print("========= Metodo Declaracion =========\n");
    var n4 := 2;
    var str4 := "Voy a ganar Compiladore";
    var db4 := 0.0;
    var db1 := db4;
    var chr4 := 's';

    if (db1 == db4) {
        print(str4 + chr4 +" " +n4+" :D\n");
    }
    else {
        print("Problemas en el metodo declaracion :(\n");
    }
    print("======================================\n");
}

 void Ambitos2(){
    print("========= Error Ambitos ==============\n");
    print("Debería lanzar error: "+amb1);
    string amb1 = "Desde ambito2";
    print("======================================\n");
    print("================ Nice ================\n");
    punteo = punteo + 5;
    print("Sin error: "+amb1+ "\n");
    print("======================================\n");

}

 void operacionesBasicas(){
    print("Operaciones Aritmeticas 1: valor esperado:  \na)62   \nb)0   \nc)-19   \nd)256   \nresultados>\n");
    double a = (20-10+8/2*3+10-10-10+50/1+0+890*0);
    double b = (50/50*50-0+50-100+100/1-100+0+0/910);
    double c = (100/20*9-78+6-7-0+8/1-7+7*1*2*3/3-0);
    integer d = (2^^(integer)(20/5*2+0));
    print("a) " +a + "\n");
    print("b) " +b + "\n");
    print("c) " +c + "\n");
    print("d) " +d + "\n");
    if (a == 62 && b == 0 && c == -19 && d == 256) {
        print("Operaciones aritmeticas 1 bien :D\n");
    }else {
        print("Error en las operaciones basicas :(\n");
    }
}

void Aritmeticas() {

    print("==============Aritmeticas=============\n");
    string art1 = "Hola "+"C"+"O"+"M"+"P"+"I" + '\n';
    print(art1);
    if (art1=="Hola COMPI\n"){
        print("you da beast\n");
    }else {
        print("Perdiste 3 puntos en suma de y :c");
    }

    double n1 = 0.0 + 1 + 1 + 1 + 0.1 + 49;
    print("El valor de  n1 = "+n1);
    if (n1 == 52.1){
        print("Buena suma muchacho\n");
    }else {
        print("Perdiste 5 puntos en suma de enteros booleanos y caracteres :c\n");
    }

    double n4 = (5750 * 2) - 11800 * 1.0;
    double n3 = (((3 * 3) + 4) - 80 + 40.00 * 2 + 358.50 - (29 / 14.50)) - (0.50) + n4;
    print("El valor de n3 = " + n3 + "\n");
    if (n3 == 69 || n3 == 69.0)
    {
        print("Buenas aritmeticas muchacho\n");
    }
    else 
    {
        print("Perdiste 3 puntos :c \n");
    }
    
    operacionesBasicas();
    operacionesAvanzadas();
    print("======================================\n");
    
}

void operacionesAvanzadas() {
    double aritmetica1 = 2;
    integer aritmetica2 = -10;
    print("Operaciones Aritmeticas 2: valor esperado> -20  41, resultado>\n");
    integer aritmetica3 = -aritmetica2*(integer)aritmetica1;
    print(aritmetica3+"\n");
    aritmetica1 = aritmetica3/aritmetica1+50^^2/50+50*2-100+100/100-0;
    print(aritmetica1+"\n");
    if (aritmetica3 == 20 && aritmetica1 == 61){
        print("Operaciones aritmeticas 2 bien :D");
    } else {
        print("Error Operaciones Aritmeticas :c alv :c");
    }
}

boolean Logicas() {
    print("==============Logicas1=============\n");
    if (!!!!!!!!!!!!!!!!!!!!!!true){
        print("Bien primera condicion :)\n");
    }else {
        print("Perdiste 1 punto :c");
    }

    if (true && true || false && false && false || !true){
        print("Bien segunda condicion:)\n");
    } else {
        print("Perdiste 1 punto :c");
    }
    print("======================================");
    return Logicas2();
}

boolean logicas2() {
    integer n0 = 16;
    print("==============Logicas2=============\n");

    if (!(!(n0 == 16 && false==true) && !(true))){
        print("Not y Ands Correctos\n");
    }else {
        print("No funcionan nots y ands :(");
    }

    integer n1 = (integer)(n0/16);
    n1 = n1 + 1;
    boolean condicion1 = n1 != 2;
    double aritmetica1 = n0/16 + 0; 
    boolean condicion2 = aritmetica1 == n1;
    boolean condicion3 = !true; 

    if (!(!(!(condicion1 || condicion2) || condicion3 ))){
        print("Nots y Ors correectos\n");
        return true;
    }else {
        print("No Funciona nots y ands :(");
        return false;
    }
    print("======================================\n");
}

void Relacionales(){
    integer n0 = 34;
    integer n1 = 16;

    relaciones1(n0);
    const rel := relaciones2(n1);
    print(rel+'\n');
}


void relaciones1(integer salida) {
    print("==============relacionales1=============\n");
    double n0 = salida + 0.0;
    if (n0 < 34.44) {
        salida = salida+15;
        if (salida > 44) {
            salida = salida + 1
        }
    }
    else {
        salida = 1;
    }

    if (salida != 1) {
        if (salida == 50) {
            print("salida Correcta Relacionales 1!\n");
        }
        else {
            print("salida incorrecta!!\n");
        }
    }
    else {
        print("salida incorrecta!!\n");
    }
    print("======================================\n");
}

string relaciones2(integer n0){
    print("vas bien, animo :D\n");
    print("============Relacionales2=============\n");

    if (10-15 >= 0 && 44.44 == 44.44) {
        print("salida incorrecta primer if relacionales2!!");
    }
    else {
        if (15+8 == 22-10+5*3-4 && 13*0>-1) {
            if (10.0 != 11.0-1.01 ) {
                print("salida CORRECTA en relacionales2!!\n");
                SentenciasAnidadas();
                return "Eres un campeon";
            }
            else {
                print("salida incorrecta segundo if relacionales 2!!");
                return "La stas cagando"
            }
        }
        else {
            if (1 == 1) {
                print("salida incorrecta relacionales 2 3er if !!");
            }
            else {
                print("salida incorrecta relacionales 2 Sino3er if !!");
            }
        }
    }
    print("======================================");
    return "stas mal we\n";
}

void SentenciasAnidadas(){
    integer numero1 = 0;
    do {
    switch(numero1){
        case 0:
            piramide(10)
            break;
        case 1:
            corazon(6)
            break;
        case 2:
            arbol()
            break;
        default:
            print("Esto se va a print 2 veces :3\n");
    }
    numero1 = numero1 + 1;
    }while(numero1 <5);
}