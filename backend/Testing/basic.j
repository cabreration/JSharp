void principal() {
    polimorphism("Javier");
    polimorphism(24, 1.8);
    double arg1 = 10;
    double arg2 = 4.5;
    double suma = suma(arg1, arg2);
    print("El resultado de la suma es: " + suma + "\n");
    integer resta = (integer)resta(arg1, arg2);
    print("El resultado de la resta es " + resta + "\n");
    integer potencia = potencia(2, 7);
    print("El resultado de la potencia es: " + potencia + "\n");
}

void polimorphism(string name) {
    print("Your name is " + name + "\n");
}

void polimorphism(int edad, double estatura) {
    print("You're " + edad + " and " + estatura + " mts tall\n");
}

double suma(double arg1, double arg2) {
    return arg1 + arg2;
}

double resta(double arg1, double arg2) {
    return arg1 - arg2;
}

integer potencia(integer arg1, integer arg2) {
    return arg1 ^^ arg2;
}