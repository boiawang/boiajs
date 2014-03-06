(function(B){
    'use strict';

    var d = document;
    var container = Container;

    d.addEventListener('DOMContentLoaded',function(){
        container.setSize(B.one('.container').eleWidth(),B.one('.container').eleHeight());
    });

    //关闭
    B.one('.tool-close').on('click', function() {
        event.stopPropagation();

        container.close();
    });

    //最小化
    B.one('.tool-min').on('click', function() {
        event.stopPropagation();
        
        container.showMinimized();
    });

})(Boia);