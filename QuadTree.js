import {Point} from './Point.js'
import {Rectangle} from './Rectangle.js'
let canvas = document.getElementById('canvas1')
let ctx = canvas.getContext('2d')
canvas.width = window.innerWidth 
canvas.height = window.innerHeight
window.addEventListener('resize', (e) => { 
    canvas.width = window.innerWidth 
    canvas.height = window.innerHeight
})

const initialWidth = window.innerWidth 
const initialHeight = window.innerHeight

export class QuadTree{ 
    constructor(boundary, CPB, debug, DSA, FDF, DQT, CDD, zoom, PBS, STM, offsetX, offsetY){ 

        this.DSA = DSA //Distance Side Accuracy
        this.CPB = CPB //Count Per Branch 
        this.FDF = FDF //Force Dampening Factor
        this.DQT = DQT //Display Quad Tree
        this.CDD = CDD//Collision detection distance
        this.zoom = zoom
        this.PBS = PBS //Playback Speed
        this.boundary = boundary
        this.capacity = this.CPB
        this.points = []
        this.prevPoints = [...this.points]
        this.divided = false
        debug ? this.debug = debug : this.debug = false
        this.CM = new Point(null, null, null) //Center Mass
        this.STM = STM //Show Thermal Map

        //offset 
        this.offsetX = offsetX 
        this.offsetY = offsetY
    }
    subdivide(){ 

        let x = this.boundary.x; 
        let y = this.boundary.y; 
        let w = this.boundary.w; 
        let h = this.boundary.h;

        let ne = new Rectangle(x + w/2, y - h/2, w/2, h/2, this.STM, this.zoom)
        this.northwest = new QuadTree(ne, this.capacity, false, this.DSA, this.FDF, this.DQT, this.CDD, this.zoom, this.PBS, this.STM, this.offsetX, this.offsetY)
        let nw = new Rectangle(x - w/2, y - h/2, w/2, h/2, this.STM, this.zoom)
        this.northeast = new QuadTree(nw, this.capacity, false, this.DSA, this.FDF, this.DQT, this.CDD, this.zoom, this.PBS, this.STM, this.offsetX, this.offsetY)
        let se = new Rectangle(x + w/2, y + h/2, w/2, h/2, this.STM, this.zoom)
        this.southwest = new QuadTree(se, this.capacity, false, this.DSA, this.FDF, this.DQT, this.CDD, this.zoom, this.PBS, this.STM, this.offsetX, this.offsetY)
        let sw = new Rectangle(x - w/2, y + h/2, w/2, h/2, this.STM, this.zoom)
        this.southeast = new QuadTree(sw, this.capacity, false, this.DSA, this.FDF, this.DQT, this.CDD, this.zoom, this.PBS, this.STM, this.offsetX, this.offsetY)
    }
    insertChildren(p){ 
        if(this.divided){ 
            if(this.northwest.insert(p)){ 
                return
            }else if(this.northeast.insert(p)){ 
                return
            }else if(this.southwest.insert(p)){ 
                return 
            }else{
                this.southeast.insert(p)
            }
        }
    }
    insert(point){ 
        
        if(!this.boundary.contains(point)){ 
            return false
        }else{
            if(this.CM.x == null){
                this.CM.x = point.x 
                this.CM.y = point.y
                this.CM.mass = point.mass
            }else{ 
                this.CM.x = (point.x * point.mass + this.CM.x * this.CM.mass)/(point.mass + this.CM.mass)
                this.CM.y = (point.y * point.mass + this.CM.y * this.CM.mass)/(point.mass + this.CM.mass)
                this.CM.mass += point.mass
            }

            if(this.points.length < this.capacity){ 
                this.points.push(point)
            }else{ 
                if(!this.divided){
                    this.subdivide() 
                    this.divided = true
                    this.points.forEach(p => this.insertChildren(p))
                }
                this.insertChildren(point)
            }
        return true
        }
    }
    query(range, found){ 
        if(!this.boundary.intersects(range)){ 
            return
        }else{ 
            for(let p of this.points){ 
                if(range.contains(p)){ 
                    found.push(p)
                }
            }
            if(this.divided){ 
                this.northeast.query(range, found)
                this.northwest.query(range, found)
                this.southeast.query(range, found)
                this.southwest.query(range, found)
            }
            return found
        }
    }
    show(){ 
        if(this.divided){ 
            this.northwest.show()
            this.northeast.show()
            this.southwest.show()
            this.southeast.show()
        }else{ 
            if(this.DQT){ 
                ctx.save()
                ctx.beginPath() 
                ctx.strokeStyle = 'rgba(0,0,0,0.9)'
                this.STM ? ctx.fillStyle = `rgb(${255 * (1/(this.boundary.w))}, 0, 0)` : null
                let renderX = (this.boundary.x - this.boundary.w)/this.zoom + (this.offsetX * .5)
                let renderY = (this.boundary.y - this.boundary.h)/this.zoom + (this.offsetY * .5)
                let renderW = (this.boundary.w*2)/this.zoom
                let renderH = (this.boundary.h*2)/this.zoom
                ctx.rect(renderX, renderY, renderW, renderH)
                if(!this.STM){ 
                    khin
                }
                ctx.fill()
                ctx.restore() 
            }
        }
        if(!this.DQT){ 
            this.points.forEach(point => { 

                point.draw('turquoise', 1, this.zoom, this.offsetX, this.offsetY)
            })
        }
        
    }
    resolveCollision(pointA, pointB) {
        let collisionVector = {
            x: pointB.x - pointA.x,
            y: pointB.y - pointA.y
        };
    
        let distance = Math.sqrt(collisionVector.x ** 2 + collisionVector.y ** 2);
    
        let overlap = (pointA.size + pointB.size) - distance;
    
        let collisionNormal = {
            x: collisionVector.x/distance,
            y: collisionVector.y/distance
        };
    

        let impulseMagnitude = overlap * 0.5;
    

        pointA.x -= collisionNormal.x * impulseMagnitude;
        pointA.y -= collisionNormal.y * impulseMagnitude;
        pointB.x += collisionNormal.x * impulseMagnitude;
        pointB.y += collisionNormal.y * impulseMagnitude;

        let relativeVelocity = {
            x: pointB.speedX - pointA.speedX,
            y: pointB.speedY - pointA.speedY
        };
    

        let collisionImpulse = (1 + Math.min(pointA.e, pointB.e)) * (relativeVelocity.x * collisionNormal.x + relativeVelocity.y * collisionNormal.y) / (1/pointA.mass + 1/pointB.mass);
    
     
        pointA.speedX += collisionImpulse * collisionNormal.x / pointA.mass;
        pointA.speedY += collisionImpulse * collisionNormal.y / pointA.mass;
        pointB.speedX -= collisionImpulse * collisionNormal.x / pointB.mass;
        pointB.speedY -= collisionImpulse * collisionNormal.y / pointB.mass;
    }
    detectCollision(point){ 
        let found = []
        let range = new Rectangle(point.x, point.y, this.CDD, this.CDD, this.zoom)

        this.query(range, found)
        for(let i = 0; i < found.length; i++){ 
            if(found[i].x !== point.x && found[i].y !== point.y){ 
                let distX = point.x - found[i].x
                let distY = point.y - found[i].y
                let distance = Math.sqrt(distX ** 2 + distY ** 2) - (point.size + found[i].size);

                if(distance < 0){ 

                    this.resolveCollision(point, found[i])
                }
            }
        } 
    }
    renderForce(point, accuracy){ 
        let mass_2 = this.CM.mass
        let x_2 = this.CM.x
        let y_2 = this.CM.y

        let mass_1 = point.mass 
        let x_1 = point.x 
        let y_1 = point.y

        let distancex = x_1 - x_2
        let distancey = y_1 - y_2
        let distance = Math.sqrt(distancex**2 + distancey**2)

        let SD = this.boundary.w*2/distance

        if(SD > accuracy){ 
            if(this.divided){ 
                this.northwest.renderForce(point, accuracy)
                this.northeast.renderForce(point, accuracy)
                this.southwest.renderForce(point, accuracy)
                this.southeast.renderForce(point, accuracy)
            }
        }else if(x_1 !== x_2 && y_1 !== y_2){ 

            let gConstant = 6.67
            let gForce = gConstant * mass_1 * mass_2 / distance**2 / 1000
            let accelerationx = gForce * distancex/10**this.FDF
            let accelerationy = gForce * distancey/10**this.FDF

            point.speedX += accelerationx 
            point.speedY += accelerationy
        }
    }
}
