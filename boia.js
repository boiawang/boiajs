var Boia = Boia || {};

//Object.prototype.toString.call([]).slice(8,-1)
//B.Lang.type  判断类型
(function(B) {

    var L = {},
    
    TYPES = {
        'undefined'        : 'undefined',
        'number'           : 'number',
        'boolean'          : 'boolean',
        'string'           : 'string',
        '[object Function]': 'function',
        '[object RegExp]'  : 'regexp',
        '[object Array]'   : 'array',
        '[object Date]'    : 'date',
        '[object Error]'   : 'error'
    },

    SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g,

    WHITESPACE = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF",
    WHITESPACE_CLASS = "[\x09-\x0D\x20\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+",
    TRIM_LEFT_REGEX  = new RegExp("^" + WHITESPACE_CLASS),
    TRIM_RIGHT_REGEX = new RegExp(WHITESPACE_CLASS + "$"),
    TRIMREGEX        = new RegExp(TRIM_LEFT_REGEX.source + "|" + TRIM_RIGHT_REGEX.source, "g");

    L.isBoolean = function(o) {
        return typeof o === 'boolean';
    };

    L.isDate = function(o) {
        return L.type(o) === 'date' && o.toString() !== 'Invalid Date' && !isNaN(o);
    };

    L.isArray = Array.isArray || function(o) {
        return L.type(o) === 'array';
    };

    L.isFunction = function(o) {
        return L.type(o) === 'function';
    };

    L.isNull = function(o) {
        return o === null;
    };

    L.isNumber = function(o) {
        return typeof o === 'number' && isFinite(o);
    };

    L.isObject = function(o, failfn) {
        var t = typeof o;
        return (o && (t === 'object' ||
            (!failfn && (t === 'function' || L.isFunction(o))))) || false;
    };

    L.isRegExp = function(value) {
        return L.type(value) === 'regexp';
    };

    L.isString = function(o) {
        return typeof o === 'string';
    };

    L.isUndefined = function(o) {
        return typeof o === 'undefined';
    };

    L.now = Date.now || function () {
        return new Date().getTime();
    };

    L.sub = function(s, o) {
        return s.replace ? s.replace(SUBREGEX, function (match, key) {
            return L.isUndefined(o[key]) ? match : o[key];
        }) : s;
    };


    L.trim = String.prototype.trim && !WHITESPACE.trim() ? function(s) {
            return s && s.trim ? s.trim() : s;
        } : function (s) {
            try {
                return s.replace(TRIMREGEX, '');
            } catch (e) {
                return s;
            }
    };

    L.type = function(o) {
        return TYPES[typeof o] || TYPES[Object.prototype.toString.call(o)] || (o ? 'object' : 'null');
        // return Object.prototype.toString.call(o).match(/\[object (.*?)\]/)[1].toLowerCase();
    };

    B.Lang = L;

})(Boia);

