; (function () {
    var ts = function () {
        var ts = function (opts) {

            this._opts = opts;
            this._setting();
            this._renderHTML();
            this._bindHandler();
        };
        ts.prototype._setting = function () {
            var opts = this._opts;
            if (!opts.wrap) {
                throw new Error('wrap element can not be empty!');
            }
            //dom
            this.wrap = opts.wrap;
            this.outer = this.wrap.children[0];
            this.axis = this.isVertical ? 'Y' : 'X';
            this.reverseAxis = this.axis === 'Y' ? 'X' : 'Y';
            this.width = this.wrap.clientWidth;
            this.height = this.wrap.clientHeight;
            this.ratio = this.height / this.width;
            this.scale = opts.isVertical ? this.height : this.width;
            this.slideScale = opts.slideScale ? opts.slideScale : 2;
            this.slideBoundary = this.scale / this.slideScale;
            //function
            this.removeNode = opts.removeNode;
            // debug mode
            this.log = opts.isDebug ? function (str) {
                window.console.log(str);
            } : function () {
            };
        };
        ts.prototype._renderHTML = function () {

            this.wrap.style.overflow = "hidden";

            for (var i = 0, p; p = this.outer.children[i++];) {
                p.index = i;
            }

            //console.log(this.outer.children);
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
                    this.endHandler(evt);
                    break;
                case 'touchcancel':
                    this.endHandler(evt);
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
            if (this.fixPage) {
                evt.preventDefault();
            }
            var device = this._device();
            this.setCurNode(evt);
            this.isMoving = true;
            //this.pause();
            this.onslidestart && this.onslidestart();
            //this.log('Event: beforeslide');
            this.startTime = new Date().getTime();
            this.startX = device.hasTouch ? evt.targetTouches[0].pageX : evt.pageX;
            this.startY = device.hasTouch ? evt.targetTouches[0].pageY : evt.pageY;
            this._startHandler && this._startHandler(evt);
            this.log("start");
        };
        ts.prototype.moveHandler = function (evt) {
            if (this.isMoving) {
                var device = this._device();
                var dom = this.divNode;
                var isOpen = this.liNode.isOpen ? this.liNode.isOpen : false;

                //var dom = evt.target;
                var axis = 'X';
                var offset = {
                    X: device.hasTouch ? evt.targetTouches[0].pageX - this.startX : evt.pageX - this.startX,
                    Y: device.hasTouch ? evt.targetTouches[0].pageY - this.startY : evt.pageY - this.startY
                };

                //条件，X滑动小于0，从右向左滑动 and Y滑动小于10 and 节点处于关闭状态
                if (offset.X < 0 && offset.Y < 10 && !isOpen) {
                    var scaleOffset = this.scaleOffset(offset);
                    //if (scaleOffset.X > 0.9) {
                    //evt.preventDefault();
                    //dom.style.webkitTransformOrigin = '2% 40%';
                    //dom.style.webkitTransition = 'all 0s ease';
                    ////dom.style.webkitTransform = 'translateZ(0) translate' + axis + '(' + offset.X + 'px)';
                    //this.curScale = 'scale(' + scaleOffset.X + ',' + scaleOffset.Y + ')';
                    //dom.style.webkitTransform = 'scale(' + scaleOffset.X + ',' + scaleOffset.Y + ')';
                    this.slideToDistance(evt, 0, offset.X, 0);
                    //}
                }
                this.offset = offset;
            }
        };
        ts.prototype.endHandler = function (evt) {
            this.isMoving = false;
            var offset = this.offset;
            var axis = this.axis;
            var boundary = this.slideBoundary;
            var endTime = new Date().getTime();
            //boundary = endTime - this.startTime > 300 ? boundary : 14;
            //var res = this._endHandler ? this._endHandler(evt) : false;
            var absOffset = Math.abs(offset[axis]);
            //var absReverseOffset = Math.abs(offset[this.reverseAxis]);

            if (absOffset >= boundary && offset.X < 0 && !this.liNode.isOpen) {
                this.liNode.isOpen = true;
                this.slideToScale(evt, 0.2, 0.84, 0.84);
                //this.log("endHandler--offsetX:" + absOffset + " boundary:" + boundary + " curScale:" + this.curScale);
            } else if (absOffset < boundary || this.liNode.isOpen) {
                this.liNode.isOpen = false;
                //this.resetScale(evt);
                this.resetDistance(evt)
                //this.log("resetScale--offsetX:" + absOffset + " boundary:" + boundary)
            }
            else {
                this.log("else")
            }

            //// create tap event if offset < 10
            //if (Math.abs(this.offset.X) < 10 && Math.abs(this.offset.Y) < 10) {
            //    this.tapEvt = document.createEvent('Event');
            //    this.tapEvt.initEvent('tap', true, true);
            //    getLink(evt.target);
            //    if (!evt.target.dispatchEvent(this.tapEvt)) {
            //        evt.preventDefault();
            //    }
            //}
            this.offset.X = this.offset.Y = 0;
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
        //设置事件指向根li及内容承载div
        ts.prototype.setCurNode = function (evt) {
            this.liNode = getTopEle(evt.target, "LI");
            this.divNode = this.liNode.children[0];
        };
        //缩放到比例
        ts.prototype.slideToScale = function (evt, time, sx, sy) {
            evt.preventDefault();
            this.divNode.style.webkitTransition = 'all ' + time + 's ease';
            this.divNode.style.webkitTransform = 'scale(' + sx + ',' + sy + ')';
        };
        //滑动到距离
        ts.prototype.slideToDistance = function (evt, time, sx, sy) {
            evt.preventDefault();
            this.divNode.style.webkitTransition = 'all ' + time + 's ease';
            this.divNode.style.webkitTransform = 'translateZ(0) translateX(' + sx + 'px)';
        };
        //重置缩放比例
        ts.prototype.resetScale = function (evt) {
            this.slideToScale(evt, 0.3, 1, 1);
        };
        //重置滑动距离
        ts.prototype.resetDistance = function (evt) {
            this.slideToDistance(evt, 0.3, 0, 0);
        };
        //通过滑动距离获取缩放比例
        ts.prototype.scaleOffset = function (offset) {
            return scaleOffset = {
                X: (1 - Math.abs(offset.X / this.width)),
                Y: (1 - Math.abs(offset.X / this.width))
            };
        };
        //递归获取父级指定标签
        function getTopEle(target, nodeName) {
            if (target.parentNode.tagName != nodeName) {
                return getTopEle(target.parentNode, nodeName);
            }
            return target.parentNode;
        };


        return ts;
    }();
    window.ts = ts;
}());


