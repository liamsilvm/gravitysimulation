import {Point} from './Point.js'
let canvas = document.getElementById('canvas1')
let ctx = canvas.getContext('2d')
canvas.width = window.innerWidth 
canvas.height = window.innerHeight

export class Rectangle{ 
    constructor(x, y, w, h, STM, zoom){ 
        this.x = x
        this.y = y 
        this.w = w 
        this.h = h
        this.zoom = zoom
        this.STM = STM //Show Thermal Map
    }
    intersects(range){ 
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h)
    }
    contains(point){ 
        return (point.x >= this.x-this.w && point.x <= this.x + this.w && point.y >= this.y-this.h && point.y <= this.y + this.h)
    }
    draw(color){ 
        ctx.beginPath() 
        ctx.strokeStyle = color
        this.STM ? ctx.fillStyle = `rgb(${255 * (1/((this.w + this.h)/2))}), 0, 0)` : null
        ctx.rect(this.x/this.zoom, this.y/this.zoom, this.w/this.zoom, this.h/this.zoom)
        ctx.stroke()
    }
}