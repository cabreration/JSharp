Define personaje as [string nombre = "Abinadi", string frase = "To be or not to be", integer edad = 100, boolean activo = false, rival rival ]
Define rival as [string nombre = "tesla", string frase = "ni idea", integer inventos = 54 ]

void principal() {
  Personaje newton = strc Personaje()
  newton.rival = strc rival()
  newton.rival.frase = "De todas las cosas que conozco las que mas me gustan son los libros"
  print(newton)
  print('\n');
  print(newton.rival);
}