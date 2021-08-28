

var websocket = new WebSocket("ws://192.168.1.9:3001");
websocket.onopen = function(){
    websocket.send(JSON.stringify({type:"sync"}))
}
websocket.onmessage = function(data){
    var mass = JSON.parse(data.data);
    console.log(mass)
    if(mass.type == "sync"){
        mass.data.forEach((el) =>{
            var cont = document.createElement("li");
            cont.innerText = `${el.name}: ${el.score}`
            document.getElementById("top-5").appendChild(cont);
        });
    }
}
document.addEventListener('DOMContentLoaded', function(e){
    
    console.log("DOMContentLoaded");
    StartGame()
    


});
function StartGame(){
    var els = [];
    var col = [];
    var size = 9;
    var score = 0;
    var grid = document.getElementById("grid");
    grid.innerHTML = ""
    document.getElementById("top-5").innerHTML = ""
    var checked = []
    for(var i = 0; i < size; i++){
        for(var b = 0; b < size; b++){
            let el = document.createElement("div");
            el.className ="lol";
            el.isMine = Math.random() < 0.3;
            el.isChecked = el.isMine;
            el.style.backgroundColor = "#6e736f";
            this.mines = ""
            el.onclick = function(e){

                
                console.log(e);
                this.isChecked = true;
                var cheked = 0
                els.forEach((el) => {
                    el.forEach((el) => {
                        if(el.isChecked){
                            cheked++;

                        }
                    });
                });
                
                var mins = 0;
                if(this.isMine){
                    this.innerHTML = "&#128163;"
                    gameOver("lose", score);
                    return null;
                }
                if(cheked == Math.pow(size, 2)){
                    gameOver("win", score);
                    return null;
                }
                for(var i = -1; i <= 1; i++){
                    for (var b = -1; b <= 1; b++){
                        if (this.row + b == -1 || this.col + i == -1 || this.row + b == 9 || this.col + i == 9) continue;
                        checked.push(els[this.row + b][this.col + i]);
                        if(els[this.row + b][this.col + i].isMine){
                            
                            mins++;
                            
                        }
                    } 
                }
                this.innerHTML = mins;
                this.mines = mins;
                score += mins;
                if(!mins){
                    checked.forEach((el) =>{
                        el.click();
                    });
                }
                checked = [];
                
                
            }
            grid.append(el);
            col.push(el);
            el.col = b;
            el.row = i;
        }
        els.push(col);
        
        col = [];
    }
    console.log(els);
}
function gameOver(result, score){
    var screen = document.createElement("div");
    var NGbtn = document.createElement("div");
    var text = document.createElement("p");
    var dscore = document.createElement("p");
    var name = document.createElement("input");


    screen.className = "gameover-screen";
    NGbtn.className = "btn";
    dscore.innerText = `Your score: ${score}`;
    name.placeholder = "Your name"
    NGbtn.onclick = function(){
        screen.remove();
        websocket.send(JSON.stringify({type:"add", data:{score:score, name:name.value}}));
        setTimeout( () => websocket.send(JSON.stringify({type:"sync"})), 1000);
        StartGame();
    }
    NGbtn.innerText = "new game"
    text.innerText = `You ${result}` 
    
    screen.appendChild(text);
    screen.appendChild(dscore);
    screen.appendChild(name);
    screen.appendChild(NGbtn);
    document.body.appendChild(screen);
    

}