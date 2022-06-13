


class DialogVarify {
    constructor(dialog) {
        this.state = { target: '', open: false, resized: false }
        this.dialog = dialog
        this.offset = dialog.getBoundingClientRect()
        this.moveTo = this.moveTo
        this.offset.currentX = 0;
        this.offset.currentY = 0;
        this.extraPadding = 30;
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
        };
    }

    checkPos() {
        const dialogPos = this.dialog.getBoundingClientRect();
        const targetPos = this.target.getBoundingClientRect();

        const canFitRight = window.innerWidth - targetPos.right > dialogPos.width + this.extraPadding;
        const canFitLeft = targetPos.x > dialogPos.width + this.extraPadding;
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
        if (canFitLeft && canFitAbove) {
            x = rightX - targetPos.width - dialogPos.width - this.extraPadding * 2;
            y = bottomY - this.extraPadding - dialogPos.height / 2 - targetPos.height / 2;
            side = 'right'
            // Left side of target
        } else if (canFitRight && canFitAbove) {
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
        Array.from(this.dialog.querySelectorAll('.Varification')).forEach(el => {
            if (el.classList.contains(`Varification__${this.target.name}`)) {
                this.verifyElement = el
                el.style.opacity = 1
            } else {
                el.style.opacity = 0
            }
        })
    }

    moveTo(open) {
        const { dialog, innerEl, arrow } = this.getElements();
        const { x, y, side } = this.getPos();

        const dur = open ? 400 : 400;
        const rotateDegree = 55;
        const { canFitRight, canFitLeft, canFitAbove } = this.checkPos();
        const rotateVertical = canFitRight && canFitAbove || canFitLeft && canFitAbove ? false : true

        // If opened while already opened dont animate open again
        const hasStyle = !!dialog.style.transform && open;

        innerEl.style.opacity = open ? 1 : 0;
        dialog.style.transition = hasStyle ? 'transform .3s cubic-bezier(0.25, 1, 0.5, 1)' : null
        dialog.style.transform = `translate(${~~x}px, ${~~y}px)`;
        arrow.className = `Dialog__arrow --${side}`

        let start = 0;
        const animate = timestamp => {
            if (!start) start = timestamp;

            const progress = Math.min((timestamp - start) / dur, 1);
            const ease = open ? DialogVarify.outBack(progress) : DialogVarify.outQuart(progress);
            const deg = !open ? rotateDegree * ease : rotateDegree - (rotateDegree * ease);

            const rotate = !rotateVertical ? `rotateY(${deg}deg)` : `rotateX(${deg}deg)`;
            innerEl.style.transformOrigin = !rotateVertical ? 'center bottom' : 'left center';
            if (this.state.open !== open) innerEl.style.transform = rotate;


            if (progress == 1) {
                if (!open) {
                    this.state = { target: '', open: false, resized: false }
                    return
                }

                this.offset.currentX = x
                this.offset.currentY = y
                // Keeps from clicking open twice and dialog rotating back and forth
                this.state.open = open
                this.state.target = this.target
                this.showDetails()
                dialog.style.transition = null
                this.onResize()

            } else {
                requestAnimationFrame(animate)
            }
        };
        requestAnimationFrame(animate);
        return this;
    }

    static emailPasses(email) {
        return  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
    }    

    // Must be at least 8 characters and include one capital letter and one number.
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
        const indexPassed = checks.map((check) => check(password)).indexOf(true);
        return indexPassed
    }

    static checkEmail(email) {
        /* needs updating for others */
        const checks = [this.emailPasses];
        return checks.map((check) => check(email)).indexOf(true);
    }

    checkValidation(e) {
        const target = e.target
        const value = e.target.value

        if (target.id == 'pwd') {
           return {index: DialogVarify.getPasswordStrength(value), verfifyElement: this.verifyElement}

        } else if (target.id == 'email') {
            return {index: DialogVarify.checkEmail(value), verfifyElement: this.verifyElement}
        }
    }
}



    

