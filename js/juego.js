var canvas;
var ctx;
var FPS = 50;
var protagonista;

var anchoF = 50;
var altoF = 50;

var muro = '#044f14';
var puerta = '#3a1700';
var tierra = '#c6892f';
var llave = '#c6bc00';

var escenario = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,2,0,0,0,2,2,2,2,0,0,2,2,0],
    [0,0,2,2,2,2,2,0,0,2,0,0,2,0,0],
    [0,0,2,0,0,0,2,2,0,2,2,2,2,0,0],
    [0,0,2,2,2,0,0,2,0,0,0,2,0,0,0],
    [0,2,2,0,0,0,0,2,0,0,0,2,0,0,0],
    [0,0,2,0,0,0,2,2,2,0,0,2,2,2,0],
    [0,2,2,2,0,0,2,0,0,0,1,0,0,2,0],
    [0,2,2,3,0,0,2,0,0,2,2,2,2,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];  
  
function dibujaEscenario(){
    var color;

    for(y=0;y<10;y++){
        for(x=0;x<15;x++){
            if(escenario[y][x]===0){
                color = muro;
            }                
            if(escenario[y][x]===1){
                color = puerta;
            }                
            if(escenario[y][x]===2){
                color = tierra;
            }
            if(escenario[y][x]===3){
                color = llave;
            }

            ctx.fillStyle = color;
            ctx.fillRect( x*anchoF, y*altoF, anchoF, altoF );
        }
    }
};

var jugador = function(){
    this.x = 1;
    this.y = 1;
    this.color = '#820c01';
    this.llave = false;

    this.dibuja = function(){
        ctx.fillStyle = this.color;
        ctx.fillRect( this.x*anchoF, this.y*altoF, anchoF, altoF );
    }

    this.margenes = function(x,y){
        var colision = false;

        if(escenario[y][x] === 0){
            colision = true;
        }

        return colision;
    }

    this.arriba = function(){
        if(this.margenes(this.x, this.y-1) === false){
            this.y--;
            this.logicaObjetos();
        }
    }

    this.abajo = function(){
        if(this.margenes(this.x, this.y+1) === false){
            this.y++;
            this.logicaObjetos();
        }
    }

    this.izquierda = function(){
        if(this.margenes(this.x-1, this.y) === false){
            this.x--;
            this.logicaObjetos();
        }
    }

    this.derecha = function(){
        if(this.margenes(this.x+1, this.y) === false){
            this.x++;
            this.logicaObjetos();
        }
    }

    this.victoria = function(){
        console.log('Has ganado el juego!!!');
        this.x = 1;
        this.y = 1;
        this.llave = false;
        escenario[8][3] = 3;
    }

    this.logicaObjetos = function(){
        var objeto = escenario[this.y][this.x];
        if(objeto === 3){
            this.llave = true;
            escenario[this.y][this.x] = 2;
            console.log('Has obtenido la llave!!!');
        }
        if(objeto === 1){
            if(this.llave === true){
                this.victoria();
            } else {
                console.log('Te falta la llave! No puedes pasar.');
            }
        }
    }
};

function inicializa(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');  
    
    protagonista = new jugador();

    document.addEventListener('keydown', function(tecla){
        if(tecla.key === 'ArrowUp'){
            protagonista.arriba();
        }
        if(tecla.key === 'ArrowDown'){
            protagonista.abajo();
        }
        if(tecla.key === 'ArrowLeft'){
            protagonista.izquierda();
        }
        if(tecla.key === 'ArrowRight'){
            protagonista.derecha();
        }
    });

    setInterval(function(){
        principal();
    }, 1000/FPS);
}

function borraCanvas(){
    canvas.width = 750;
    canvas.height = 500;
}

function principal(){
    borraCanvas();
    dibujaEscenario();
    protagonista.dibuja();    
}