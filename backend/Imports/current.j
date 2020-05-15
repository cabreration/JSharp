void principal() {
    inicio();
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

    //Logicas();

    //Relacionales();
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
    
    //operacionesBasicas();
    //operacionesAvanzadas();
    print("======================================\n");
    
}