// =Global method
(function(B) {
    'use strict';

    var hasOwn   = Object.prototype.hasOwnProperty,
        OP = Object.prototype,
        isObject = B.Lang.isObject;

    B.each = Array.prototype.forEach;

    B.bind = function (fn,context, args){
        return fn.bind(context,args);
    };

    B.one = function (selector) {

        var node = null,
            d = document;

        node = d.querySelector(selector);

        return node;
    };

    B.all = function (selector) {

        var nodeList = null,
            d = document;

        nodeList = d.querySelectorAll(selector);

        return nodeList;
    };

    B.on = function (type, fn, selector) {

        B.one(selector) && B.one(selector).addEventListener(type, fn);
    };

    B.extend = function(r, s, px, sx) {
        if (!s || !r) {
            throw new Errow('请输入基类和父类');
        }
        
        //兼容版本
        /*Object.create = Object.create || function (o) {

            function F() {}
            F.prototype = o;
            return new F();

        };*/

        var sp = s.prototype, rp = Object.create(sp);
        r.prototype = rp;
        
        // 因为原型被覆盖.所以原型的prototype指向了F 要修正回来
        // 具体constructor的原理可参考http://www.cnblogs.com/objectorl/archive/2009/09/02/1632715.html
        rp.constructor = r;

        // 将子类的自定义属性superclass指向父类的原型  这样就方便引用到原型实例
        // r.superclass.constructor.call(this, options) 就可以实现属性冒充.继承父类的构造属性
        r.superclass = sp;
     
        // 如果父类不是Object但constructor却指向了Object, 表示父类的原型也被覆盖了 所以要保证正确
        // 这样r.superclass.constructor才能正确指向父类
        if (s != Object && sp.constructor == OP.constructor) {
            sp.constructor = s;
        }
     
        // add prototype overrides
        if (px) {
            B.mix(rp, px, true);
        }
     
        // add object overrides
        if (sx) {
            B.mix(r, sx, true);
        }
     
        return r;
    };

    B.mix = function(receiver, supplier, overwrite, whitelist, mode, merge) {
        var alwaysOverwrite, exists, from, i, key, len, to;
     
        if (!receiver || !supplier) {
            return receiver || B;
        }
     
        if (mode) {
            if (mode === 2) {
                B.mix(receiver.prototype, supplier.prototype, overwrite,
                        whitelist, 0, merge);
            }
     
            from = mode === 1 || mode === 3 ? supplier.prototype : supplier;
            to   = mode === 1 || mode === 4 ? receiver.prototype : receiver;
     
            if (!from || !to) {
                return receiver;
            }
        } else {
            from = supplier;
            to   = receiver;
        }
     
        alwaysOverwrite = overwrite && !merge;
     
        if (whitelist) {
            for (i = 0, len = whitelist.length; i < len; ++i) {
                key = whitelist[i];

                if (!hasOwn.call(from, key)) {
                    continue;
                }
     
                exists = alwaysOverwrite ? false : key in to;
     
                if (merge && exists && isObject(to[key], true)
                        && isObject(from[key], true)) {

                    B.mix(to[key], from[key], overwrite, null, 0, merge);
                } else if (overwrite || !exists) {

                    to[key] = from[key];
                }
            }
        } else {
            for (key in from) {

                if (!hasOwn.call(from, key)) {
                    continue;
                }
     
                exists = alwaysOverwrite ? false : key in to;
     
                if (merge && exists && isObject(to[key], true)
                        && isObject(from[key], true)) {
                    B.mix(to[key], from[key], overwrite, null, 0, merge);
                } else if (overwrite || !exists) {
                    to[key] = from[key];
                }
            }
            /*if (B.Object._hasEnumBug) {
                B.mix(to, from, overwrite, Y.Object._forceEnum, mode, merge);
            }*/
        }
     
        return receiver;
    };

    /**
     * [getViewport 获得视口宽高]
     * @return {[Object]} [包含高宽的对象]
     */
    B.getViewport = function () {

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

    B.parseHashUrl = function (){
        var hash = location.hash.slice(1),
            arr = hash.split('&'),obj = {};

        arr.forEach(function (item,i){
            var str = item.split('=');
            obj[str[0]] = str[1];
        });

        return obj;
    };

})(Boia);

(function(B) {
    var EventTarget;

    EventTarget = B.EventTarget = function(){
        this.handlers={};  //函数处理器数组 
    };

    B.EventTarget.prototype = {
        constructor: EventTarget,

        /**
         * [addHandler 添加一个事件处理器]
         * @param {[type]} type    [description]
         * @param {[type]} handler [description]
         */
        addHandler: function(type,handler){
            if(typeof this.handlers[type] == "undefined"){ 
                this.handlers[type] = []; 
            } 
            this.handlers[type].push(handler); 
        }, 
        
        /**
         * [fire 触发事件]
         * @param  {[Object]} event [事件对象]
         * @return {[type]}       [description]
         */
        fire: function(event){

            if(!event.target){ 
                event.target = this; 
            } 
            if(this.handlers[event.type] instanceof Array){ 
                var handlers=this.handlers[event.type]; 
                for(var i = 0,len = handlers.length;i < len;i++){ 
                    handlers[i](event); 
                } 
            } 
        }, 

        /**
         * [removeHandler 删除指定的事件]
         * @param  {[string | array]} type    [事件类型]
         * @param  {[string]} handler [description]
         * @return {[type]}         [description]
         */
        removeHandler: function(type,handler){
            if(this.handlers[type] instanceof Array){ 
                var handlers = this.handlers[type]; 

                for(var i = 0,len = handlers.length;i < len;i++){ 
                    if(handlers[i] === handler){ 
                        break; 
                    } 
                } 

                //删除指定的handler处理器 
                handlers.splice(i,1);
            }
        }
    };

})(Boia);

// =node
(function(B) {
    'use strict';

    var d = document;
    var isNumber = B.Lang.isNumber;

    HTMLElement = typeof(HTMLElement) != 'undefiend' ? HTMLElement : Element;

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

    HTMLElement.prototype.replaceClass = function(oldName,newName) {

        this.removeClass(oldName);
        this.addClass(newName);

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
    HTMLElement.prototype.eleWidth = function() {

        var width = 0;

        width = this.offsetWidth;

        return width;
    };      

    HTMLElement.prototype.eleHeight = function() {

        var height = 0;

        height = this.offsetHeight;

        return height;
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

    HTMLElement.prototype.getXY = function() {

        var x,y;

        x = this.getX();

        y = this.getY();

        return {x: x,y: y};
    };  

    /**
     * [css description]
     * @param  {[string]} styleName [description]
     * @param  {[string]} val       [description]
     * @return {[type]}           [description]
     */
    HTMLElement.prototype.css = function(styleName, val) {
        if(isNumber(val)) val = val.toString();

        if(val) {
            this.style[styleName] = val;
        }else {
            return this.style[styleName];
        }

        return this;

    };     

    HTMLElement.prototype.hide = function() {

        this.addClass('hide');

        return this;
        
    };  

    HTMLElement.prototype.show = function() {

        this.removeClass('hide');

        return this;
        
    };      

    HTMLElement.prototype.text = function(content) {

        if(content) {
            this.innerText = content;
        }else {
            return this.innerText;
        }

        return this;
        
    };   

    HTMLElement.prototype.html = function(content) {

        if(content) {
            this.innerHTML = content;
        }else {
            return this.innerHTML;
        }

        return this;
        
    };          

    HTMLElement.prototype.append = function(content) {

        var div = document.createElement('div').cloneNode(), nodes = null,
            fragment = document.createDocumentFragment();

        div.innerHTML = content;


        nodes = div.childNodes;
        for(var i = 0,length = nodes.length;i < length;i++){
            fragment.appendChild(nodes[i].cloneNode(true));
        }

        this.appendChild(fragment);

        nodes = null;
        fragment = null;       

        return this;        
        
    };     

     HTMLElement.prototype.prepend = function(content) {

        var divTemp = document.createElement('div'), nodes = null
            , fragment = document.createDocumentFragment();

        divTemp.innerHTML = content;
        nodes = divTemp.childNodes;
        for (var i=0, length=nodes.length; i<length; i+=1) {
           fragment.appendChild(nodes[i].cloneNode(true));
        }
        // 插入到容器的前面 - 差异所在
        this.insertBefore(fragment, this.firstChild);
        // 内存回收？
        nodes = null;
        fragment = null;
        
    };        

    /*HTMLElement.prototype.appendHTML = function(html) {
        var divTemp = document.createElement("div"), nodes = null
            // 文档片段，一次性append，提高性能
            , fragment = document.createDocumentFragment();
        divTemp.innerHTML = html;
        nodes = divTemp.childNodes;
        for (var i=0, length=nodes.length; i<length; i+=1) {
           fragment.appendChild(nodes[i].cloneNode(true));
        }
        this.appendChild(fragment);
        // 据说下面这样子世界会更清净
        nodes = null;
        fragment = null;
    };

    HTMLElement.prototype.prependHTML = function( html) {
        var divTemp = document.createElement("div"), nodes = null
            , fragment = document.createDocumentFragment();

        divTemp.innerHTML = html;
        nodes = divTemp.childNodes;
        for (var i=0, length=nodes.length; i<length; i+=1) {
           fragment.appendChild(nodes[i].cloneNode(true));
        }
        // 插入到容器的前面 - 差异所在
        this.insertBefore(fragment, this.firstChild);
        // 内存回收？
        nodes = null;
        fragment = null;
    };*/

})(Boia);

// =NodeList
(function(B) {
    'use strict';

    /**
     * [removeClass 给nodelist删除类名]
     * @param  {[string]} cName [类名]
     * @return {[NodeList]}      
     */
    NodeList.prototype.removeClass = function(cName) {

        B.each.call(this, function(element) {
            element.removeClass(cName);
        });

        return this;
    };

    /**
     * [addClass 给nodelist加类]
     * @param {[string]} cName [类名]
     * @return  {[NodeList]}
     */
    NodeList.prototype.addClass = function(cName) {

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

(function(B){

    B.Anim = function(config){
        this.node = B.one(config.node) || null;
        this.to = config.to || {};
        this.from = config.from || {};
    };

    B.Anim.prototype = {

        run: function(){
            var to = this.to;
            var node = this.node;

            for(p in  to)  {
                node.css(p,to[p]);
            }

        }

    };

})(Boia);

// =Widget
(function(B) {
    'use strict';

    B.Widget = function(config) {

        this.width = config.width || 0;
        this.height = config.height || 0;

        this.boundingBox = config.boundingBox || '';
        this.visible = config.visible || true;

        this.strings = config.strings || 'widget';
        
        this.initializer();
    };

    B.Widget.NAME = "widget";

    B.Widget.prototype = {
        initializer: function(config){
        },
        render: function(){
        }
    };

})(Boia);

(function(B){

    var TestWidget = function(config){
        config = config || {};

        //调用父类的构造函数
        TestWidget.superclass.constructor.call(this, config);
    };

    B.extend(TestWidget, B.Widget, {
        say: function(){
            console.log('say');
        }
    });

    B.TestWidget = TestWidget;

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
         * @param  {[Object]} 	         event
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
                        instance.tabs.removeClass(ACTIVE);
                        instance.activeTab.addClass(ACTIVE);
                        instance.contentItem.addClass(TAB_HIDDEN);
                        item.removeClass(TAB_HIDDEN);
                    }
                }
            });

            return this;
        }
    };

})(Boia);

