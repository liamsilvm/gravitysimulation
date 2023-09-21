import {Point} from './Point.js'
import {Rectangle} from './Rectangle.js'
import {QuadTree} from './QuadTree.js'
import {System} from './System.js'
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
//GRAVITY SYSTEM SETTINGS

let SS = { // System settings
    DSA: .37, // DISTANCE SIDE ACCURACY
    CPB: 2,    // COUNT PER BRANCH GLOBAL
    INP: 200, // Initial Number of Particles
    FDF: 4,    // FORCE DAMPENING FACTOR
    DQT: false,
    QTP: 20, // DISPLAY QUAD TREE
    SV: 2,     // SIZE VARIANCE
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
    PGM: 10000 // particle gun mass
};

function setCollisionDetectionDistance(){ 
    SS.CDD = SS.SV * 2
}
setCollisionDetectionDistance()
//initialize system 
let system = new System([],SS.DSA, SS.CPB, SS.FDF, SS.DQT, SS.QTP, SS.SV, SS.RC, SS.AMV, SS.MV, SS.GM, SS.CDD, SS.FP, SS.INP, SS.zoom, SS.PBS, SS.STM)
// camera movements 


// html connection 

let displayAllSettings = document.querySelector('.display-settings')
let toggleDisplaySettings = document.querySelectorAll('.nav-hide')
let navigationButtons = document.querySelectorAll('.nav-buttons')
let content = document.querySelectorAll('.content-container')
let currentScene = document.getElementById('scene-count')
let mouseEffects = document.getElementById('mouse-effects')
let showQuad = document.getElementById('show-quad-tree')
let quadModes = document.querySelectorAll('.quad-tree-mode')
let quad = document.querySelector('.quadtree')
let ParticleGunMass = document.querySelector('#particleGunMass')

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
//MOUSE EFFECTS / PARTICLE GUN 
particleGunMass.addEventListener('submit', (e) => { 
    SS.PGM = e.target.value;
})
currentScene.innerHTML = system.system.length
//initialize system
system.populate() 


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

    let particle = new Point(startCoords.x, startCoords.y,  SS.PGM, SS.SV, SS.FP, 1, SS.PBS)

    particle.speedX = particleSpeedX
    particle.speedY = particleSpeedY

    console.log(particle)
    system.system.push(particle)
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

system.generateQuadTree()
function animate(){ 

    ctx.clearRect(0,0,canvas.width, canvas.height)
    system.generateQuadTree()
    SS.RC ? system.detectCollisions() : null
    system.renderPhysics()
    // system.adjustCameraMovement('follow')
    system.quadtree.show()
    aimerActive ? aimerIsActive() : null
        requestAnimationFrame(animate);
}
animate()