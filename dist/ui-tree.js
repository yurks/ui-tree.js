(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
module.exports = function(el, eventName) {
    if (el.dispatchEvent) {
        var event = global.document.createEvent('click,mouseup,mousedown'.indexOf(eventName) >= 0 ? 'MouseEvents': 'HTMLEvents');
        event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.
        el.dispatchEvent(event, true);console.log(11)
    } else if (el.fireEvent) {
        // IE-old school style
        var event = global.createEventObject();
        el.fireEvent('on' + eventName, event);
    }
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
var noop = require(6);

var _matcher;
var _getMatcher = function(element) {
    if (_matcher) {
        return _matcher;
    }

    if (element.matches) {
        _matcher = element.matches;
        return _matcher;
    }

    if (element.webkitMatchesSelector) {
        _matcher = element.webkitMatchesSelector;
        return _matcher;
    }

    if (element.mozMatchesSelector) {
        _matcher = element.mozMatchesSelector;
        return _matcher;
    }

    if (element.msMatchesSelector) {
        _matcher = element.msMatchesSelector;
        return _matcher;
    }

    if (element.oMatchesSelector) {
        _matcher = element.oMatchesSelector;
        return _matcher;
    }

    _matcher = noop;
    return _matcher;
};

var matchesSelector = function(element, selector, boundElement) {
    // if we have moved up to the element you bound the event to
    // then we have come too far
    if (element === boundElement) {
        return;
    }

    // if this is a match then we are done!
    if (_getMatcher(element).call(element, selector)) {
        return element;
    }

    // if this element did not match but has a parent we should try
    // going up the tree to see if any of the parent elements match
    // for example if you are looking for a click on an <a> tag but there
    // is a <span> inside of the a tag that it is the target,
    // it should still work
    if (element.parentNode) {
        return matchesSelector(element.parentNode, selector, boundElement);
    }
};

module.exports = matchesSelector;
},{}],3:[function(require,module,exports){
var matchesSelector = require(2);
var fireEvent = require(1);
var render = require(4);

var setChecked = function(checkbox, value) {
    value = !!value;
    var changed = false;
    if (checkbox.indeterminate) {
        checkbox.indeterminate = false;
        changed = true;
    }
    if (checkbox.checked !== value) {
        checkbox.checked = value;
        changed = true;
    }
    return changed;
};

var setIndeterminate = function(checkbox, value) {
    value = !!value;
    checkbox.checked = false;
    if (checkbox.indeterminate !== value) {
        checkbox.indeterminate = value;
        return true;
    }
};

var getWrapper = function(checkbox, container) {
    var parentNode = checkbox.parentNode;
    while (parentNode && parentNode !== container) {
        if (parentNode.tagName.toUpperCase() === 'LI') {
            return parentNode;
        }
        parentNode = parentNode.parentNode;
    }
};

var getCheckbox = function(li) {
    return li && li.firstChild.querySelector('input');
};

var processParents = function(li, isChecked, container) {
    var input, _li;

    var parentLi = getWrapper(li, container);
    var parentCheckbox = getCheckbox(parentLi);

    if (parentLi && parentCheckbox) {
        for (_li = li.parentNode.firstChild; _li; _li = _li.nextElementSibling) {
            if (isChecked === null || (li !== _li && (input = getCheckbox(_li)) && (input.checked !== isChecked || input.indeterminate))) {
                setIndeterminate(parentCheckbox, true);
                processParents(parentLi, null, container);
                return;
            }
        }
        setChecked(parentCheckbox, isChecked);
        processParents(parentLi, isChecked, container);
    }
};

var toggleAttribute = function(el, attr, value) {
    if (el) {
        el.setAttribute(attr, ((el.attributes[attr] && el.attributes[attr].value) !== value).toString());
    }
};

var setAttributeIfNotExist = function(el, attr, value) {
    if (el) {
        if (!el.attributes[attr]) {
            el.setAttribute(attr, value || '');
            return true;
        }
    }
    return false;
};

var prepare = function(container, inputs) {
    var i = 0, li;
    for (; i < inputs.length; i+=1) {
        if (inputs[i].checked) {
            li = getWrapper(inputs[i], container);
            if (setAttributeIfNotExist(li.parentNode, 'data-ui-tree-prepared')) {
                processParents(li, inputs[i].checked, container);
            }
        }
    }
};

var initialize = function(container) {
    if (setAttributeIfNotExist(container, 'data-ui-tree-initialized')) {

        container.addEventListener('click', function(e) {
            var el = matchesSelector(e.target, '.ui-tree-item-toggler', container);
            if (el) {
                e.preventDefault();
                toggleAttribute(getWrapper(el, container), 'data-ui-tree-expanded', 'true');
            }
            setTimeout(clickedIndeterminateForceChange, 1);
        });

        var clickedIndeterminate = false;
        var clickedIndeterminateForceChange = function() {
            if (clickedIndeterminate) {
                fireEvent(clickedIndeterminate, 'click');
                clickedIndeterminate = false;
            }
        };
        container.addEventListener('mousedown', function(e) {
            if (e.target.indeterminate) {
                clickedIndeterminate = e.target;
            }
        });
        container.addEventListener('change', function(e) {
            clickedIndeterminate = false;
            var checkbox = e.target;
            var checked = checkbox.checked;
            var li = getWrapper(checkbox, container);
            var i = 0;

            var checkboxes = li.querySelectorAll('input');
            for (; i < checkboxes.length; i += 1) {
                if (checkboxes[i] !== checkbox && checkboxes[i].checked !== checked) {
                    setChecked(checkboxes[i], checked);
                }
            }
            processParents(li, checked, container);
        });
    }
};

var app = {
    init: function(container) {
        var checkboxes = container.querySelectorAll('input'),
            inputs = [],
            i = 0;
        for (; i < checkboxes.length; i+=1) {
            if (checkboxes[i].value) {
                inputs.push(checkboxes[i]);
            }
        }

        prepare(container, inputs);
        initialize(container);

        return {
            container: container,
            getValues: function(returnEmptyIfAllChecked) {
                var out = [],
                    i = 0;
                for (; i < inputs.length; i+=1) {
                    if (inputs[i].checked) {
                        out.push(inputs[i].value);
                    }
                }
                return (returnEmptyIfAllChecked && out.length === inputs.length) ? [] : out;
            },
            hasValues: function() {
                var i = 0;
                for (; i < inputs.length; i+=1) {
                    if (inputs[i].checked) {
                        return true;
                    }
                }
                return false;
            }
        };
    },

    render: function(tree) {
        return render(tree, true, true, 'tree');
    },

    draw: function(container, tree, multiple) {
        container.innerHTML = app.render(tree, multiple);
        app.init(container);
    }
};

module.exports = app;
},{}],4:[function(require,module,exports){
var isGroupSelectable = function(isSelectableGroups, depth) {
    return isSelectableGroups === true || (typeof depth === 'number' && isSelectableGroups && isSelectableGroups <= depth);
};

var _render = function(tree, checkbox, isSelectableGroups, chain, depth) {
    depth = depth || 0;
    var i = 0, name = chain, has_children, expanded;
    var tpl = '<ul ';
    if (depth) {
        tpl += 'class="ui-tree-children';
        chain += '.children';
    } else {
        tpl += 'class="ui-tree-root';
    }
    //tpl += (isGroupSelectable(isSelectableGroups, depth) ? ' ui-tree-group-selectable' : ' ui-tree-group-not-selectable');
    tpl += '">';

    for (; i < tree.length; i+=1) {
        has_children = tree[i].children && tree[i].children.length;
        name = chain + '[' + i + ']';
        expanded = has_children ? 'data-ui-tree-expanded="' + ((!depth && tree.length === 1) || !!tree[i].expanded) + '"' : '';
        tpl += '<li class="ui-tree-item' + (has_children ? ' ui-tree-item-group' : '') + '" ' + expanded + '>';
        tpl += '<div class="ui-tree-item-label ' + checkbox + '"><label class="ui-tree-item-label-real">';
        tpl += '<span class="ui-tree-item-toggler"></span>';
        tpl += '<input class="ui-tree-item-checkbox" type="' + checkbox + '"' + ' value="' + (tree[i].id || '') + '"' + (tree[i].disabled ? ' disabled' : '') + (tree[i].checked ? ' checked' : '') + '>';
        tpl += '<span class="ui-tree-item-text">' + tree[i].label + '</span>';
        tpl += '</label></div>';
        if (has_children) {
            tpl += _render(tree[i].children, checkbox, isSelectableGroups, name, depth+1);
        }
        tpl += '</li>';
    }
    tpl += '</ul>';
    return tpl;
};

module.exports = function(tree, multiple, isSelectableGroups, inputName) {
    return _render(tree, multiple ? 'checkbox' : 'radio', isSelectableGroups, inputName);
};
},{}],5:[function(require,module,exports){
(function (global){
global.uiTree = require(3);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
module.exports = function() {};
},{}]},{},[5]);
