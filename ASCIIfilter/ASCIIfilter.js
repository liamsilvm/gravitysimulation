export default function ASCII(ASCIIArray, particles, activeCharacter, characterSize, offsetX, offsetY){

    particles.forEach(particle => { 
        let x = Math.floor(particle.x / characterSize) 
        let y = Math.floor(particle.y / characterSize)
        x += Math.floor(offsetX / characterSize )
        y += Math.floor(offsetY / characterSize)
        console.log('offset x' + offsetX )
        console.log('offset y' + offsetY )
        if(x >= 0 && y >= 0 && x < ASCIIArray.length && y < ASCIIArray.length ){ 
            ASCIIArray[x][y] = activeCharacter
            if(particle.size > characterSize){ 
                //THIS IS TEMPORARY AND FLAWED
                ASCIIArray[x - 1][y] = activeCharacter 
                ASCIIArray[x - 1][y -1] = activeCharacter 
                ASCIIArray[x- 1][y + 1] = activeCharacter 
                ASCIIArray[x][y - 1] = activeCharacter 
                ASCIIArray[x][y + 1] = activeCharacter
                ASCIIArray[x + 1][y - 1] = activeCharacter 
                ASCIIArray[x + 1][y] = activeCharacter
                ASCIIArray[x + 1][ y + 1] = activeCharacter
            }
        }
        
    }) 
    return ASCIIArray
}


