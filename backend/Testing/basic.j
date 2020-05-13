// Archivo de prueba - basicos


void principal() {
    nivel1();
    print("FIN NIVEL 1\n\n")
    nivel2Switch(10, "Salomon", "Otorrinolaringologo")
    switchAnidado();
    piramide(10)
    print("FIN NIVEL 2\n\n");
    corazon(5);
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

void piramide(integer limite) {
    for (integer i = 0; i < limite; i++) {
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
