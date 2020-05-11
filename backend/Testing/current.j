void principal() {
    funcionIf()
}

void funcionIf() {
    string one = "correcto, ya puedes ir a la carcel";
    string two = "incorrecto";
    string name = "Javier";
    int edad = 24;
    if (edad == 18) {
        print(one);
    }
    else if (edad == 21) {
        print("ya puedes consumir alcohol en todo el mundo");
    }
    else if (edad == 30) {
        print("Ya no hay vuelta atras amigo");
    }
    else {
        print("Este es tu anio!!\n");
        double h = 1.80;
        if (h > 1.75) {
            print("Puedes conseguir a todas las chicas\n");
        }
        else {
            print("La tienes un poco mas dificil");
        }
    }
}