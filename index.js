
//VARIABLES
const letrasEquivocadas = document.getElementById('letras-equivocadas');
const palabrasSecretas = ['COUNTRY','HTML','ORACLE','BUG','MOUSE','PUERTA','JAVA','RELOJ','HOLA','CABALLO','PERRO','GATO','PAJARO','CALLE','PARIS','CASA','MESA','WEST','MUSICA','SILLA','CANCION'];
var letrasIngresadas = [];
var letrasIncorrectas = [];
let palabraSecreta="";
var palabraIngresada = ["","","","","","","",""];
let intentos = 0;
let intentosMax = 9;
var letraCapturada = "";

//PARA LA MUSICA, PLAY Y STOP
window.addEventListener("load",function(){
	document.getElementById("play").addEventListener("click",sonarMusica);
	document.getElementById("stop").addEventListener("click",callarMusica);			
});

//PLAY A LA MUSICA
function sonarMusica(){
	var sonido = document.createElement("iframe");
	sonido.setAttribute("src","sound/tash-sultana-notion-espanolingles.mp3");
	document.body.appendChild(sonido);
	document.getElementById("play").removeEventListener("click",sonarMusica);
}

//STOP A LA MUSICA
function callarMusica(){
	var iframe = document.getElementsByTagName("iframe");   
	if (iframe.length > 0){
		iframe[0].parentNode.removeChild(iframe[0]);
		document.getElementById("play").addEventListener("click",sonarMusica);
	}
}



//MUESTRA EL INICIO DEL JUEGO
function inicio(){
    document.getElementById("main-juego").style.display = "none";
    document.getElementById("main-ppal").style.display = "block";
    document.getElementById("main-palabra").style.display = "none";
}

//MUESTRA LA PAGINA DEL JUEGO
function muestraJuego(){
    document.getElementById("main-juego").style.display = "block";
    document.getElementById("main-ppal").style.display = "none";
    document.getElementById("main-palabra").style.display = "none";
}

//MUESTRA LA PAGINA DE AGREGAR PALABRA
function agregarPalabra(){
    document.getElementById("main-juego").style.display = "none";
    document.getElementById("main-ppal").style.display = "none";
    document.getElementById("main-palabra").style.display = "block";
}

//COMIENZA UN NUEVO JUEGO
function nuevoJuego(){
    intentos = 0;
    limpiarDibujo();
    sortearPalabra();
    muestraJuego();
    dibujarInicio();
    ocultarPerdio();
    ocultarGano();
    ocultarPalabra();
    letraCapturada="";
    letrasIngresadas=[];
    letrasIncorrectas=[];
    palabraIngresada = ["","","","","","","",""];
    letrasEquivocadas.textContent="";
    detectarPresionada();
    dibujarLineas(palabraSecreta);
}


//GUARDA LA PALABRA INGRESADA POR EL USUARIO
function guardarPalabra(){
    let entrada = document.getElementById("ingreso").value;

    if(!controlarCantidad(entrada) && esMayusculas(entrada)){
        palabrasSecretas.push(entrada);
        nuevoJuego();
    }
    else{
        document.getElementById("advertencia").style.display = "block";
    }
}          

//SI LA PALABRA TIENE MAS DE 8 LETRAS DEVUELVE TRUE
function controlarCantidad(palabra){
    return palabra.length > 8;
}

//COMPRUEBA SI UNA CADENA SE INGRESO CON LETRAS MAYUSCULAS
function esMayusculas(palabra){
    var patron = new RegExp("^[A-Z\\s]+$");
    return patron.test(palabra);
}


//DEVUELVE UNA PALABRA SORTEADA
function sortearPalabra(){
    let indice = Math.round(Math.random()*palabrasSecretas.length);
    palabraSecreta = palabrasSecretas[indice];
}

//COMPRUEBA SI ES UNA LETRA O NO
function esLetra (caracter){
    var patron = new RegExp("^[A-Za-z]+$");
    return patron.test(caracter);
}

//COMPRUEBA SI LA CADENA CONTIENE LA LETRA INGRESADA
function esLetraCorrecta(letra){
    return palabraSecreta.indexOf(letra.toUpperCase()) !== -1;
}

//COMPRUEBA SI UNA LETRA YA FUE INGRESADA
function esRepetida(letra){
    return letrasIngresadas.indexOf(letra) !== -1;
}

