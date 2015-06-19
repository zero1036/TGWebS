; (function () {
    var ts = function () {
        var ts = function (opts) {
            this.wrap = document.getElementById('block');
            this._renderHTML();
            this._bindHandler();

        };
        ts.prototype._renderHTML = function () {
            this.outer && (this.outer.innerHTML = '');
            // initail ul element
            var outer = this.outer || document.createElement('ul');
            outer.style.cssText = 'height:' + this.height + 'px;width:' + this.width + 'px;margin:0;padding:0;list-style:none;';
            // storage li elements, only store 3 elements to reduce memory usage
            this.els = [];
            for (var i = 0; i < 3; i++) {
                var li = document.createElement('li');
                li.className = this.type === 'dom' ? 'islider-dom' : 'islider-pic';
                li.style.cssText = 'height:' + this.height + 'px;width:' + this.width + 'px;';
                //this.els.push(li);
                //// prepare style animation
                //this._animateFunc(li, this.axis, this.scale, i, 0);
                //if (this.isVertical && (this._opts.animateType === 'rotate' || this._opts.animateType === 'flip')) {
                //    this._renderItem(li, 1 - i + this.slideIndex);
                //} else {
                //    this._renderItem(li, i - 1 + this.slideIndex);
                //}
                li.innerHTML = "Tgor";
                outer.appendChild(li);
            }
            //this._initLoadImg();
            // append ul to div#canvas
            if (!this.outer) {
                this.outer = outer;
                this.wrap.appendChild(outer);
            }
        };
        ts.prototype._bindHandler = function () {
            var outer = this.outer;
            var device = this._device();
            if (!device.hasTouch) {
                outer.style.cursor = 'pointer';
                outer.ondragstart = function (evt) {
                    if (evt) {
                        return false;
                    }
                    return true;
                };
            }
            outer.addEventListener(device.startEvt, this);
            outer.addEventListener(device.moveEvt, this);
            outer.addEventListener(device.endEvt, this);
            window.addEventListener('orientationchange', this);
        };
        ts.prototype.handleEvent = function (evt) {
            var device = this._device();
            switch (evt.type) {
                case device.startEvt:
                    this.startHandler(evt);
                    break;
                case device.moveEvt:
                    this.moveHandler(evt);
                    break;
                case device.endEvt:
                    //this.endHandler(evt);
                    break;
                case 'touchcancel':
                    //this.endHandler(evt);
                    break;
                case 'orientationchange':
                    //this.orientationchangeHandler();
                    break;
                case 'focus':
                    //this.isAutoplay && this.play();
                    break;
                case 'blur':
                    //this.pause();
                    break;
            }
        };
        ts.prototype.startHandler = function (evt) {
            //if (this.fixPage) {
            //    evt.preventDefault();
            //}
            var device = this._device();
            this.isMoving = true;
            //this.pause();
            this.onslidestart && this.onslidestart();
            this.log('Event: beforeslide');
            this.startTime = new Date().getTime();
            this.startX = device.hasTouch ? evt.targetTouches[0].pageX : evt.pageX;
            this.startY = device.hasTouch ? evt.targetTouches[0].pageY : evt.pageY;
            this._startHandler && this._startHandler(evt);
            console.log("start");
        };

        iSlider.prototype.moveHandler = function (evt) {
            if (this.isMoving) {
                var device = this._device();
                var len = this.data.length;
                var axis = this.axis;
                var reverseAxis = this.reverseAxis;
                var offset = {
                    X: device.hasTouch ? evt.targetTouches[0].pageX - this.startX : evt.pageX - this.startX,
                    Y: device.hasTouch ? evt.targetTouches[0].pageY - this.startY : evt.pageY - this.startY
                };
                var res = this._moveHandler ? this._moveHandler(evt) : false;
                if (!res && Math.abs(offset[axis]) - Math.abs(offset[reverseAxis]) > 10) {
                    evt.preventDefault();
                    this.onslide && this.onslide(offset[axis]);
                    this.log('Event: onslide');
                    if (!this.isLooping) {
                        if (offset[axis] > 0 && this.slideIndex === 0 || offset[axis] < 0 && this.slideIndex === len - 1) {
                            offset[axis] = this._damping(offset[axis]);
                        }
                    }
                    for (var i = 0; i < 3; i++) {
                        var item = this.els[i];
                        item.style.webkitTransition = 'all 0s';
                        this._animateFunc(item, axis, this.scale, i, offset[axis]);
                    }
                }
                this.offset = offset;
            }
        };

        ts.prototype._device = function () {
            var hasTouch = !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);
            var startEvt = hasTouch ? 'touchstart' : 'mousedown';
            var moveEvt = hasTouch ? 'touchmove' : 'mousemove';
            var endEvt = hasTouch ? 'touchend' : 'mouseup';
            return {
                hasTouch: hasTouch,
                startEvt: startEvt,
                moveEvt: moveEvt,
                endEvt: endEvt
            };
        };

        return ts;
    }();
    window.ts = ts;
}());


