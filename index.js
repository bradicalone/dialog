


class DialogVarify {
    constructor(dialog, inputAttributes) {
        this.state = { target: '', open: false, resized: false }
        this.dialog = dialog
        this.offset = dialog.getBoundingClientRect()
        this.offset.currentX = 0;
        this.offset.currentY = 0;
        this.extraPadding = 30;
        this.inputAttributes = inputAttributes
        this.inputAttributes && this.appendVarification()
    }

    getFields() {
        return {
            email: `
            <div class="Varification__email">
                <p class="Varification__title">EMAIL MUSTS:</p>
                <div class="NumSymbol">
                    <span class="Varification__moveOn"></span>
                    <p>Correct characters</p>
                </div>
            </div>
            `,
            password: `
            <div class="Varification__pwd">
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
            `
        }
    }

    appendVarification() {
        const layoutEl = this.dialog.querySelector('.Dialog__layout') 
        const vaerifyEl = document.createElement('div')
        vaerifyEl.className = 'Varification'
        vaerifyEl.innerHTML = this.inputAttributes.reduce((string, field) => string + this.getFields()[field], '')

        layoutEl.appendChild(vaerifyEl)
    }

    open(e) {
        this.target = e.target
        if (this.state.target === this.target) return
        this.moveTo(true)
    }

    close(e) {
        if (!this.state.open) return
        this.moveTo(false)
    }

