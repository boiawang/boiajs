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

})(Boia);

// =node
(function(B) {
    'use strict';

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

    B.Tooltip = function(config){

        this.trigger = config.trigger || '';
        this.position = config.position || '';
        
        this.initializer();
    };

    B.Tooltip.prototype = {
        initializer: function(){

        },
        render: function(){

        },
        bindUI: function(){

        }
    };

})(Boia);