// =Tooltip

(function(B) {
    'use strict';

    var DOT = '.',
        TOOLTIP = 'tooltip',
        TOOLTIP_HIDDEN = 'tooltip-hidden',
        TOOLTIP_INNER = 'tooltip-inner';

    B.Tooltip = function(config){

        this.trigger = config.trigger || '';
        this.position = config.position || 'bottom';
        this.tipText = config.tipText || '这是一个工具条';

        this._id = 'tooltip_'+Math.round(Math.random()*100000);

        this.template = '<div id="'+this._id+'" class="tooltip '+this.position+'"><div class="tooltip-inner">'+this.tipText+'</div><div class="tooltip-arrow"></div></div>';
        
        this.initializer();
    };

    B.Tooltip.prototype = {
        initializer: function(){

            this.initComponent();
            this.bindUI();
        },

        initComponent: function(){
            B.one('.componentBox').prepend(this.template);

            this.boundingBox = B.one('#'+this._id);

            this.triggerNode = B.one(this.trigger);
            this.contentBox = this.boundingBox.one(DOT + TOOLTIP_INNER);

            // this.contentBox.text(this.tipText);

        },

        render: function(){
            this.renderUI();

            this._setCoord();
            return this;
        },
        renderUI: function(){
        },
        bindUI: function(){

            B.on('click', B.bind(this.hide,this), 'body' );
        },
        _setCoord: function(){
            var x = this.triggerNode.getX(),
                y = this.triggerNode.getY(),
                width = this.triggerNode.eleWidth(),
                height = this.triggerNode.eleHeight();

            this.boundingBox.css('left',x+'px');
            this.boundingBox.css('top',y+height+'px');
        },

        hide: function(){
            var boundingBox = this.boundingBox;
            boundingBox.addClass(TOOLTIP_HIDDEN);
            boundingBox.css('opacity', '0');
            boundingBox.css('zIndex', '0');
        },

        show: function(){
            var boundingBox = this.boundingBox;

            this.contentBox.text(this.tipText);

            boundingBox.removeClass(TOOLTIP_HIDDEN);
            boundingBox.css('opacity', '1');
            boundingBox.css('zIndex', '1234');
        }
    };

})(Boia);

