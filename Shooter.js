import {System} from './System.js'
import {QuadTree} from './QuadTree.js'
import {Point} from './Point.js'
import {Rectangle} from './Rectangle.js'

let globalShotStartX = 0
let globalShotStartY = 0

let globalShotEndX = 0
let globalShotEndY = 0

function shooter(system){ 
    window.addEventListener('mousedown', (e) => {
        globalShotStartX = e.offsetX
        globalShotStartY = e.offsetY
        globalShotEndX = e.offsetX
        globalShotEndY = e.offsetY
    })
    
    window.addEventListener('mouseup', (e) => { 
        globalShotEndX = e.offsetX
        globalShotEndY = e.offsetY
        let speedX = (globalShotEndX - globalShotStartX) * 2
        let speedY = (globalShotEndY - globalShotStartY) * 2
        system.fireParticle(globalShotStartX, globalShotStartY, speedX, speedY)

        return [globalShotStartX, globalShotStartY, globalShotEndX, globalShotEndY]
    })
}

export default shooter