    debounce(fn, wait) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(this, ...args), wait);
        };
    }

    onResize() {
        if (this.state.resized) return;

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
        this.state.resized = true
    }

    removeResize() {
        this.observer.unobserve(document.body);
    }

    getElements() {
        return {
            dialog: this.dialog,
            innerEl: this.dialog.querySelector('.Dialog__inner'),
            arrow: this.dialog.querySelector('.Dialog__arrow'),
            varifyEl: this.dialog.querySelector(`.Varification__${this.target.name}`)
        };
    }

    checkPos() {
        const dialogPos = this.dialog.getBoundingClientRect();
        const targetPos = this.target.getBoundingClientRect();
        const canFitRight = window.innerWidth - targetPos.right > dialogPos.width + this.extraPadding && targetPos.y > dialogPos.height / 2;
        const canFitLeft = targetPos.x > dialogPos.width + this.extraPadding && targetPos.y > dialogPos.height / 2;
        const canFitAbove = targetPos.y + this.extraPadding > dialogPos.height
        return { canFitRight, canFitLeft, canFitAbove, offsetX: dialogPos.x, targetPos, dialogPos }
    }

    // Update this.offset if screen changes
    updatePos() {
        const { dialog, arrow } = this.getElements();
        const { x, y, side } = this.getPos();

        dialog.style.transform = `translate(${~~x}px, ${~~y}px)`;
        arrow.className = `Dialog__arrow --${side}`
        // Update current postions of Dialog
        this.offset = this.dialog.getBoundingClientRect()
        this.offset.currentX = x
        this.offset.currentY = y
    }

    /** 
        Positions arrow 
        returns cordinates to update Dialog/modal
    **/
    getPos() {
        const { canFitRight, canFitLeft, canFitAbove, targetPos, dialogPos } = this.checkPos();

        // Starts the dialog annitial position to the left of target
        const rightX = this.offset.currentX + (targetPos.right - dialogPos.x + this.extraPadding)
        const bottomY = this.offset.currentY + (targetPos.bottom + this.extraPadding - dialogPos.y)

        let x = 0
        let y = 0
        let side = ''

        // Right side of target
        if (canFitLeft) {
            x = rightX - targetPos.width - dialogPos.width - this.extraPadding * 2;
            y = bottomY - this.extraPadding - dialogPos.height / 2 - targetPos.height / 2;
            side = 'right'
            // Left side of target
        } else if (canFitRight) {
            x = rightX;
            y = bottomY - this.extraPadding - targetPos.height / 2 - dialogPos.height / 2;
            side = 'left'
            // Bottom middle or Top middle of target
        } else {
            x = rightX - this.extraPadding - targetPos.width / 2 - dialogPos.width / 2;

            // Above target in middle
            if (canFitAbove) {
                y = bottomY - dialogPos.height - this.extraPadding - targetPos.height * 2;
                side = 'bottom'
            } else {
                y = bottomY;
                side = 'top'
            }
        }
        return { x, y, side };
    }

    static outQuart = (n) => {
        return --n * n * n + 1;
    };

    static outBack = (n) => {
        const s = 1.80158;
        return --n * n * ((s + 1) * n + s) + 1;
    };

    // Show the verification content per input
    showDetails() {
        Array.from(this.dialog.querySelectorAll('.Varification__email, .Varification__pwd')).forEach(el => {
            if (el.classList.contains(`Varification__${this.target.name}`)) {
                this.verifyElement = el
                el.style.opacity = 1
            } else {
                el.style.opacity = 0
            }
        })
    }

    moveTo(open) {
        const { dialog, innerEl, arrow, varifyEl } = this.getElements();
        const { x, y, side } = this.getPos();

        const dur = open ? 400 : 400;
        const rotateDegree = 55;
        const { canFitRight, canFitLeft, canFitAbove } = this.checkPos();
        const rotateVertical = canFitRight && canFitAbove || canFitLeft && canFitAbove ? false : true

        // If opened while already opened dont animate open again
        const hasStyle = !!dialog.style.transform && open;

        dialog.style.transition = hasStyle ? 'transform .3s cubic-bezier(0.25, 1, 0.5, 1)' : null
        dialog.style.transform = `translate(${~~x}px, ${~~y}px)`;
        arrow.className = !open ? 'Dialog__arrow' : `Dialog__arrow --${side}`
        this.showDetails()

        let start = 0;
        const animate = timestamp => {
            if (!start) start = timestamp;

            const progress = Math.min((timestamp - start) / dur, 1);
            const ease = open ? DialogVarify.outBack(progress) : DialogVarify.outQuart(progress);
            const deg = !open ? rotateDegree * ease : rotateDegree - (rotateDegree * ease);

            const rotate = !rotateVertical ? `rotateY(${deg}deg)` : `rotateX(${deg}deg)`;
            innerEl.style.transformOrigin = !rotateVertical ? 'center bottom' : 'left center';
            if (this.state.open !== open) {
                innerEl.style.transform = rotate;
                innerEl.style.opacity = open ? 1 * progress : 1 - 1 * progress;
            }
            if (progress == 1) {
                if (!open) {
                    this.inputAttributes && varifyEl.removeAttribute('style')
                    this.dialog.style.pointerEvents = 'none'
                    return this.state = { target: '', open: false, resized: false }
                }

                this.dialog.style.pointerEvents = 'auto'
                this.offset.currentX = x
                this.offset.currentY = y
                // Keeps from clicking when dialog in same open or closing state
                this.state.open = open
                this.state.target = this.target
                
                dialog.style.transition = null
                this.onResize()

            } else {
                requestAnimationFrame(animate)
            }
        };
        requestAnimationFrame(animate);
    }

    static emailPasses(email) {
        return  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
    }    


    static passesCharLength(password) {
        return password.length >= 8;
    }
    static hasCapitalLower(password) {
        return /[A-Z]/.test(password) && /[a-z]/.test(password)
    }
    static hasNumberChar(password) {
        return /[0-9]/.test(password)
    }
    static hasNumberSpecial(password) {
        return /[\"/$&+,:;=?@#0-9_|'.^*()%!-]/gi.test(password);
    }
    static isStringPassword(password) {
        return getPasswordStrength(password) === 1;
    }
    static getPasswordStrength(password) {
        /* Returns a number refering to input element index */
        const checks = [this.passesCharLength, this.hasNumberSpecial, this.hasCapitalLower];
        return checks.map((check) => check(password));
    }

    static checkEmail(email) {
        /* needs updating for other check methods */
        const checks = [this.emailPasses];
        return checks.map((check) => check(email));
    }

    /* Only used if user supplies array of input fields */
    checkValidation(e) {
        const target = e.target
        const value = e.target.value

        if (target.name == 'pwd') {
            const passingValues = DialogVarify.getPasswordStrength(value)
            this.dialog.querySelectorAll('.Varification__pwd span').forEach((passEl,i) => {
                if(passingValues[i]) {
                    return passEl.className = 'Varification__moveOn varify-active'
                } 
                passEl.className = 'Varification__moveOn'
            })
        } else if (target.name == 'email') {
            const passingValues = DialogVarify.checkEmail(value)
            this.dialog.querySelectorAll('.Varification__email span').forEach((passEl,i) => {
                if(passingValues[i]) {
                    return passEl.className = 'Varification__moveOn varify-active'
                } 
                passEl.className = 'Varification__moveOn'
            })
        }
    }
}