//MUESTRA LA PALABRA SECRETA
function mostrarPalabra(){
    document.getElementById("cartel-palabra").style.display = "block";
    document.getElementById("palabra-perdida").innerHTML = palabraSecreta;
}

//OCULTA LA PALABRA SECRETA
function ocultarPalabra(){
    document.getElementById("cartel-palabra").style.display = "none";
}


//EVENTO QUE ESPERA A QUE CUALQUIER TECLA DEL TECLADO FISICO SEA PRESIONADA
function detectarPresionada(){
        document.addEventListener('keydown', (event) => {
            letraCapturada = event.key;
            main(letraCapturada);
        }, false);
}


//DETECTA LAS TECLAS INGRESADAS DESDE EL TECLADO VIRTUAL
function teclaDetectada(letraCapturada){
    main(letraCapturada);
}

//FUNCION PRINCIPAL DE LA APP
function main(letraCapturada){
    if(intentos<intentosMax){
        if(esLetra(letraCapturada) && !esRepetida(letraCapturada)){

            //SE AGREGA AL ARRAY LA LETRA CAPTURADA SEA O NO CORRECTA
            letrasIngresadas.push(letraCapturada);

            if(esLetraCorrecta(letraCapturada)){
                for(i = 0 ; i< palabraSecreta.length; i++){
                    if(palabraSecreta[i] == letraCapturada.toUpperCase()){
                        palabraIngresada.splice(i,1,letraCapturada.toUpperCase());
                        dibujarLetra(letraCapturada,posicionX(i),70);
                    }
                }
                //COMPRUEBA SI YA GANO
                if(palabraIngresada.join("") == palabraSecreta){
                    mostrarGano();
                } 
            }
            else{
                //SI ERRO SE SUMA UN INTENTO Y SE COMPRUEBA SI PERDIO
                intentos++;
                if(intentos == intentosMax){
                    mostrarPerdio();
                    mostrarPalabra();
                }
                //GUARDO LA LETRA CAPTURADA EN UN ARRAY
                guardarIncorrectas(letraCapturada);
                dibujar();
            }
        }
    }
    else{
        if(intentos == intentosMax){
            mostrarPerdio();
            mostrarPalabra();
        }
    }
}


//GUARDA LA LETRA INCORRECTA EN UN ARRAY Y MUESTRA LA CADENA
function guardarIncorrectas(letraCapturada){
    letrasIncorrectas.push(letraCapturada);
    letrasEquivocadas.textContent = letrasIncorrectas.join("").toUpperCase();
}

//MUESTRA EL CARTEL DE LA VERGUENZA
function mostrarPerdio(){
    document.getElementById("cartel-perdiste").style.display = "block";
}

//OCULTA EL CARTEL DE LA VERGUENZA
function ocultarPerdio(){
    document.getElementById("cartel-perdiste").style.display = "none";
}


//MUESTRA EL CARTEL GANADOR
function mostrarGano(){
    intentos = 10; //PONGO UN NUMERO QUE SOBREPASA LA CANTIDAD DE INTENTOS
    document.getElementById("cartel-ganaste").style.display = "block";
    
}

//OCULTA EL CARTEL GANADOR
function ocultarGano(){
    document.getElementById("cartel-ganaste").style.display = "none";
}


/********** FUNCIONES RELACIONADAS CON LOS DIBUJOS ********/

//LIMPIA LAS LINEAS DE LA PALABRA
function limpiarLineas(){
    let pantalla = document.getElementById("lineas");
	pantalla.width=pantalla.width;
    pantalla.height=pantalla.height
}

//LIMPIA EL DIBUJO DEL AHORCADO
function limpiarDibujo(){
    let pantalla = document.getElementById("dibujo");
	pantalla.width=pantalla.width;
    pantalla.height=pantalla.height
}

//DIBUJA LA LETRA CORRESPONDIENTE A MEDIDA QUE SE INGRESA
function dibujarLetra(letra,x,y) {
    let pantalla = document.getElementById("lineas");
    let cxt1 = pantalla.getContext("2d");
    letra = letra.toUpperCase();
    cxt1.beginPath() //iniciar ruta
    cxt1.fillStyle="#F8DB95"; //color de relleno
    cxt1.font="bold 35px arial"; //estilo de texto
    cxt1.fillText(letra,x,y); //texto con método fill
}

