
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
