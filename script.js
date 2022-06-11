


class PosDialog {
    static offset = document.querySelector('.Dialog').getBoundingClientRect()
    static resized = false
    static _target = {}
    static state = {target: '', open: false}
    constructor(target) {
        this.target = target
        this.moveTo = this.moveTo
        PosDialog.offset.currentX = 0;
        PosDialog.offset.currentY = 0;
        this.extraPadding = 30;
    }

    static getElements() {
        return {
            dialog: document.querySelector('.Dialog'),
            innerEl: document.querySelector('.Dialog__inner'),
            arrow: document.querySelector('.Dialog__arrow'),
        };
    }

    onResize() {
        if (PosDialog.resized) return;

        let { width } = document.body.getBoundingClientRect()
        const callback = (mutationsList) => {
            const pos = mutationsList[0].contentRect
            if (width != pos.width) this.debounce(() => {
                this.updatePos()
            }, 400)();
            width = pos.width
        }
        this.observer = new ResizeObserver(callback);
        this.observer.observe(document.body);
        PosDialog.resized = true
    }

    debounce(fn, wait) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(this, ...args), wait);
        };
    }

    removeResize() {
        this.observer.unobserve(document.body);
    }

    checkPos() {
        const { dialog } = PosDialog.getElements();
        const dialogPos = dialog.getBoundingClientRect();
        const targetPos = PosDialog._target.getBoundingClientRect();

        const canFitRight = window.innerWidth - targetPos.right > dialogPos.width + this.extraPadding;
        const canFitLeft = targetPos.x > dialogPos.width + this.extraPadding;
        const canFitAbove = targetPos.y + this.extraPadding > dialogPos.height 
        return { canFitRight, canFitLeft, canFitAbove, offsetX: dialogPos.x, targetPos, dialogPos }
    }

    // Update this.offset if screen changes
    updatePos() {
        const { dialog } = PosDialog.getElements();
        const { x, y } = this.getPos();
        console.log('x, y:', x, y)

        dialog.style.transform = `translate(${~~x}px, ${~~y}px)`;
        // Update current postions of Dialog
        PosDialog.offset = dialog.getBoundingClientRect()
        PosDialog.offset.currentX = x
        PosDialog.offset.currentY = y
    }

    /** 
        Positions arrow 
        returns cordinates to update Dialog/modal
    **/
    getPos() {
        const { arrow } = PosDialog.getElements();
        const { canFitRight, canFitLeft, canFitAbove, targetPos, dialogPos } = this.checkPos();

        // Starts annitially positioning Dialog to the right of target
        const rightX = PosDialog.offset.currentX  + (targetPos.right - dialogPos.x + this.extraPadding)
        const bottomY = PosDialog.offset.currentY  + (targetPos.bottom  + this.extraPadding  - dialogPos.y)

        arrow.classList.remove(arrow.classList[1])

        let x = 0
        let y = 0

        // Right side of target
        if (canFitLeft && canFitAbove) {
            console.log('canFitLeft:', canFitLeft)
            x = rightX - targetPos.width - dialogPos.width - this.extraPadding * 2;
            y = bottomY - this.extraPadding - dialogPos.height / 2 - targetPos.height / 2;
            arrow.classList.add('--right');
            // Left side of target
        } else if (canFitRight && canFitAbove) {
            console.log('canFitRight:', canFitRight)
            x = rightX;
            y = bottomY - this.extraPadding - targetPos.height / 2 - dialogPos.height / 2;
            arrow.classList.add('--left');
            // Bottom middle or Top middle of target
        } else {
            x = rightX - this.extraPadding - targetPos.width / 2 - dialogPos.width / 2;

            // Above target in middle
            if (canFitAbove) {
                console.log('canFitAbove:', canFitAbove)
                arrow.classList.add('--bottom');
                y = bottomY - dialogPos.height - this.extraPadding - targetPos.height * 2;
            } else {
                console.log('canFitbelow:')
                arrow.classList.add('--top');
                y = bottomY;
            }
        }
        return { x, y };
    }

    static outQuart = (n) => {
        return --n * n * n + 1;
    };

    static outBack = (n) => {
        const s = 1.80158;
        return --n * n * ((s + 1) * n + s) + 1;
    };

    static showDetails() {

        Array.from(document.querySelectorAll('.Varification')).forEach(el => {
            if(el.classList.contains(`Varification__${PosDialog._target.name}`)) {
                el.style.opacity = 1
            } else {
                el.style.opacity = 0
            }
        })
    }

    moveTo(open) {
        if(PosDialog.state.target ===  PosDialog._target) return
        const { dialog, innerEl } = PosDialog.getElements();
        const { x, y } = this.getPos();
 
        const dur = open ? 500 : 400;
        const rotateDegree = 55;
        const { canFitRight, canFitLeft, canFitAbove } = this.checkPos();
        const rotateVertical = canFitRight && canFitAbove || canFitLeft && canFitAbove ? false : true

        let start = 0;

        // If opened while already opened dont animate open again
        const hasStyle = !!dialog.style.transform && open;

        innerEl.style.opacity = open ? 1 : 0;
        dialog.style.transition = hasStyle ? 'transform .3s cubic-bezier(0.25, 1, 0.5, 1)' : null
        dialog.style.transform = `translate(${~~x}px, ${~~y}px)`;
        
        const animate = timestamp => {
            if (!start) start = timestamp;

            const progress = Math.min((timestamp - start) / dur, 1);
            const ease = open ? PosDialog.outBack(progress) : PosDialog.outQuart(progress);
            const deg = !open ? rotateDegree * ease : rotateDegree - (rotateDegree * ease);

            const rotate = !rotateVertical ? `rotateY(${deg}deg)` : `rotateX(${deg}deg)`;
            innerEl.style.transformOrigin = !rotateVertical ? 'center bottom' : 'left center';
            if(PosDialog.state.open !== open) innerEl.style.transform = rotate;

  
            if (progress == 1) {
                if(!open) {
                    document.querySelector(`.Varification__${PosDialog._target.name}`).removeAttribute('style')
                    return
                }
                PosDialog.showDetails()
                PosDialog.offset = document.querySelector('.Dialog').getBoundingClientRect()
                PosDialog.offset.currentX = x
                PosDialog.offset.currentY = y
                // Keeps from clicking open twice and dialog rotating back and forth
                PosDialog.state.open = open
                PosDialog.state.target = PosDialog._target
                dialog.style.transition = null
                this.onResize()
                
            } else {
                requestAnimationFrame(animate)
            }
        };
        requestAnimationFrame(animate);
        return this;
    }

    // Must be at least 8 characters and include one capital letter and one number.
    static passesCharLength(password) {
        return password.length >= 8;
    }
    static hasCapitalLetter(password) {
        return /[A-Z]/.test(password)
    }
    static hasNumberChar(password) {
        return /[0-9]/.test(password)
    }
    static hasNumberSpecial(password) {
        return /[\"/$&+,:;=?@#0-9_|'.^*()%!-]/gi.test(password);
    }
    static getPasswordStrength(password){
        
        console.log('this:', this.passesCharLength)
        /* Returns a value from 0 to 1 indicating how secure the password is */
        const checks = [this.passesCharLength, this.hasCapitalLetter, this.hasNumberChar];
        const passedChecks = checks.map((check) => check(password)).filter((val) => val).length;
        return passedChecks / checks.length;
    }

    static isStringPassword(password) {
        return getPasswordStrength(password) === 1;
    }

    checkValidation(e) {
        const target = e.target
        console.log('target:', target)
        const value = e.target.value

        if(target.id == 'pwd') {
           if(PosDialog.getPasswordStrength(value) === 1) console.log(target)
           console.log('PosDialog.getPasswordStrength(value):', PosDialog.getPasswordStrength(value))
        }
    }
}

