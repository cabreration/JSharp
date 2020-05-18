void selectionSort(integer[] arr) { 
    int n = arr.length; 
  
    for (integer i = 0; i < arr.length-1; i++) {  
        integer min_idx = i; 
        for (integer j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j; 
            }
        }
            
        integer temp = arr[min_idx]; 
        arr[min_idx] = arr[i]; 
        arr[i] = temp; 
    } 
}

void bubbleSort(integer[] arr) { 
    integer n = arr.length; 
    for (integer i = 0; i < n-1;) {
        for (integer j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) { 
                integer temp = arr[j]; 
                arr[j] = arr[j+1]; 
                arr[j+1] = temp; 
            } 
        }
        i++;
    }               
} 

void insertSort(integer[] arr) { 
    integer n = arr.length; 
    for (integer i = 1; i < n; i++) { 
        integer key = arr[i]; 
        integer j = i - 1; 
  
        while (j >= 0 && arr[j] > key) { 
            arr[j + 1] = arr[j]; 
            j = j - 1; 
        } 
        arr[j + 1] = key; 
    } 
} 

String ordenarCadena(string original) {
    var array := original.toLowerCase().toCharArray();

    integer[] reuse = strc integer[array.length];
    for (integer i = 0; i < array.length; i++) {
        reuse[i] = array[i];
    }
    print(reuse);
    bubbleSort(reuse);
    string resultado = "";
    for (integer i = 0; i < reuse.length; i++) {
        array[i] = (char)reuse[i];
    }
    for (integer i = 0; i < array.length; i++) {
        resultado = resultado + array[i];
    }
    return resultado;
}