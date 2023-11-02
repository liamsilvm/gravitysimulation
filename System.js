import {QuadTree} from './QuadTree.js'
import {Point} from './Point.js'
import {Rectangle} from './Rectangle.js'


let ctx = document.getElementById('canvas1')
let canvas = ctx.getContext
canvas.width = window.innerWidth 
canvas.height = window.innerHeight

const initialWidth = window.innerWidth 
const initialheight = window.innerHeight
window.addEventListener('resize', (e) => { 
    canvas.width = window.innerWidth 
    canvas.height = window.innerHeight
})


//settings inputs 

export class System{ 
    constructor(system, DSA, CPB, FDF, 
        DQT, QTP, SV, RC, 
        AMV, MV, GM, CDD, FP, INP, 
        zoom, PBS, STM){

        //QUADTREE VARIABLES 
        this.DSA = DSA //DISTANCE SIDE ACCURACY
        this.CPB = CPB //COUNT PER BRANCH
        this.QTP = QTP //QUADTREE PADDING
        this.DQT = DQT //DISPLAY QUAD TREE
        //SYSTEM SETTINGS 
        system ? this.system = system : this.system = []//add specific system or empty array
        this.FDF = FDF//FORCE DAMPENING FACTOR
        this.SV = SV//SIZEVARIANCE
        //PHYSICS
        this.RC = RC//RENDER COLLISIONS
        this.AMV = AMV //ALLOW MASS VARIANCE
        this.MV = MV //MASS VARIANCE 
        this.GM = GM //GLOBAL MASS 
        this.CDD = CDD //COllISION DETECTION DISTANCE
        //OBJECTS SETTINGS 
        this.FP = FP // FILL PARTICLES 
        this.INP = INP //INITIAL NUMBER OF PARTICLES 
        this.zoom = zoom
        this.PBS = PBS//playbackSpeed

        this.STM = STM //SHOW THERMAL MAP 
        this.cameraAccelerationX = 0
        this.cameraAccelerationY = 0

        this.offsetX = 0; 
        this.offsetY = 0; 

    }
    populate(){ 
        let x; let y;
        let mass
        this.AMV ?  mass = this.MV * Math.random() : mass = this.GM
        // mass = 500
        let angle = 0
        let increment = Math.PI * 2 / this.INP
        let radius = 200
        for(let i = 0; i < this.INP; i++){ 

            x = radius * Math.cos(angle) + canvas.width/2
            y = radius * Math.sin(angle) + canvas.height/2
            // x = Math.random() * canvas.width 
            // y = Math.random() * canvas.height
            
            let curPoint = new Point(x, y, mass, Math.random() * this.SV, this.FP, this.zoom,this.PBS)


            this.system.push(curPoint)
            angle += increment

            
        }
        this.prevSystem = [...this.system]
    }
    generateQuadTree(){ 


        let minX = this.system[0].x; let maxX = 0; 
        let minY = this.system[0].y; let maxY = 0; 



        for(let i = 0; i < this.system.length; i++){ 
            this.system[i].x < minX ? minX = this.system[i].x : null 
            this.system[i].x > maxX ? maxX = this.system[i].x : null 
            this.system[i].y < minY ? minY = this.system[i].y : null 
            this.system[i].y > maxY ? maxY = this.system[i].y : null 
        }
        this.minX = minX; this.minY = minY; this.maxX = maxX; this.maxY = maxY
        let newW = (maxX - minX) 
        let newH = (maxY - minY)
        let boundary = new Rectangle(minX + newW/2, minY + newH/2 , newW/2, newH/2, this.STM, this.zoom)
        this.quadtree = new QuadTree(boundary, this.CPB, true, this.DSA, this.FDF, this.DQT, this.CDD,this.zoom,this.PBS,this.STM, this.offsetX, this.offsetY)

        this.system.forEach(particle => { 
            this.quadtree.insert(particle)
        })
    }
    renderPhysics(){ 
        let offsetX = this.cameraAccelerationX; 
        let offsetY = this.cameraAccelerationY; 
        let zoom = this.zoom; 

        this.system.forEach(body => { 
            this.quadtree.renderForce(body, this.DSA)//particle, accuracy
        })
        this.system.forEach(body => { 
            body.update(offsetX, offsetY, zoom)
        })
    }
    detectCollisions(){ 
        this.system.forEach(point => { 
            this.quadtree.detectCollision(point)
        })
    }
    fireParticle(x, y, xSpeed, ySpeed){ 
        x = canvas.width - x * this.zoom + 2 * this.zoom
        y = canvas.height - y * this.zoom + 2 * this.zoom
        let particle = new Point(x, y, 2000,Math.random() * this.SV,this.FP,this.zoom,this.PBS)
        particle.speedX = xSpeed
        particle.speedY = ySpeed
        particle.color = 'red'
        this.system.push(particle)
    }
    adjustCameraMovement(mode){ 
        if(mode.toLowerCase() == "follow"){ 
            this.minX < 0 ? this.cameraAccelerationX -= .01 : null 
            this.maxX > canvas.width ? this.cameraAccelerationX += .01 : null 
            this.minY < 0 ? this.cameraAccelerationY -= .01 : null 
            this.maxY > canvas.height ? this.cameraAccelerationY += .01 : null 
            
            console.log('camera acceleration', this.cameraAccelerationX, this.cameraAccelerationY)
        }else if(mode.toLowerCase() == "fixed"){ 

        }else if(mode.toLowerCase() == "fixed_follow"){ 

        }
    }
}