// =Combobox

(function(B) {
    'use strict';

    var DOT = '.',
        COMBOBOX = 'combobox',
        COMBOBOX_INNER = 'combobox-inner',
        COMBOBOX_DROP = 'combobox-drop',
        COMBOBOX_LIST = 'combobox-result';

    var liTemplate = '<li class="combobox-result"></li>';    

    B.Combobox = function(config) {

        var boundingBoxCls = config.boundingBox || '.combobox';

        this._id = 'combobox_'+Math.round(Math.random()*100000);

        this.boundingBox = B.one(boundingBoxCls);
        this.boundingBox.id = this._id;
       
        this.initializer();
    };

    B.Combobox.prototype = {
        initializer: function(){

            this.initComponent();
            this.bindUI();
        },

        initComponent: function() {

            this.triggerNode = this.boundingBox.one('.combobox-arrow-box');
            this.contentBox = this.boundingBox.one(DOT + COMBOBOX_INNER);
            this.dropBox = this.boundingBox.one(DOT + COMBOBOX_DROP);
            this.isShowDrop = false;
        },

        render: function() {
            this.renderUI();

            return this;
        },

        renderUI: function() {
        },

        bindUI: function() {
            var instance = this;

            instance.triggerNode.on('click', instance.toggle.bind(instance));
            instance.dropBox.on('click', instance.select.bind(instance));

            B.one('body').on('click', instance._documentClick.bind(instance))
        },

        toggle: function(event) {
            var instance = this;

            event.stopPropagation();

            if(!instance.isShowDrop) {
                instance.showDrop();
            }else {
                instance.hideDrop();        
            }
        },
        hideDrop: function() {
            var instance = this,
                triggerNode = instance.triggerNode;

            instance.isShowDrop = false;
            triggerNode.replaceClass('bottom','top');   
            instance.dropBox.addClass('hide'); 
        },
        showDrop: function() {
            var instance = this,
                triggerNode = instance.triggerNode;
            
            instance.isShowDrop = true;
            triggerNode.replaceClass('top','bottom');
            instance.dropBox.removeClass('hide');
        },
        select: function(event) {
            var target = event.target;

            event.stopPropagation();
            this.boundingBox.one('.combobox-input').value = target.text();
            this.toggle();            
        },
        _documentClick: function(event) {
            this.hideDrop();
        }
    };
        
})(Boia);

