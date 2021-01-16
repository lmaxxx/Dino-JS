window.addEventListener('scroll', noScroll)
class Dino {
    jump() {
        $("#Dino").animate({bottom: "250px"}, 400,)
        $("#Dino").animate({bottom: "0"}, 400, "linear")
    }
}
const dino = new Dino()

class Game {
    constructor() {
        this.score = 0
        this.end = false
    }

    endGame() {
        this.end = true
        document.querySelector("#row").style.removeProperty("animation")
        document.querySelector("#ground").style.removeProperty("animation")
        document.querySelector("#clouds").style.removeProperty("animation")
        
        if(localStorage.getItem("record") === false) {
            localStorage.setItem("record", this.score + '')
        }
        else if(this.score > localStorage.getItem("record")){
            localStorage.setItem("record", this.score + '')
        }

        document.querySelector("#end").style.display = "grid"
        document.querySelector("#output").innerHTML = "Your score: " + this.score
    }

    createCounter() {
        const counter = document.createElement("p")
        counter.classList = "scoreCounter"
        document.querySelector(".app").appendChild(counter)
    }

    restart() {
        document.location.reload()
    }

    async setScore() {
        let counter = document.querySelector(".scoreCounter")
        while(game.end === false) {
            await sleep(100)
            this.score++
            if(localStorage.getItem("record")) {
                if(parseInt(localStorage.getItem("record")) <=  this.score) counter.innerHTML = `New Record: ${this.score}`
                else counter.innerHTML = `Score: ${this.score} <br /> Record: ${localStorage.getItem("record")}`
            }
            else {
                counter.innerHTML = `Score: ${this.score}`
            }
        }
    }
}
const game = new Game()

class Kaktus { 
    create() {
        const customId = Math.round(Math.random() * (10000 - 1) + 1)
        const newKaktus = document.createElement("div")
        const kaktusImg = document.createElement("img")
        kaktusImg.src = "./img/kaktus.png"
        newKaktus.id = customId
        newKaktus.classList = "kaktus"
        newKaktus.appendChild(kaktusImg)
        document.querySelector(".app").appendChild(newKaktus)

    }

    move() {
        const windowWidth = document.body.offsetWidth
        const speed = windowWidth * 2.345
        $(".kaktus").animate({right: "100%"}, speed, "linear")
    }  
}
const kaktus = new Kaktus



$("#startButton").click(function(){
    initGame()
})

function initGame() {
    document.addEventListener('keydown', event => {
        if (event.code === 'Space' && document.querySelector("#Dino").style.bottom ==='0px') {
            dino.jump()
        }
    })

    $("#Dino").animate({left: "150px"}, 500)
    $("#startButton").css("display", "none")

    KaktusLifeCycle() 
    DinoAnimate()
    setTimeout(backgroundAnimate, 500)
    setTimeout(checkTouch, 1900)
    addCounter()
}

function backgroundAnimate() {
    document.querySelector("#row").style.animation = "slide 4s linear infinite"
    document.querySelector("#ground").style.animation = "slide 4s linear infinite"
    document.querySelector("#clouds").style.animation = "slide 50s linear infinite"
}

async function DinoAnimate() {
    let i = 1
    while(game.end === false) {
        await sleep(100)
        if(document.querySelector("#Dino").style.bottom != "0px") {
            $("#Dino img").attr('src', `./img/jump.png`)
        } else {
            $("#Dino img").attr('src', `./img/step${i}.png`)
            i == 2 ? i = 1 : i++
        }
    }
}

function KaktusLifeCycle() {
    SpawnKaktus()
    setInterval(deleteKaktus, 100)
}

async function SpawnKaktus() {
    while(game.end === false) {
        const randomSpawntime = Math.round(Math.random() * (1900 - 900) +  900)
        await sleep(randomSpawntime)
        kaktus.create()
        kaktus.move()
    }
}

function deleteKaktus() {
    const kaktusList = document.querySelectorAll(".kaktus")
    for(let i = 0; i < kaktusList.length; i++) {
        if(kaktusList[i].style.right === "100%") {
            document.querySelector(".app").removeChild(document.getElementById(kaktusList[i].id))
        }
    }
}
    
function addCounter() {    
    game.createCounter()    
    game.setScore()    
}

async function checkTouch() {
    const Dino = document.querySelector("#Dino")    
    while(game.end === false) {
        await sleep(1)
        const kaktus = document.querySelectorAll(".kaktus")[0]
        // ObjToObj(kaktus, Dino)
        if(ObjToObj(Dino, kaktus)) {
            game.endGame()
        }
    }
}

function ObjToObj(dino, kaktusic) {
    let kaktusStyleRight = kaktusic.style.right
    kaktusStyleRight = kaktusStyleRight.substring(0, kaktusStyleRight.length - 1);

    let dinoBottom = dino.style.bottom
    dinoBottom = dinoBottom.substring(0, kaktusStyleRight.length - 2);

    const windowWidth = window.innerWidth
    const freeSpace = windowWidth - 250
    const dangerZoneInPersent = (freeSpace / windowWidth) * 100
    dangerZoneInPersent.toFixed(2)

    const kaktusWidth = 50
    const kaktusWidthPeesent = (50 / windowWidth) * 100

    if((kaktusStyleRight >= dangerZoneInPersent && kaktusStyleRight <= dangerZoneInPersent + (kaktusWidthPeesent + 1.5))
        && (dinoBottom <= 80 || dino.style.bottom == '0px')) {
        return(true)
    }
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function noScroll() {
    window.scrollTo(0, 0)
}

function drawRecordOnMainpage() {
    if(localStorage.getItem("record")) {
        document.querySelector("#mainOutput").innerHTML = `Your record: ${localStorage.getItem("record")}`
    }
}