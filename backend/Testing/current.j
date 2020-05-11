void principal() {
    funcionSwitch()
}

void funcionSwitch() {
    int a = 8;
    switch(a) {
        case 6:
            print("aqui no es - 6");
            break;
        case 7:
            print("aqui tampoco es - 7")
            break
        case 8:
            print("aqui si es - 8");
            break;
        default:
            print("aqui menos es - default");
    }

    string b = "javs" 
    switch (b) {
        case "javs":
        case "javier":
            print("i can, i will, i must");
            break;
        case "josue":
            print("he can, he will, he must");
            break;
    }

    string c = "geperipigoponsapa";
    switch(c) {
        case "gep":
            print("aqui no era");
            break;
        case "perior":
            print("aqui tampoco es");
        default:
            print("aqui si es");
    }
}