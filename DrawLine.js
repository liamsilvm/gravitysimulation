let globalShotStartX = 0
let globalShotStartY = 0

let globalShotEndX = 0
let globalShotEndY = 0

let lineActive = false
let showLine = false

function line(x1, y1, x2, y2, color){ 
    if(showLine == true){ 
        ctx.beginPath() 
        ctx.moveTo(globalShotStartX, globalShotStartY)
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.fill()
    }
}