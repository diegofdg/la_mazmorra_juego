var canvas;
var ctx;
var FPS = 50;

var anchoF = 50;
var altoF = 50;

var protagonista;
var enemigo=[];
var imagenAntorcha;
var tileMap;

var musica;
var sonido1, sonido2, sonido3;


musica = new Howl({
    src: ['music/fortaleza.mp3'],
    loop: true
});

sonido1 = new Howl({
    src: ['sound/fuego.wav'],
    loop: false
});

sonido2 = new Howl({
    src: ['sound/llave.wav'],
    loop: false
});

sonido3 = new Howl({
    src: ['sound/puerta.wav'],
    loop: false
});

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
]

function dibujaEscenario(){
    for(y=0;y<10;y++){
        for(x=0;x<15;x++){
            var tile = escenario[y][x];
            ctx.drawImage(tileMap,tile*32,0,32,32,anchoF*x,altoF*y,anchoF,altoF);
        }
    }
}


var antorcha = function(x,y){
    this.x = x;
    this.y = y;

    this.retraso = 10;
    this.contador = 0;
    this.fotograma = 0;

    this.cambiaFotograma = function(){
        if(this.fotograma < 3) {
            this.fotograma++;
        } else{
            this.fotograma = 0;
        }
    }

    this.dibuja = function(){
        if(this.contador < this.retraso){
            this.contador++;
        } else {
            this.contador = 0;
            this.cambiaFotograma();
        }

        ctx.drawImage(tileMap,this.fotograma*32,64,32,32,anchoF*x,altoF*y,anchoF,altoF);
    }

}

var malo = function(x,y){
    this.x = x;
    this.y = y;

    this.direccion = Math.floor(Math.random()*4);

    this.retraso = 50;
    this.fotograma = 0;


    this.dibuja = function(){
        ctx.drawImage(tileMap,0,32,32,32,this.x*anchoF,this.y*altoF,anchoF,altoF);
    }

    this.compruebaColision = function(x,y){
        var colisiona = false;

        if(escenario[y][x]==0){
          colisiona = true;
        }
        return colisiona;
    }

    this.mueve = function(){
        protagonista.colisionEnemigo(this.x, this.y);

        if(this.contador < this.retraso){
            this.contador++;
        } else{
            this.contador = 0;
         
            if(this.direccion == 0){
                if(this.compruebaColision(this.x, this.y - 1)==false){
                    this.y--;
                } else{
                    this.direccion = Math.floor(Math.random()*4);
                }
            }

            if(this.direccion == 1){
                if(this.compruebaColision(this.x, this.y + 1)==false){
                    this.y++;
                } else{
                    this.direccion = Math.floor(Math.random()*4);
                }
            }

            if(this.direccion == 2){
                if(this.compruebaColision(this.x - 1, this.y)==false){
                    this.x--;
                } else{
                    this.direccion = Math.floor(Math.random()*4);
                }
            }

            if(this.direccion == 3){
                if(this.compruebaColision(this.x + 1, this.y)==false){
                    this.x++;
                } else{
                    this.direccion = Math.floor(Math.random()*4);
                }
            }
        }

    }

}

var jugador = function(){
    this.x = 1;
    this.y = 1;

    this.color = '#820c01';
    this.llave = false;

    this.dibuja = function(){
        ctx.drawImage(tileMap,32,32,32,32,this.x*anchoF,this.y*altoF,anchoF,altoF);
    }

    this.colisionEnemigo = function(x,y){
        if(this.x == x && this.y == y){
            this.muerte();
        }
    }


    this.margenes = function(x,y){
        var colision = false;

        if(escenario[y][x]==0){
            colision = true;
        }

        return(colision);
    }

    this.arriba = function(){
        if(this.margenes(this.x, this.y-1)==false){
            this.y--;
            this.logicaObjetos();
        }
    }

    this.abajo = function(){
        if(this.margenes(this.x, this.y+1)==false){
            this.y++;
            this.logicaObjetos();
        }
    }

    this.izquierda = function(){
        if(this.margenes(this.x-1, this.y)==false){
            this.x--;
            this.logicaObjetos();
        }
    }

    this.derecha = function(){
        if(this.margenes(this.x+1, this.y)==false){
            this.x++;
            this.logicaObjetos();
        }
    }

    this.victoria = function(){
        sonido3.play();
        console.log('Has ganado!');

        this.x = 1;
        this.y = 1;

        this.llave = false;
        escenario[8][3] = 3;
    }

    this.muerte = function(){
        sonido1.play();
        console.log('Has perdido!');

        this.x = 1;
        this.y = 1;

        this.llave = false;
        escenario[8][3] = 3;
    }

    this.logicaObjetos = function(){
        var objeto = escenario[this.y][this.x];

        if(objeto == 3){
            sonido2.play();
            this.llave = true;
            escenario[this.y][this.x]=2;
            console.log('Has obtenido la llave!!');
        }

        if(objeto == 1){
            if(this.llave == true){
                this.victoria();
            } else {
                console.log('No tienes la llave, no puedes pasar!');
            }
        }
    }
}

function inicializa(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    tileMap = new Image();
    tileMap.src = 'img/tilemap.png';

    musica.play();

    protagonista = new jugador();
    imagenAntorcha = new antorcha(0,0);

    enemigo.push(new malo(3,3));
    enemigo.push(new malo(5,7));
    enemigo.push(new malo(7,7));

    document.addEventListener('keydown',function(tecla){
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
    },1000/FPS);
}

function borraCanvas(){
    canvas.width=750;
    canvas.height=500;
}


function principal(){
    borraCanvas();
    dibujaEscenario();
    imagenAntorcha.dibuja();
    protagonista.dibuja();

    for(c=0; c<enemigo.length; c++){
        enemigo[c].mueve();
        enemigo[c].dibuja();
    }
}