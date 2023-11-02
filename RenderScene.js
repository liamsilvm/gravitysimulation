import {Point} from './Point.js'
import {Rectangle} from './Rectangle.js'
import {QuadTree} from './QuadTree.js'
import {System} from './System.js'

//filter 1
import ASCII from './ASCIIfilter/ASCIIfilter.js'
import generateASCIIArray from './ASCIIfilter/ASCIIfilterGenerator.js'

// import settingsModule from './Settings.js'
let canvas = document.getElementById('canvas1')
let ctx = canvas.getContext('2d')

canvas.width = window.innerWidth 
canvas.height = window.innerHeight
console.log(ctx)
window.addEventListener('resize', (e) => { 
    canvas.width = window.innerWidth 
    canvas.height = window.innerHeight
})

const initialWidth = window.innerWidth 
const initialHeight = window.innerHeight

//GRAVITY SYSTEM SETTINGS

let SS = { // System settings
    DSA: .36, // DISTANCE SIDE ACCURACY
    CPB: 1,    // COUNT PER BRANCH GLOBAL
    INP: 300, // Initial Number of Particles
    FDF: 4,    // FORCE DAMPENING FACTOR
    DQT: false,
    QTP: 20, // DISPLAY QUAD TREE
    SV: 10,     // SIZE VARIANCE
    AMV: true, // ALLOW MASS VARIANCE
    MV: 2000,  // MASS VARIANCE
    GM: 200,   // GLOBAL MASS
    CDD: null,    // COLLISION DETECTION DISTANCE (SV * 4)
    FP: true, //FILL PARTICLES
    RC: true, // RENDER COLLISIONS
    zoom: 1, 
    PBS: .01, //PLAYBACK SPEED 
    STM: true, //SHOW THERMAL MAP
    FP: true, // fill Particles, 
    PGM: 10000,  // particle gun mass



    cameraSpeed: 10, //camera x and y speed
    zoomSpeed: .1,//zoom speed
    MZL: 4, //mouse zoom limit

    //UI settings
    UIActive: false,

    //filters 
    ASCII: false,
    ASCIIArray: [], 
    ASCIICharacterSize: 14, //1 = 1px
    ASCIIWidth: null, 
    ASCIIHeight: null,
    ASCIIBlankCharacter: '-', 
    ASCIIActiveCharacter: 'O', 
    ASCIIBlankTextColor : 'purple', 
    ASCIIActiveTextColor : 'red'
};
//the idea here is that the width of the ASCII array adapts to the size of each pixel on teh 
//screen.. And when, when the point data is passed in, it is readjusted to this array 
//by this same character size variable, and rounded. 
SS.ASCIIWidth = canvas.width / SS.ASCIICharacterSize 
SS.ASCIIHeight = canvas.height / SS.ASCIICharacterSize
SS.ASCIIArray = generateASCIIArray(SS.ASCIIWidth, SS.ASCIIHeight, '-')
ctx.font = `${SS.ASCIICharacterSize}px Arial`




function setCollisionDetectionDistance(){ 
    SS.CDD = SS.SV * 2
}
setCollisionDetectionDistance()
//initialize system 
let system = new System([],
    SS.DSA, 
    SS.CPB, 
    SS.FDF, 
    SS.DQT, 
    SS.QTP, 
    SS.SV, 
    SS.RC, 
    SS.AMV, 
    SS.MV, 
    SS.GM, 
    SS.CDD, 
    SS.FP, 
    SS.INP, 
    SS.zoom, 
    SS.PBS, 
    SS.STM)
// camera movements 


// html connection 

let displayAllSettings = document.querySelector('.display-settings')
let toggleDisplaySettings = document.querySelectorAll('.nav-hide')
let navigationButtons = document.querySelectorAll('.nav-buttons')
let content = document.querySelectorAll('.content-container')
let currentScene = document.getElementById('scene-count')
let mouseEffects = document.getElementById('mouse-effects')
let showQuad = document.getElementById('show-quad-tree')
let showASCII = document.getElementById('show-ASCII')
let quadModes = document.querySelectorAll('.quad-tree-mode')
let quad = document.querySelector('.quadtree')
//gun settings
let ParticleGunMass = document.querySelector('#particleGunMass')


//optimization connection 

let sideDistance = document.querySelector('#distanceSideAccuracy')
let countPerBranch = document.querySelector("#countPerBranch")
let CPBout = document.querySelector("#CPBoutput")
CPBout.innerHTML = SS.CPB
// GENERAL SETTINGS 
// toggle collisions 


let allowCollisions = document.getElementById('allow_collisions')
allowCollisions.addEventListener('click', (e) => { 
    SS.RC = allowCollisions.checked
    system.RC = allowCollisions.checked
})
//new scene 

