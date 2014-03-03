var Boia = {};


// =Global method
(function(B) {
    'use strict';

    B.each = Array.prototype.forEach;

    B.bind = function(fn,context, args){
        return fn.bind(context,args);
    };

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

        B.one(selector) && B.one(selector).addEventListener(type, fn);
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

    B.parseHashUrl = function(){
        var hash = location.hash.slice(1),
            arr = hash.split('&'),obj = {};

        arr.forEach(function(item,i){
            var str = item.split('=');
            obj[str[0]] = str[1];
        });

        return obj;
    };

})(Boia);

//Object.prototype.toString.call([]).slice(8,-1)

(function(B){
    var EventTarget;

    EventTarget = B.EventTarget = function(){
        this.handlers={};  //函数处理器数组 
    };

    B.EventTarget.prototype = {
        constructor:EventTarget,

        /**
         * [addHandler 添加一个事件处理器]
         * @param {[type]} type    [description]
         * @param {[type]} handler [description]
         */
        addHandler:function(type,handler){
            if(typeof this.handlers[type] == "undefined"){ 
                this.handlers[type]=[]; 
            } 
            this.handlers[type].push(handler); 
        }, 
        
        /**
         * [fire 处罚事件]
         * @param  {[Object]} event [事件对象]
         * @return {[type]}       [description]
         */
        fire:function(event){

            if(!event.target){ 
                event.target=this; 
            } 
            if(this.handlers[event.type] instanceof Array){ 
                var handlers=this.handlers[event.type]; 
                for(var i=0,len=handlers.length;i<len;i++){ 
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
        removeHandler:function(type,handler){
            if(this.handlers[type] instanceof Array){ 
                var handlers=this.handlers[type]; 

                for(var i=0,len = handlers.length;i<len;i++){ 
                    if(handlers[i]===handler){ 
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

        if(val) {
            this.style[styleName] = val;
        }else {
            return this.style[styleName];
        }

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

        this.innerHTML += content;

        return this;
        
    };     

     HTMLElement.prototype.prepend = function(content) {

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

(function(B){
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

(function(B){
    'use strict';

    var DOT = '.',
        COMBOBOX = 'combobox',
        COMBOBOX_INNER = 'combobox-inner',
        COMBOBOX_DROP = 'combobox-drop',
        COMBOBOX_LIST = 'combobox-result';

    var liTemplate = '<li class="combobox-result"></li>';    

    B.Combobox = function(config){

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

        initComponent: function(){

            this.triggerNode = this.boundingBox.one('.combobox-arrow-box');
            this.contentBox = this.boundingBox.one(DOT + COMBOBOX_INNER);
            this.dropBox = this.boundingBox.one(DOT + COMBOBOX_DROP);
        },

        render: function(){
            this.renderUI();

            return this;
        },

        renderUI: function(){
        },

        bindUI: function(){
            var instance = this;

            instance.triggerNode.on('click', B.bind(instance.toggle,instance));
            instance.dropBox.on('click', function(event){
                instance.select(event);
            });
        },

        toggle: function(event){
            var instance = this,
                triggerNode = instance.triggerNode;

            if(triggerNode.hasClass('top')) {
                triggerNode.replaceClass('top','bottom');
                instance.dropBox.removeClass('hide');
            }else{
                triggerNode.replaceClass('bottom','top');    
                instance.dropBox.addClass('hide');         
            }
        },

        select: function(event){
            var target = event.target;

            this.boundingBox.one('.combobox-input').value = target.text();
            this.toggle();            
        }
    };
        
})(Boia);

// =ContextMenu

(function(B){
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
                instance.onContextMenu(event);
            });

            instance.boundingBox.on('click', function(){
                
            });
        },
        onContextMenu: function(event){
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