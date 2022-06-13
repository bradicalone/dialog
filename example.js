// Frist example simplest using your own logic
const dialogElement = document.querySelector('.Dialog#one')
const dialogOne = new DialogVarify(dialogElement)

const targetsOne = Array.from(document.querySelectorAll('input.first'))
targetsOne.forEach(target => {
    target.addEventListener('click', (e) => dialogOne.open(e))
    target.addEventListener('input', (e) => {
        // Your own logic...
    })
})

//  Second example using built in varification for email or password 
const anotherDialogElement = document.querySelector('.Dialog#two')
const targetsTwo = Array.from(document.querySelectorAll('input.two'))

/* 
* @param {HTMLElement} dialog element
* @param {Array} Array of string input elements you wish to use
*/
const dialogTwo = new DialogVarify(anotherDialogElement, ['email', 'password'])

targetsTwo.forEach(target => {
    target.addEventListener('click', (e) => dialogTwo.open(e))
    target.addEventListener('input', (e) => {
        // Validate your input fields
        dialogTwo.checkValidation(e)
    })
})

/* Close dialog from buttons */
const closeBtns = Array.from(document.querySelectorAll('.close-dialog'))
closeBtns.forEach(close =>
    close.addEventListener('click', (e) => {
        if (e.target.id === 'close-one') {
            return dialogOne.close(e)
        }
        dialogTwo.close(e)
    })
);









