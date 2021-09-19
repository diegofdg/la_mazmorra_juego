var canvas;
var ctx;
var FPS = 50;
var protagonista;
var enemigo = [];
var tileMap;

var anchoF = 50;
var altoF = 50;

var anchoEscenario = 25;
var altoEscenario = 10;

var muro = '#044f14';
var puerta = '#3a1700';
var tierra = '#c6892f';
var llave = '#c6bc00';

var camara;
var camara2;

var escenario = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,2,0,0,0,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
  [0,0,2,2,2,2,2,2,0,2,0,0,2,2,0,0,0,2,0,0,2,0,0,0,0],
  [0,0,2,0,0,2,2,2,0,2,2,2,2,2,0,0,0,0,0,0,2,2,2,0,0],
  [0,0,2,2,2,0,2,2,0,0,2,2,2,0,0,0,2,2,2,2,2,0,2,0,0],
  [0,2,2,0,0,0,0,2,0,0,0,2,0,0,0,0,2,0,0,2,0,0,2,0,0],
  [0,0,2,0,0,0,2,2,2,0,0,2,2,2,0,0,2,0,0,0,0,0,2,0,0],
  [0,2,2,2,0,0,2,0,0,2,2,2,2,2,2,2,2,0,0,2,2,0,2,0,0],
  [0,2,2,3,0,0,2,0,0,1,2,2,2,2,0,0,0,0,2,2,2,2,2,0,0],
  [0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0],
  [0,2,2,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0],
  [0,2,0,2,2,2,0,0,0,0,0,2,2,2,2,0,0,0,0,0,2,2,2,0,0],
  [0,2,0,2,2,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,2,2,0,0],
  [0,2,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2,0,0,0],
  [0,2,0,0,0,2,0,0,0,0,0,2,0,0,2,2,0,0,2,0,0,2,0,0,0],
  [0,2,2,2,0,2,0,0,0,0,0,2,0,0,2,2,0,0,2,0,0,2,0,0,0],
  [0,2,0,2,0,0,0,0,0,0,0,2,0,0,2,2,0,0,2,0,0,2,0,0,0],
  [0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,2,2,2,2,0,0,2,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var objCamara = function(x=0,y=0,tamX,tamY,posX,posY){
    this.x = x;
    this.y = y;

    this.tamX = tamX;
    this.tamY = tamY;

    this.posX = posX;
    this.posY = posY;

    this.dibuja = function(){
        for(y=this.y;y<(this.tamY + this.y);y++){
            for(x=this.x;x<(this.tamX + this.x);x++){
                var tile = escenario[y][x];
                ctx.drawImage(tileMap,tile*32,0,32,32,anchoF*(x-this.x+this.posX),altoF*(y-this.y+this.posY),anchoF,altoF);
            }
        }
    }

    this.arriba = function(){
        if(this.y > 0){
            this.y--;
        }
      }
    
    this.abajo = function(){    
        if(this.y < altoEscenario - this.tamY){
            this.y++;
        }
    }
    
    this.derecha = function(){
        if(this.x < anchoEscenario - this.tamX){
            this.x++;
        }
    }
    
    this.izquierda = function(){
        if(this.x > 0){
            this.x--;
        }
    }
} 
  
/* function dibujaEscenario(){
    for(y=0;y<altoEscenario;y++){
        for(x=0;x<anchoEscenario;x++){
            //console.log('y',y,'x',x)
            var tile = escenario[y][x];
            ctx.drawImage(tileMap,tile*32,0,32,32,anchoF*x,altoF*y,anchoF,altoF);
        }
    }
}; */

var antorcha = function(x,y){
    this.x = x;
    this.y = y;
  
    this.retraso = 10;
    this.contador = 0;
    this.fotograma = 0;  
  
    this.cambiaFotograma = function(){
        if(this.fotograma < 3) {
            this.fotograma++;
        }
        else{
            this.fotograma = 0;
        }  
    }  
  
    this.dibuja = function(){  
        if(this.contador < this.retraso){
            this.contador++;
        }
        else{
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
        ctx.drawImage(tileMap,0,32,32,32,this.x*anchoF, this.y*altoF, anchoF, altoF);
    }    

    this.compruebaColision = function(x,y){
        var colisiona = false;

        if(escenario[y][x] === 0){
            colisiona = true;
        }
        return colisiona;
    }

    this.mueve = function(){
        protagonista.colisionEnemigo(this.x, this.y);

        if(this.contador < this.retraso){
            this.contador++;
          }    
          else{
            this.contador = 0;

            if(this.direccion === 0){
                if(this.compruebaColision(this.x, this.y-1) === false){
                    this.y--;
                } else {
                    this.direccion = Math.floor(Math.random()*4);
                }
            }

            if(this.direccion === 1){
                if(this.compruebaColision(this.x, this.y+1) === false){
                    this.y++;
                } else {
                    this.direccion = Math.floor(Math.random()*4);
                }
            }

            if(this.direccion === 2){
                if(this.compruebaColision(this.x-1, this.y) === false){
                    this.x--;
                } else {
                    this.direccion = Math.floor(Math.random()*4);
                }
            }

            if(this.direccion === 3){
                if(this.compruebaColision(this.x+1, this.y) === false){
                    this.x++;
                } else {
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
        ctx.drawImage(tileMap,32,32,32,32,this.x*anchoF, this.y*altoF, anchoF, altoF);
    }

    this.colisionEnemigo = function(x,y){
        if(this.x == x && this.y == y){
            this.muerte();
        }
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
        this.x = 1;
        this.y = 1;
        this.llave = false;
        escenario[8][3] = 3;
        console.log('Has ganado el juego!!!');
    }

    this.muerte = function(){        
        this.x = 1;
        this.y = 1;
        this.llave = false;
        escenario[8][3] = 3;
        console.log('Has perdido el juego!!!');
    }

    this.logicaObjetos = function(){
        var objeto = escenario[this.y][this.x];
        if(objeto === 3){
            this.llave = true;
            escenario[this.y][this.x] = 2;
            console.log('Has obtenido la llave!');
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

    tileMap = new Image();
    tileMap.src = 'img/tilemap.png';

    camara = new objCamara(2,2,5,5,1,1);
    camara2 = new objCamara(3,4,4,6,8,2);

    protagonista = new jugador();
    
    imagenAntorcha = new antorcha(0,0);

    enemigo.push(new malo(3,3));
    enemigo.push(new malo(5,7));
    enemigo.push(new malo(7,7));

    document.addEventListener('keydown', function(tecla){
        if(tecla.key === 'ArrowUp'){
            //protagonista.arriba();
            camara.arriba();
            camara2.arriba();
        }
        if(tecla.key === 'ArrowDown'){
            //protagonista.abajo();
            camara.abajo();
            camara2.abajo();
        }
        if(tecla.key === 'ArrowLeft'){
            //protagonista.izquierda();
            camara.izquierda();
            camara2.izquierda();
        }
        if(tecla.key === 'ArrowRight'){
            //protagonista.derecha();
            camara.derecha();
            camara2.derecha();
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
    camara.dibuja();
    camara2.dibuja();
    //dibujaEscenario();
    //imagenAntorcha.dibuja();
    //protagonista.dibuja();    

    for(c=0; c<enemigo.length;c++){
        //enemigo[c].mueve();
        //enemigo[c].dibuja();
    }
}