// =ContextMenu

(function(B) {
    'use strict';

    var DOT = '.',
        MENU = 'menu';

    B.ContextMenu = function(config){

        var boundingBoxCls = config.boundingBox || '.menu';

        this._id = 'menu_'+Math.round(Math.random()*100000);

        this.boundingBox = B.one(boundingBoxCls);
        this.boundingBox.id = this._id;
       
        this.initializer(config);
    };

    B.ContextMenu.prototype = {
        initializer: function(config){

            this.onContextMenu = config.onContextMenu || function(event){};
            this.onListClick = config.onListClick || function(listNode){};
            this.initComponent(config);
            this.bindUI();
        },

        initComponent: function(config){
            this.areaNode = B.one(config.areaNode) || B.one('body');
        },

        render: function(){
            this.renderUI();

            return this;
        },

        renderUI: function(){
        },

        bindUI: function(){
            var instance = this;

            instance.areaNode.on('contextmenu', function(event){
                event.preventDefault();
                instance._onContextMenu(event);
                instance.onContextMenu(event);
            });

            instance.boundingBox.on('click', function(event){
                event.stopPropagation();
                instance.onListClick(event.target);
            });

            B.one('body').on('click', function(){
                instance.hide();
            });

        },
        _onContextMenu: function(event){
            this.show();
            this.boundingBox.css('left',event.pageX + 'px');
            this.boundingBox.css('top',event.pageY + 'px');
        },
        show: function(){
            this.boundingBox.removeClass('hide');
        },

        hide: function(){
            this.boundingBox.addClass('hide');
        }
    };
        
})(Boia);

