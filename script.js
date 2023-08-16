let playBtn = document.getElementById("startGameBtn");
document.querySelector(".startGameLayout").classList.remove("none");
let startCounter = 0;
let lost = false;
let gameDone = false;
let timeOut
let ready = false;
let reastartBtns = document.querySelectorAll(".reastart");
reastartBtns.forEach(reastart=>{
    reastart.onclick = ()=>{location.reload()}
})
let reload = document.querySelector(".reload");
reload.addEventListener("click",function(){
    location.reload();
})
let horizontalMoves = 0;
const counts = Array.from(document.querySelectorAll(".count"));
let init;
let monstersArray;
let character;
// accessing the grid 
const grid = document.querySelector(".grid");
//main character 
let hero;
//let begin = false;
// creating a function to create the base of the game 
const fillGrid = function(){
for(i=0;i<170;i++){
    let div = document.createElement("div");
    div.style=`display:flex;align-items:center;justify-content:center;`
    grid.appendChild(div);
}}
// calling the function
fillGrid();
// accessing the smallest parts of the base to control the game
const spots = Array.from(document.querySelectorAll(".grid div"));
//
const smallArraySize = 17; // the size of each array === grid x coordinate
const smallArrays = [];
for (let i = 0; i < spots.length; i += smallArraySize) {
  const singleArray = spots.slice(i, i + smallArraySize);
  smallArrays.push(singleArray);
}
// characters list on the start game screen
const charectersList =Array.from(document.querySelectorAll(".hero img"));
// an event to select the character
charectersList.forEach(el=>{
    el.addEventListener("click",()=>{
        charectersList.forEach(element=>{
            element.classList.remove("grow");
        })
        el.classList.add("grow")
        hero = el.src;
    })
})
//difficulties
const difficulties =Array.from(document.querySelectorAll(".dificulties p"))
//

// this function generates 1 or 2 or 3 randomly
function randomNumber() {
    return Math.floor(Math.random() * 3) + 1;
}
// this function genrates between 2 - 6 randomly
function randomDelays() {
    return Math.floor(Math.random() * 6) + 2;
}

const initialPonit = function(init){
    spots.forEach((spot)=>{
        if(spot.hasChildNodes()){
            spot.removeChild(spot.firstElementChild);
        }
    })
        let img = document.createElement("img");
        img.src=hero;
        img.style = `
        width:60px;
        height:60px;
        `
        img.classList.add("character")
        if(spots[init].dataset.end==="end-line"){
            spots[init].append(img);
            endGame();
            return;
        }else
        spots[init].append(img);
}

class level{
    constructor(levelNumber){
        this.levelNumber = levelNumber;
        this.roadsNumber = levelNumber === 1 ? 5 : levelNumber === 2 ? 6 : levelNumber === 3 ? 7 : levelNumber === 4 ? 8 : null;
        this.roads = [];
        this.init = levelNumber === 1? 127 : levelNumber === 4? 161 : 144;
    }
    // level class method to print the roads 
    createRoads(){
        //the following variable was declared to center the roads in the window
        let n = Math.floor((smallArrays.length - this.roadsNumber)/2);
        for(let i=0;i<this.roadsNumber;i++){
            // creating road object 
            let road = new Road();
            road.type = randomNumber();
            road.abundance = this.levelNumber;
            this.roads.push(road);
        }
        for(let i=0;i<this.roads.length;i++){
            switch(this.roads[i].type){
                case 1:
                smallArrays[i+n].forEach(element => {
                    element.style="background-color:lightgreen;display:flex;align-items:center;justify-content:center;"
                })
                this.roads[i].insertMonsters(smallArrays[i+n]);
                break;
                case 2:
                smallArrays[i+n].forEach(element => {
                    element.style="background-color:gray;display:flex;align-items:center;justify-content:center;"
                })
                this.roads[i].insertMonsters(smallArrays[i+n]);
                break;
                case 3:
                smallArrays[i+n].forEach(element => {
                    element.style="background-color:rgb(245, 200, 135);display:flex;align-items:center;justify-content:center;"
                })
                this.roads[i].insertMonsters(smallArrays[i+n]);
                break;
            }
        }
        spots.forEach((el,index)=>{
            if(el.style.backgroundColor==="" && index<102){
                el.setAttribute("data-end","end-line");
            }
        })
    }
}

class Road{
    constructor(type,abundance){
        this.type = type;
        this.abundance = abundance;
        this.monstersArray =[];
    }
    insertMonsters(array){
        let monsters = this.abundance;
        for(let i =0;i<monsters;i++){
            let div = document.createElement("div");
            let img = document.createElement("img");
            
            let monster = new dangerousObjects(this.type);
            img.src = monster.src;
            img.style = monster.style;
            div.style=`
            width:${spots[0].getBoundingClientRect().width}px;
            height:${spots[0].getBoundingClientRect().height}px;
            position:absolute;
            top:${array[0].getBoundingClientRect().y}px;
            left:-100px;
            animation:moving 3s infinite linear;
            animation-delay:${randomDelays()}s;
            display:flex;
            align-items:center;
            justify-content:center;
            `;
            div.appendChild(img);
            img.classList.add("monster");
            this.monstersArray.push(div);
            document.body.append(div);
        }
    }
}

