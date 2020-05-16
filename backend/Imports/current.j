void principal() {

}

void SentenciasAnidadas(){
    integer numero1 = 0;
    do {
    switch(numero1){
        case 0:
            print("caso 1\n")
            break;
        case 1:
            print("caso 2\n");
            break;
        case 2:
            print("caso 3\n")
            break;
        default:
            print("Esto se va a print 2 veces :3\n");
    }
    numero1 = numero1 + 1;
    }while(numero1 <5);
}