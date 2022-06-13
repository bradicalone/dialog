# Dialog Verification

`dialog-verify`  Performant dialog popup that lets the users know when input fields pass tests you give to the dialog. 

## Installation Instructions
* clone or download
* run the script.js
* Or use from cdn link:
```
    <script src="https://cdn.jsdelivr.net/gh/bradicalone/dialog@latest/index.js"></script>
```


## Getting Started
### Creating the varification dialog
Creating a varification dialog is extremely simple! To create a new dialog with ..., all we need to do is create a dialog with your dialog element parameter, create the few html elements for each dialog used. After the dialog is created, we can use the methods off of it.


```html
<div class="Dialog">
    <div class="Dialog__inner">
        <div class="Dialog__layout">
            <!-- Your html elements in here -->
        </div>
        <span class="Dialog__arrow"></span>
    </div>
</div>
```

### Example using the varification dialog
```javascript
const dialogElement = document.querySelector('.Dialog')
const verification = new DialogVarify(dialogElement)
// Open dialog 
const input = document.querySelector('input')
input.addEventListener('click', (e) => verification.open(e))

//If using the html markup exampled in the html page
input.addEventListener('input', (e) => verification.checkValidation(e))

// Close dialog
const closeButton = document.querySelector('button')
closeButton.addEventListener('click', (e) => verification.close(e))
```


### Example using multiple varification dialogs in a single page with varification elements


```html
<div>
    <label for="email">Email:</label><br>
    <!-- Input are unique per Dialog -->
    <input class="first" type="text" id="email" autocomplete="off" name="email"><br>
</div>
<div>
    <label for="pwd">Password:</label><br>
    <!-- Input are unique per Dialog -->
    <input class="first" type="password" autocomplete="off" id="pwd" name="pwd">
</div>
<div>
    <label for="email">Email:</label><br>
    <!-- Input are unique per Dialog -->
    <input class="two" type="text" id="email" autocomplete="off" name="email"><br>
</div>
<div>
    <label for="pwd">Password:</label><br>
    <!-- Input are unique per Dialog -->
    <input class="two" type="password" autocomplete="off" id="pwd" name="pwd">
</div>
<div class="Dialog" id="one">
    <div class="Dialog__inner">
        <div class="Dialog__layout">
            <div class="Varification Varification__email">
                <p class="Varification__title">EMAIL MUSTS:</p>
                <div class="NumSymbol">
                    <span class="Varification__moveOn"></span>
                    <p>Correct characters</p>
                </div>
            </div>
            <div class="Varification Varification__pwd">
                <p class="Varification__title">PASSWORD MUSTS:</p>
                <div class="Minimum">
                    <span class="Varification__moveOn"></span>
                    <p>Minimum of 8 characters</p>
                </div>
                <div class="NumSymbol">
                    <span class="Varification__moveOn"></span>
                    <p>At least one number or symbol</p>
                </div>
                <div class="UpperLower">
                    <span class="Varification__moveOn"></span>
                    <p>Upper and lower case letters</p>
                </div>
            </div>
        </div>
        <span class="Dialog__arrow"></span>
    </div>
</div>
<div class="Dialog" id="two">
    <div class="Dialog__inner">
        <div class="Dialog__layout">
            <div class="Varification Varification__email">
                <p class="Varification__title">EMAIL MUSTS:</p>
                <div class="NumSymbol">
                    <span class="Varification__moveOn"></span>
                    <p>Correct characters</p>
                </div>
            </div>
            <div class="Varification Varification__pwd">
                <p class="Varification__title">PASSWORD MUSTS:</p>
                <div class="Minimum">
                    <span class="Varification__moveOn"></span>
                    <p>Minimum of 8 characters</p>
                </div>
                <div class="NumSymbol">
                    <span class="Varification__moveOn"></span>
                    <p>At least one number or symbol</p>
                </div>
                <div class="UpperLower">
                    <span class="Varification__moveOn"></span>
                    <p>Upper and lower case letters</p>
                </div>
            </div>
        </div>
        <span class="Dialog__arrow"></span>
    </div>
</div>
<div style="display: flex; gap: 1rem">
    <button class="btn close-dialog" id="close-one">Close Dialog One</button>
    <button class="btn close-dialog" id="close-two">Close Dialog Two</button>
</div>
```

```javascript
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
```