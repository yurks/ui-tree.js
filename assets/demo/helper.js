(function(window) {
    var noop = function() {};

    var ajax = function(url, success, error) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onreadystatechange = function(){
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status < 400) {
                    (success||noop)(request.responseText);
                } else {
                    (error||noop)(request);
                }
            }
        };
        request.onerror = error||noop;
        request.send();
    };

    var container = document.getElementById('container');
    var page = window.location.search.slice(1) || 'json';
    if (page.indexOf('html') === 0) {
        ajax('assets/demo/' + page + '.txt', function(tree) {
            container.innerHTML = tree;
            uiTree.init(container);
        }, console.error);
    } else {
        ajax('assets/demo/' + page + '.txt', function(tree) {
            uiTree.draw(container, JSON.parse(tree));
        }, console.error);
    }


})(window);