/* =MenuButton */
(function(B) {
    'use strict';

    var DOT = '.',
        MENU_BUTTON = 'menu-button',
        MENU_DROP = 'dropdown-toggle';

    B.MenuButton = function(config){

        var boundingBoxCls = config.boundingBox || '.menu-button';

        this._id = 'menu-button_'+Math.round(Math.random()*100000);

        this.boundingBox = B.one(boundingBoxCls);
        this.boundingBox.id = this._id;
       
        this.initializer(config);
    };

    B.MenuButton.prototype = {
        initializer: function(config){

            this.initComponent(config);
            this.bindUI();
        },

        initComponent: function(config){

            this.triggerNode = this.boundingBox.one(DOT+MENU_DROP);
            this.toggle = config.toggle || function(){};
        },

        render: function(){
            this.renderUI();

            return this;
        },

        renderUI: function(){
        },

        bindUI: function(){
            var instance = this;

            instance.triggerNode.on('click', function(event){
                event.stopPropagation();
                instance._toggle(event);
            });

            B.one('body').on('click', function(){
                instance.hideMenu();
            });

        },
        _toggle: function(){
            if(this.boundingBox.hasClass('open')){
                this.hideMenu();
            }else {
                this.showMenu();
            }
        },
        showMenu: function(){
            this.boundingBox.addClass('open');
        },

        hideMenu: function(){
            this.boundingBox.removeClass('open');
        }
    };
        
})(Boia);

/* =treeView */

(function(B) {
    'use strict';

    var DOT = '.',
        TREE_HITAREA = 'tree-hitarea',
        TREE_VIEW_CONTENT = 'tree-view-content',
        TREE_NODE = 'tree-node',
        TREE_NODE_CONTENT = 'tree-node-content',
        TREE_CONTAINER = 'tree-container',
        TREE_LABEL = 'tree-label';

    var liNodeTpl = '<li class='+TREE_NODE+'>'+
                    '<div class='+TREE_NODE_CONTENT+'>'+
                    '<span class='+TREE_LABEL+'></span></div>'+
                    '<ul class='+TREE_CONTAINER+'></ul>'+'</li>';

    B.TreeView = function(config){
        var boundingBoxCls = config.boundingBox || '.treeview';

        this._id = 'treeview_'+Math.round(Math.random()*100000);

        this.boundingBox = B.one(boundingBoxCls);
        this.boundingBox.id = this._id;

        this.initializer(config);
    };

    B.TreeView.prototype = {
        initializer: function(config){

            this.children = config.children || [];
            this.initComponent(config);
            this.bindUI();
        },

        initComponent: function(config){
            this.boundingBox.append('<ul class='+TREE_VIEW_CONTENT+'></ul>');

           
            this.contentBox = this.boundingBox.one(DOT + TREE_VIEW_CONTENT);
        },

        render: function(){
            this.renderUI();

            return this;
        },

        renderUI: function(){
            var instance = this;

            instance._generateTree(instance.children);
        },

        _generateTree: function(children,parentNode){
            var instance = this;

            children.forEach(function(child, item){
                var node = instance._insertNode(child,parentNode);

                if(child.item){
                    instance._generateTree(child.item,node);
                }
            });
        },

        _insertNode: function(item, parentNode){
            var instance = this;

            if(!parentNode) parentNode = instance.contentBox;

            parentNode.append(liNodeTpl);

            parentNode.lastElementChild.one(DOT + TREE_LABEL).text(item.label);

            return parentNode.lastElementChild.one(DOT+TREE_CONTAINER);
        },

        bindUI: function(){
            var instance = this;


        }
    };

})(Boia);
