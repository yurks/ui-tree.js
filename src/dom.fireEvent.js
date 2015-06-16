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