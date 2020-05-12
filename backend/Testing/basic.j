// Archivo de prueba - basicos


void principal() {

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
}
