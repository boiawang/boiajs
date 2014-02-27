var Boia = {};


// =Global method
(function(B) {
    'use strict';

    B.each = Array.prototype.forEach;

    B.one = function(selector) {

        var node = null,
            d = document;

        node = d.querySelector(selector);

        return node;
    };

    B.all = function(selector) {

        var nodeList = null,
            d = document;

        nodeList = d.querySelectorAll(selector);

        return nodeList;
    };

    B.on = function(type, fn, selector) {
        B.one(selector).addEventListener(type, fn);
    };


    /**
     * [getViewport 获得视口宽高]
     * @return {[Object]} [包含高宽的对象]
     */
    B.getViewport = function() {

        var width, height;
        
        if (d.compatMode === 'BackCompat'){
            width = d.body.clientWidth;
            height = d.body.clientHeight;
        }else {
            width = d.documentElement.clientWidth;
            height = d.documentElement.clientHeight;
        }

        return {
            width: width,
            height: height
        }
    }; 

})(Boia);

// =node
(function(B) {
    'use strict';

    var d = document;

    HTMLElement.prototype.one = function(selector) {

        var node = null;

        node = this.querySelector(selector);

        return node;
    };

    HTMLElement.prototype.all = function(selector) {

        var nodeList = null;

        nodeList = this.querySelectorAll(selector);

        return nodeList;
    };

    HTMLElement.prototype.hasClass = function(cName) {

        return !!this.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
    };

    HTMLElement.prototype.addClass = function(cName) {

        if (!this.hasClass(cName)) {
            this.className += " " + cName;
        };

        return this;
    };

    HTMLElement.prototype.removeClass = function(cName) {

        if (this.hasClass(cName)) {

            this.className = this.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
        };

        return this;
    };

    HTMLElement.prototype.replaceClass = function() {

        return this;
    };

    HTMLElement.prototype.on = function(type, fn) {

        this.addEventListener(type, fn);

        return this;
    };

    /*1. clientHeight和clientWidth用于描述元素内尺寸，
        是指 元素内容+内边距 大小，
        不包括边框（IE下实际包括）、外边距、滚动条部分
    2. offsetHeight和offsetWidth用于描述元素外尺寸，
        是指 元素内容+内边距+边框，不包括外边距和滚动条部分
    3. clientTop和clientLeft返回内边距的边缘和边框的外边缘之间的水平和垂直距离，
        也就是左，上边框宽度
    4. offsetTop和offsetLeft表示该元素的左上角（边框外边缘）
        与已定位的父容器（offsetParent对象）左上角的距离
    5. offsetParent对象是指元素最近的定位（relative,absolute）祖先元素，
        递归上溯，如果没有祖先元素是定位的话，会返回null*/
    HTMLElement.prototype.width = function() {

        var width = 0;

        width = this.offsetWidth;

        return width;
    };         

    /**
     * [getX 获得元素x坐标]
     * @return {[number]} [x坐标]
     */
    HTMLElement.prototype.getX = function() {

        var actualLeft = this.offsetLeft,
            current = this.offsetParent;

        while(current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }

        return actualLeft;
    };    


    /**
     * [getY 获得元素y坐标]
     * @return {[number]} [y坐标]
     */
    HTMLElement.prototype.getY = function() {

        var actualTop = this.offsetTop,
            current = this.offsetParent;

        while(current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }

        return actualTop;
    };          

})(Boia);

// =NodeList
(function(B) {
    'use strict';

    /**
     * [removeAllClass 给nodelist删除类名]
     * @param  {[string]} cName [类名]
     * @return {[NodeList]}      
     */
    NodeList.prototype.removeAllClass = function(cName) {

        B.each.call(this, function(element) {
            element.removeClass(cName);
        });

        return this;
    };

    /**
     * [addAllClass 给nodelist加类]
     * @param {[string]} cName [类名]
     * @return  {[NodeList]}
     */
    NodeList.prototype.addAllClass = function(cName) {

        B.each.call(this, function(element) {
            element.addClass(cName);
        });

        return this;
    };

    /**
     * [on 处理nodelist的事件]
     * @param  {[string]}   type 事件类型
     * @param  {Function} fn   事件处理函数
     * @return  {[NodeList]}
     */
    NodeList.prototype.on = function(type, fn) {

        B.each.call(this, function(element) {
            element.on(type, fn);
        });

        return this;
    };

})(Boia);

// =Widget
(function(B) {
    'use strict';

    B.Widget = function() {

    };

    B.Widget.prototype = {};

})(Boia);

// =Tabview

(function(B) {
    'use strict';

    var DOT = '.',
        NAV_TABS = '.nav-tabs',
        CONTENT_ITEM = '.content-item',
        UL = 'nav-tabs',
        TAB_HIDDEN = 'tab-hidden',
        ACTIVE = 'active';

    B.TabView = function(config) {

        this.activeTab = null;
        this.boundingBox = config.boundingBox || '';
        this.contentItem = B.all(CONTENT_ITEM);
        this.tabs = B.one(DOT + UL).all('li');

        this.initializer();

    };

    B.TabView.prototype = {

        initializer: function() {
            this.bindUI();
        },

        render: function() {

            return this;
        },

        bindUI: function() {
            var boundingBox = B.one(this.boundingBox);

            boundingBox.all(NAV_TABS).on('click', this._tabClick.bind(this));
        },

        /**
         * [_tabClick ]
         * @param  {[Object]} 			event
         * @return {[undefined]}       处理点击tab
         */
        _tabClick: function(event) {
            var target = event.target,
                href, element;

            event.preventDefault();

            element = this._clickList(target);
            href = element.href.split('#')[1];

            this._changeStyle(href);
        },

        /**
         * [_clickList ]
         * @param  {[node]} 		target
         * @return {[node]}        返回点击的元素
         */
        _clickList: function(target) {
            var tagName = target.tagName,
                element, list = target;

            if (tagName === 'A') {
                element = target;
                list = target.parentNode;
            } else {
                element = target.one('a');
            }

            this.activeTab = list;

            return element;
        },

        /**
         * [_changeStyle description]
         * @param  {[string]} 	href
         * @return {[TabView]}      点击tab改变style
         */
        _changeStyle: function(href) {
            var instance = this;

            B.each.call(this.contentItem, function(item) {

                if (href === item.id) {
                    if (item.hasClass(TAB_HIDDEN)) {
                        instance.tabs.removeAllClass(ACTIVE);
                        instance.activeTab.addClass(ACTIVE);
                        instance.contentItem.addAllClass(TAB_HIDDEN);
                        item.removeClass(TAB_HIDDEN);
                    }
                }
            });

            return this;
        }
    };

})(Boia);

// =Tooltip

(function(B){
    'use strict';

    var DOT = '.',
        TOOLTIP = 'tooltip',
        TOOLTIP_HIDDEN = 'tooltip-hidden';

    B.Tooltip = function(config){

        this.trigger = config.trigger || '';
        this.position = config.position || '';
        
        this.initializer();
    };

    B.Tooltip.prototype = {
        initializer: function(){
            this.boundingBox = B.one(DOT + TOOLTIP);

            this.bindUI();
        },
        render: function(){

        },
        bindUI: function(){

            B.on('click', this.hide);

        },

        hide: function(){
            var boundingBox = this.boundingBox;
            
            boundingBox.addClass(TOOLTIP_HIDDEN);

        },

        visible: function(){
            B.one(this.boundingBox).removeClass(TOOLTIP_HIDDEN);
        }
    };

})(Boia);