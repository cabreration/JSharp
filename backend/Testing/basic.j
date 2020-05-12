void principal() {
    polimorphism("Javier");
    polimorphism(24, 1.8);
}

void polimorphism(string name) {
    print("Your name is " + name + "\n");
}

void polimorphism(int edad, double estatura) {
    print("You're " + edad + " and " + estatura + " mts tall");
}