//DETECTA LA POSICION DE LA LETRA
function posicionX(posicion){
    x = 25;
    x = x + (posicion * 45);
    return x;
}

//DIBUJA LA CANTIDAD DE LINEAS SEGUN LA CANTIDAD DE LETRAS
function dibujarLineas(palabraSecreta){
    limpiarLineas();
    let pantalla = document.getElementById("lineas");
    let pincel = pantalla.getContext("2d");
    pincel.fillStyle = "#F8DB95";
    let x = 25;
    for(let i=0;i<palabraSecreta.length;i++){
        pincel.fillRect(x,80,30,3);
        x+=45;
    }
}

let pincel;

//PREPARA TODOS LOS ELEMENTOS PARA EMPREZA A DIBUJAR EN EL CANVAS
function prepararCanvas(){
    let pantalla = document.getElementById("dibujo");
    pincel = pantalla.getContext("2d");
 
}


function dibujarInicio(){
    prepararCanvas();
    //piso
    var piso = new Image();
    piso.onload = function() {
      pincel.drawImage(piso, 0, 450);
    };
    piso.src = 'img/ahorcado/base.png';
}

function dibujarAsta(){
    prepararCanvas();
    //asta
    var tronco = new Image();
    tronco.onload = function() {
      pincel.drawImage(tronco, 50, 225);
    };
    tronco.src = 'img/ahorcado/tronco.png';
}

function dibujarHorizontal(){
    prepararCanvas();
    //linea horizontal
    var rama = new Image();
    rama.onload = function() {
      pincel.drawImage(rama, 53, 225);
    };
    rama.src = 'img/ahorcado/rama.png';
    
}

function dibujarCuerda(){
    prepararCanvas();
    //cuerda
    var horca = new Image();
    horca.onload = function() {
      pincel.drawImage(horca, 198, 236);
    };
    horca.src = 'img/ahorcado/horca.png';

}

function dibujarCabeza(){
    prepararCanvas();
    //cabeza
    var cabeza = new Image();
    cabeza.onload = function() {
      pincel.drawImage(cabeza, 168, 288);
    };
    cabeza.src = 'img/ahorcado/cabeza.png';

}

function dibujarTorso(){
    prepararCanvas();  
    //torso
    var torso = new Image();
    torso.onload = function() {
      pincel.drawImage(torso, 198, 353);
    };
    torso.src = 'img/ahorcado/torso.png';
}

function dibujarBrazoDer(){
    prepararCanvas();
    //brazo derecho
    var brazoder = new Image();
    brazoder.onload = function() {
      pincel.drawImage(brazoder, 212, 360);
    };
    brazoder.src = 'img/ahorcado/brazoder.png';

}

function dibujarBrazoIzq(){
    prepararCanvas();  
    //brazo izquierdo
    var brazoizq = new Image();
    brazoizq.onload = function() {
      pincel.drawImage(brazoizq, 157, 360);
    };
    brazoizq.src = 'img/ahorcado/brazoizq.png';
}

function dibujarPiernaDer(){
    prepararCanvas();  
    //pierna derecha
    var piernader = new Image();
    piernader.onload = function() {
      pincel.drawImage(piernader, 205, 425);
    };
    piernader.src = 'img/ahorcado/piernader.png';
}

function dibujarPiernaIzq(){
    prepararCanvas();  
    //pierna izquierda
    var piernaizq = new Image();
    piernaizq.onload = function() {
      pincel.drawImage(piernaizq, 170, 427);
    };
    piernaizq.src = 'img/ahorcado/piernaizq.png'; 
}

//VA DIBUJANDO EL AHORCADO A MEDIDA DE LA CANTIDAD DE INTENTOS REALIZADOS
function dibujar(){
    switch (intentos) {
        case 1:
            dibujarAsta()
            break;

        case 2:
            dibujarHorizontal();
            break;

        case 3:
            dibujarCuerda();
            break;

        case 4:
            dibujarCabeza();
            break;

        case 5:
            dibujarTorso();
            break;
          
        case 6:
            dibujarBrazoDer();
            break;

        case 7:
            dibujarBrazoIzq();
            break;

        case 8:
            dibujarPiernaDer();
            break;

        case 9:
            dibujarPiernaIzq();
            break;
        default:
            break;
      }

}