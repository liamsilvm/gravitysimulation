// import system from './RenderScene'
let navigationButtons = document.querySelectorAll('.nav-buttons')
let content = document.querySelectorAll('.content-container')
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
    })
})


export default {settings}