class dangerousObjects{
    constructor(type){
        this.t = type;
        this.src = this.getSrc();
        this.style = this.getStyle();
    }
    getStyle(){
        switch(this.t){
            case 1:
            return `animation: rotateAnimation 2s infinite linear;width:60px;height:60px;`
            case 2:
            return "width:60px;height:60px;";
            case 3:
            return "animation: rotateAnimation 3s infinite linear;width:60px;height:60px;";
        }
    }
    getSrc(){
        switch(this.t){
            case 1:
            return "./images/war.png";
            case 2:
            return "./images/car (1).png";
            case 3:
            return "./images/tumbleweed.png";
        }
    }
}
function level1(){
    return new level(1);
}
function level2(){
    return new level(2);
}
function level3(){
    return new level(3);
}
function level4(){
    return new level(4);
}

difficulties.forEach(difficulty=>{
    
    difficulty.addEventListener("click",function(){
        if(hero === undefined){console.log(hero)}
    else{
        difficulties.forEach(el=>{
            el.classList.remove("selected");
        })
        difficulty.classList.add("selected");
        
        difficulties.forEach(el=>{
            el.classList.remove("denied");
        })
        let level = executeLevel(difficulty.dataset.number);
        init = level.init;
        document.querySelector(".finish").classList.remove("none")
        document.querySelector(".bridge").classList.remove("none")

        initialPonit(level.init);
        monstersArray =Array.from(document.querySelectorAll(".monster"));
        character = document.querySelector(".character");

        document.addEventListener("keydown",function(e){
            if(lost || gameDone){}
            else{
                if(ready){
            if(e.key === "ArrowUp" || e.key==="w"){
                init-=17;
                initialPonit(init)
            }
            else if(e.key === "ArrowRight" || e.key==="d"){
                if(horizontalMoves===8){}
                else{
                init+=1;
                horizontalMoves++;
                initialPonit(init)
                }
            }
            else if(e.key === "ArrowLeft" || e.key==="a"){
                if(horizontalMoves===-8){}
                else{
                horizontalMoves--;
                init-=1;
                initialPonit(init)
            }
            }
        }
        }
        })
        difficulties.forEach(el=>{
            el.classList.add("denied");
        })}
    })
})
playBtn.addEventListener("click",function(){
    document.querySelectorAll(".pointer").forEach(e=>e.classList.add("none"));
    if(hero === undefined)document.querySelector(".heroPointer").classList.remove("none");
    if(monstersArray === undefined) document.querySelector(".diffPointer").classList.remove("none");
    console.log("clicked")
    if(monstersArray !== undefined && hero !== undefined){
    console.log(hero === undefined);
    console.log(monstersArray === undefined);
    document.querySelector(".startGameLayout").classList.add("none");
    timeOut = setTimeout(()=>{
    ready=true;
    },4000)
    countDown();
    }
    })
function executeLevel(parameter){
    switch(+parameter){
        case 1:
        level1().createRoads();
        return level1();
        case 2:
        level2().createRoads();
        return level2();
        case 3:
        level3().createRoads();
        return level3();
        case 4:
        level4().createRoads();
        return level4();
        default:
        console.log(new Error("Invalid level number."));
        break;
        }
}
function checkCoordinate(){
    if(monstersArray === undefined && character === undefined){}
    else{
    monstersArray.forEach(monster=>{
        let characterRect = document.querySelector(".character").parentElement.getBoundingClientRect();
        let target =  monster.parentElement.getBoundingClientRect();
        if(Math.abs(target.y - characterRect.y) <= 10 && Math.abs(target.x - characterRect.x) <= 30){
            lost = true;
            endGame();
        }
    })
}
}
let interval = setInterval(checkCoordinate,100);
function endGame(){
    gameDone = true;
    if(lost){
    document.querySelector(".gameOver").classList.remove("none")
    }else{
    let winningTimes = localStorage.getItem('winningTimes');
    winningTimes++;
    localStorage.setItem('winningTimes',winningTimes);
    document.querySelector(".score").innerText = winningTimes;
    document.querySelector(".won").classList.remove("none")
    }
    clearInterval(interval);
    clearTimeout(timeOut)
}

function countDown(){
    setTimeout(()=>{
        counts[2].classList.remove("none");
    },1000)
    setTimeout(()=>{
        counts.forEach(e=>e.classList.add("none"));
        counts[1].classList.remove("none");
    },2000)
    setTimeout(()=>{
        counts.forEach(e=>e.classList.add("none"));
        counts[0].classList.remove("none");
    },3000)
    setTimeout(()=>{
        counts.forEach(e=>e.classList.add("none"));
    },4000)
}
