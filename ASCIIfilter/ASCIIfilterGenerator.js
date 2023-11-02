export default function ASCIIfilterGenerator(width, height, emptyCharacter){ 
    let returnArray = []
    for(let i = 0; i < width; i++){ 
        returnArray.push([])
        for(let j = 0; j < height; j++){ 
            returnArray[i].push(emptyCharacter)
        }
    }   
    return returnArray
}