const dialog = {
    state: {
        isOpen: false,
        children: [],
        style: {},
        dialogs: [],
        emailTitles: ['minimum 6 characters', 'contain correct characters'],
        passwordTitles: ['Minimum of 8 characters', 'Upper and lower case letters', 'At least one number or symbol'],
        current_PosDialog: {}
    },
    addListeners: function () {
        const targets = Array.from(document.querySelectorAll('input'))
        const dialogs = targets.map(target => {
            target.addEventListener('input', (e) => this.checkValidation(e))
            target.addEventListener('pointerdown', (e) => this.open(e))
            return new PosDialog(target)
        })
        document.querySelector('button').onclick = function () {
            this.close()
        }.bind(this)
        this.state.dialogs = dialogs
    },
    createChildren: function (addListeners) {
        addListeners && addListeners.bind(this)();
    },
    checkValidation: function (e) {
        this.state.current_PosDialog.checkValidation(e)
    },
    open: function (event) {
        PosDialog._target = event.target
        this.state.current_PosDialog = this.state.dialogs.filter(posDialog => posDialog.target === event.target && posDialog.moveTo(true))[0];
        this.state.isOpen = true
    },
    close: function (event) {
        // Resets state
        PosDialog.state = {open: '', target: ''}

        this.state.current_PosDialog.moveTo(false);
        this.state.isOpen = false;
    }
};
dialog.addListeners()
// dialog.createChildren(dialog.addListeners)