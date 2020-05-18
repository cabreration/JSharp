import sorting.j

void principal() {
  integer[] array = {365, 5842, 12, 6324, 0, 851, 56, 3, 7452, 654}
  sort(array)
  print("El primer element de burbuja es: " + bubble[0])
  string nombre = "Javier"
  integer pos = 1;
  integer res = ascii(nombre, pos);
  print("El ascii de la posicion " + pos + " de " + nombre + " es " + res);
}

void sort(integer[] array) {
  print("Ordenamientos: \nBurbuja")
  global bubble := sort($array, 1);
  print(array)
  print("\n")
  print(bubble);
  print("\n")
  print("Seleccion:\n")
  var select := sort($array, 2);
  print(array)
  print("\n")
  print(select);
  print("\n")
  print("Insersion:\n")
  var insert := sort(array, 3);
  print(array)
  print("\n")
  print(insert);
  print("\n")
}

integer[] sort(integer[] array, integer option) {
  if (option == 1) {
    bubbleSort(array);
  }
  else if (option == 2) {
    selectionSort(array)
  }
  else {
    insertSort(array);
  }
  return array;
}

integer ascii(string cadena, integer indice) {
  return cadena.charAt(indice);
}