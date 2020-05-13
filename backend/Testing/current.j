void principal() {
    integer edad = 20;
    if (a > 18) {
        print("Felicidades puedes unirte al ejercito\n");
        if (a < 21){
            print("Pero no puedes comprar cigarrillos :( \n");
        }
        else {
            print("Y ademas puedes embriagarte \n");
        }
    }

    integer num = 155145;
    integer contador = 0;
    do {
        contador++;
        num = num / 10;
    }
    while (num != 0);
    print("El numero tiene "+contador+" digitos.\n");

    integer a = 0;
    integer b = 1;
    integer c = 0;  
    integer len = 7;
    print(a + " " + b);
    for (integer i = 2; i < len; i++)  
    {  
        c = a + b;  
        print(" " + c);
        a= b;  
        b= c;  
    }

    contarConWhile(20);

    string nombre = "Javier"
    switch(nombre) {
        case "Diego":
            print("***\n");
            break;
        case "Cesar":
            print("***\n");
            break;
        case "Javier":
            print("Wuuuuuu\n");
            break;
        default:
            print("...\n");
    }
}

void contarConWhile(integer meta){
    while(meta > 0){
        print(meta);
        meta--;
    }
}