let allowMassVarianceToggle = document.getElementById('allow_mass_variance')
let massVarianceInput = document.getElementById('mass_variance')
let numParticles = document.getElementById('num_particles')
let generateScene = document.getElementById('generate_scene')
let setSizeVariance = document.getElementById('size_variance')


//NEW SCENE
//set particle count of new scene
numParticles.addEventListener('input', (e) => { 
    system.INP = e.target.value
    console.log(system.numParticles)
})

//allow mass variance toggle
allowMassVarianceToggle.addEventListener('click', (e) => { 
    system.AMV = allowMassVarianceToggle.checked
})
//set mass variance 
massVarianceInput.addEventListener('input', (e) => { 

    system.MV = e.target.value
    console.log(system.MV)
})
//add size variance 
setSizeVariance.addEventListener('input', (e) => { 
    system.SV = e.target.value
})
//generate new scene 
generateScene.addEventListener('click', (e) => { 
    system.system = []
    system.CDD = system.SV * 2
    system.populate()
})

//GENERAL
displayAllSettings.addEventListener('mouseover', (e) => { 
    console.log('user interface is currently active')
    SS.UIActive = true
    toggleDisplaySettings.forEach((nav) => { 
        nav.classList.add('active')
    })
})
navigationButtons.forEach((button) => { 
    button.addEventListener('mouseenter', (e) => { 
        content.forEach((container) => { 
            button.id == container.id ? container.classList.add('active') : container.classList.remove('active')
        })
    })
})
content.forEach(container => { 

    container.addEventListener('mouseleave', () => { 
        SS.UIActive = false

        console.log('the current state of the UI is ' + SS.UIActive)
        container.classList.remove('active')
        toggleDisplaySettings.forEach((nav) => { 
            nav.classList.remove('active')
        })
    })
})
showQuad.addEventListener('mouseover', (e) => { 
    SS.DQT = true
    SS.STM = true
    system.DQT = SS.DQT
    system.STM = SS.STM
    quadModes.forEach((mode) => { 
        mode.classList.add('active')
    })
})

quad.addEventListener('mouseleave', (e) => { 
    SS.DQT = false
    SS.STM = false
    system.DQT = SS.DQT
    system.STM = SS.STM
    quadModes.forEach((mode) => { 
        console.log(mode)
        mode.classList.remove('active')
    })
})

showASCII.addEventListener('mouseover', (e) => { 
    SS.ASCII = true
})
showASCII.addEventListener('mouseleave', (e) => { 
    SS.ASCII = false
})
//MOUSE EFFECTS / PARTICLE GUN 
particleGunMass.addEventListener('submit', (e) => { 
    SS.PGM = e.target.value;
})
currentScene.innerHTML = system.system.length

//OPTIMIZAION SETTINGS 
sideDistance.addEventListener('input', (e) => { 
    SS.DSA = e.target.value/100
    system.DSA = e.target.value/100
    console.log(system.DSA)
})
countPerBranch.addEventListener('input', (e) => { 
    system.CPB = e.target.value; 
    SS.CPB = e.target.value; 
})
//initialize system
system.populate() 

//move and zoom controls 
// Define an object to keep track of key states
const keysPressed = {};

document.addEventListener("keydown", (e) => {
  // Store the key state as true when a key is pressed
  keysPressed[e.key] = true;

  // Check for combinations of keys for diagonal movement
  if (keysPressed["w"] && keysPressed["a"]) {
    // Handle diagonal movement (e.g., move character up and left)
    system.offsetY += SS.cameraSpeed;
    system.offsetX += SS.cameraSpeed;
  } else if (keysPressed["w"] && keysPressed["d"]) {
    // Handle diagonal movement (e.g., move character up and right)
    system.offsetY += SS.cameraSpeed;
    system.offsetX -= SS.cameraSpeed;
  } else if (keysPressed["s"] && keysPressed["a"]) {
    // Handle diagonal movement (e.g., move character down and left)
    system.offsetY -= SS.cameraSpeed;
    system.offsetX += SS.cameraSpeed;
  } else if (keysPressed["s"] && keysPressed["d"]) {
    // Handle diagonal movement (e.g., move character down and right)
    system.offsetY -= SS.cameraSpeed;
    system.offsetX -= SS.cameraSpeed;
  } else {
    // Handle non-diagonal movement based on individual keys
    switch (e.key) {
      case "w":
        system.offsetY += SS.cameraSpeed;
        break;
      case "a":
        system.offsetX += SS.cameraSpeed;
        break;
      case "s":
        system.offsetY -= SS.cameraSpeed;
        break;
      case "d":
        system.offsetX -= SS.cameraSpeed;
        break;
      default:
        break;
    }
  }

  console.log(system.offsetX);
  console.log(system.offsetY);
});

