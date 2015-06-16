var noop = require('./utils.noop');

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
