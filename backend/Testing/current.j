void principal() {
    string one = "correcto, ya puedes ir a la carcel";
    string two = "incorrecto";
    int edad = 23;
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
        print("Esta edad no es tan significativa meh");
    }
}