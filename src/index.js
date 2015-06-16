var matchesSelector = require('./dom.matchesSelector');
var fireEvent = require('./dom.fireEvent');
var render = require('./render');

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
