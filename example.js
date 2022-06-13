/* Example usage for multiple Dialogs in one file */


// dialog for each group of inputs
const dialogElement = document.querySelector('.Dialog#one')
const anotherDialogElement = document.querySelector('.Dialog#two')

// input targets
const targetsOne = Array.from(document.querySelectorAll('input.first'))
const targetsTwo = Array.from(document.querySelectorAll('input.two'))

// open dialog or check another dialog within the same dialog group
targetsOne.forEach(target => target.addEventListener('click', (e) => dialogOne.open(e)))
targetsTwo.forEach(target => target.addEventListener('click', (e) => dialogTwo.open(e)))

const dialogOne = new DialogVarify(dialogElement)
const dialogTwo = new DialogVarify(anotherDialogElement)

// close dialog
const closeBtns = Array.from(document.querySelectorAll('.close'))
closeBtns.forEach(close =>
    close.addEventListener('click', (e) => {
        if (e.target.id === 'close-one') {
            return dialogOne.close(e)
        }
        dialogTwo.close(e)
    })
);
