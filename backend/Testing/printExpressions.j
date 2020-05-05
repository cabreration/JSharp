var str := "hola mundo";

void principal() {
    int test;
    string test2;
    print(str + " milagro en la celda 7");
    str = "otra que no sea la mia";
    print('\n');
    print(str)
    print('\n');
    print(test);
    print('\n');
    test = 87;
    print(test);
    print('\n');
    test2 = "si por cosas del destino ";
    print(test2)
    print('\n')
    test2 = test2 + test;
    print(test2)
    method2();
}

void method2() {
    print('\n');
    print("Estoy en otro lugar");
}