/* Example usage for multiple Dialogs in one file */

const dialogElement = document.querySelector('.Dialog#one')
const anotherDialogElement = document.querySelector('.Dialog#two')

const dialogOne = new DialogVarify(dialogElement)
const dialogTwo = new DialogVarify(anotherDialogElement)

const targetsOne = Array.from(document.querySelectorAll('input.first'))
const targetsTwo = Array.from(document.querySelectorAll('input.two'))

targetsOne.forEach(target => {
    target.addEventListener('click', (e) => dialogOne.open(e))
    target.addEventListener('input', (e) => {
        // Index of password or email check element
        const {index, verfifyElement} = dialogOne.checkValidation(e)
        if(index !== -1) {
            console.log(verfifyElement.querySelectorAll('span')[index].classList.add('varify-active'))
        }
    })
})

targetsTwo.forEach(target => {
    target.addEventListener('click', (e) => dialogTwo.open(e)),
    target.addEventListener('input', (e) => {
        // Index of password or email check element
        const {index, verfifyElement} = dialogTwo.checkValidation(e)
        if(index !== -1) {
            console.log(verfifyElement.querySelectorAll('span')[index].classList.add('varify-active'))
        }
    })
})


const closeBtns = Array.from(document.querySelectorAll('.close-dialog'))
closeBtns.forEach(close =>
    close.addEventListener('click', (e) => {
        if (e.target.id === 'close-one') {
            return dialogOne.close(e)
        }
        dialogTwo.close(e)
    })
);









