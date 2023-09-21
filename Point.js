
let canvas = document.getElementById('canvas1')
let ctx = canvas.getContext('2d')
canvas.width = window.innerWidth 
canvas.height = window.innerHeight
export class Point{ 
    constructor(x, y, mass, size, fill, zoom, PBS){ 
        //CAMERA SETTINGS
        this.zoom = zoom
        this.PBS = PBS
        this.x = x
        this.y = y
        fill ? this.fill = fill : this.fill = false
        this.mass = mass
        this.speedX = 0
        this.speedY = 0 
        this.size = size / this.zoom
        this.e = Math.random() //elasticity of particle
        this.red = Math.random() * 250 
        this.green = Math.random() * 250 
        this.blue = Math.random() * 250  
    }
    update(offsetX, offsetY, zoom){ 
        this.zoom = zoom 
        this.x -= (this.speedX * this.PBS + offsetX)
        this.y -= (this.speedY * this.PBS + offsetY)

        // if(
        //     this.x + this.size/2> canvas.width ||
        //     this.x - this.size/2< 0 
        // ){this.speedX *= -1}
        // if(
        //     this.y + this.size/2> canvas.height || 
        //     this.y - this.size/2< 0
        // ){this.speedY *= -1}
    }
    draw(color, size){ 
        ctx.beginPath() 
        ctx.save()
        // ctx.fillStyle   = `rgba(${this.red},${this.green},${this.blue}, 0.5)`
        // ctx.strokeStyle = `rgba(${this.red},${this.green},${this.blue}, 0.5)`
        ctx.fillStyle = 'yellow'
        ctx.strokeStyle = 'yellow'
        ctx.arc(this.x/this.zoom, this.y/this.zoom, this.size/this.zoom, 0, Math.PI * 2)
        this.fill ? ctx.fill() : ctx.stroke()
        ctx.restore()
    }
}