document.addEventListener("keyup", (e) => {
  keysPressed[e.key] = false;
});

//scrolling for zoom 
function handleMouseScroll(event) {
    if (system.zoom < 0){ 
        system.zoom = 1
    }
    if (event.deltaY > 0 && system.zoom > 0) {

      system.zoom += SS.zoomSpeed
      console.log('sysetm zoom is ' + system.zoom)
      console.log("delta y is" + event.deltaY)
    } else if (event.deltaY < 0 && system.zoom > 0) {
        console.log('sysetm zoom is ' + system.zoom)
        console.log("delta y is" + event.deltaY)
        system.zoom -= SS.zoomSpeed
    }
  }

    document.addEventListener("wheel", handleMouseScroll);

//particle gun aiming
let aimerActive = false; 
let startCoords = {
    x: 0, 
    y: 0
}
let endCoords = { 
    x: 0, 
    y: 0
}

window.addEventListener('mousedown', (e) => { 
    //this is oging to render the line that allows you to aim
    startCoords.x = e.clientX
    startCoords.y = e.clientY
    endCoords.x = e.clientX
    endCoords.y = e.clientY
    aimerActive = true; 
})
window.addEventListener('mousemove', (e) => { 
    if(aimerActive){ 
        endCoords.x = e.clientX
        endCoords.y = e.clientY
    }
})
window.addEventListener('mouseup', (e) => {
    aimerActive = false
    let distX = endCoords.x - startCoords.x
    let distY = endCoords.y - startCoords.y

    let particleSpeedX = distX
    let particleSpeedY = distY
    let width = window.innerWidth 
    let height = window.innerHeight
    let testVariable = .75
    console.log('the current system zoom is' + system.zoom)
    console.log('the current system offsetX is ' + system.offsetX)
    console.log('the current system offsetY is ' + system.offsetY)
    console.log('the ititial x-coordinate that you clicked: ' + startCoords.x)
    console.log('the initial y-coordinate that you clicked: ' + startCoords.y)
    let particleCoords = { 
        x: (startCoords.x - system.offsetX) * system.zoom + (width - width*system.zoom),
        y: (startCoords.y - system.offsetY) * system.zoom + (height - height*system.zoom)
    };
    if(!SS.UIActive){ 
        let particle = new Point(

            particleCoords.x,  
            particleCoords.y,  
            SS.PGM, 
            SS.SV, 
            SS.FP, 
            1, 
            SS.PBS)
    
        particle.speedX = particleSpeedX
        particle.speedY = particleSpeedY
    
        system.system.push(particle)
    }
    
    endCoords.x = 0;
    endCoords.y = 0;
    startCoords.x = 0;
    startCoords.y = 0;
})

function aimerIsActive(){ 
    ctx.save()

    ctx.beginPath()

    ctx.moveTo(startCoords.x, startCoords.y)
    ctx.fillStyle = "white"
    ctx.strokeStyle = "white"
    ctx.lineTo(endCoords.x, endCoords.y)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
}
//render ASCII filter
function renderASCII(array, characterSize){ 
    let i = 0 
    let j = 0 
    let x 
    let y 
    ctx.save()
    
    array.forEach(arr => { 
        x = i * characterSize
        arr.forEach(particle => { 
            if(particle == SS.ASCIIActiveCharacter){ 
                ctx.fillStyle = SS.ASCIIActiveTextColor
            }else{ 
                ctx.fillStyle = SS.ASCIIBlankTextColor
            }
            y = j * characterSize
            ctx.fillText(particle, x, y)
            array[i][j] = SS.ASCIIBlankCharacter
            j++
           
        })

        j = 0
        i++
    })
    
    ctx.restore()
    
}
system.generateQuadTree()

function animate(){ 
    //necessities for each frame
    ctx.clearRect(0,0,canvas.width, canvas.height)
    system.generateQuadTree()
    SS.RC ? system.detectCollisions() : null
    system.renderPhysics()
    
    
    //rendering filter
    if(SS.ASCII){ 
        
        let dupe = SS.ASCIIArray.slice()
        let ASCII_Frame = ASCII(
            SS.ASCIIArray, 
            system.system, 
            SS.ASCIIActiveCharacter, 
            SS.ASCIICharacterSize, 
            system.offsetX, 
            system.offsetY)
        renderASCII(ASCII_Frame, SS.ASCIICharacterSize)  
    }else{ 
        system.quadtree.show()
    }
    
    
    
    
    // system.adjustCameraMovement('follow')
    
    aimerActive ? aimerIsActive() : null
        requestAnimationFrame(animate);
}
animate()