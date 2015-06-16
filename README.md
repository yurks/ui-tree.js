# ui-tree.js

Ui-tree.js is a pure javascript plugin for rendering three-state checkboxes tree form JSON data.
It also could be attached to existing HTML with "ul-li" tree. It could handle many thousands of tree items without performance issues. 

![Screenshot](https://yurks.github.io/ui-tree/assets/screenshot.png)


[Live Demo](http://yurks.github.io/ui-tree.js/demo)

## Installing

Use `bower` to install it to your app:
    
    bower install --save ui-tree.js

or download [latest release](https://github.com/yurks/ui-tree.js/releases/latest) and attach it manually:

```html
<script src="ui-tree.min.js"></script>
<link href="ui-tree.min.css" rel="stylesheet">
```

## Usage

```js
var uiTreeInstance = UiTree.draw(container, tree);
```

or for already generated content

```js
var uiTreeInstance = UiTree.init(container);
```

where `container` is a DOM node to attach generated HTML, and `tree` is an object with tree data (see examples for structure).

Both methods returning created instance object `uiTreeInstance`:

* `uiTreeInstance.container` - property contains DOM node passed to with attached tree.
* `uiTreeInstance.getValues(returnEmptyIfAllChecked)` - return an array with ids of checked items.
Where `returnEmptyIfAllChecked` is a boolean which allow returning an empty array in case all items are checked.  
* `uiTreeInstance.hasValues()` - return `true` if at least one checkbox is checked or `false` otherwise.

Another one useful method just render and return HTML string for passed tree object.
Could be used in server side for generating static HTML. 

```js
var uiTreeHtml = UiTree.render(tree);
```

## Examples

Example with JSON data:

```js
var uiTreeInstance = uiTree.draw(document.getElementById('container'), tree);
```

where `tree` variable is object with structure like

```js
[
    {"label":"UI Tree Root", "children":[
        {"label":"Gutmann, Fritsch and Steuber", "children":[
            {"label":"Marvin Group", "children":[
                {"label": "Bode, Deckow and Wolff", "children":[
                    {"label":"Kutch and Daughters", "id":"203838b2-eff5-49db-95d6-0f6f40830b89", "checked":true},
                    {"label":"Kautzer and Sons", "id":"60c4536b-135a-4abb-822c-2e26df1749d9"},
                    {"label":"Herzog-Renner", "id":"12cc1fdb-23b3-4336-add4-df1a002df332", "checked":true}
                ]}
            ]}
        ], "expanded": true},
        {"label":"Christiansen, Grant and Spencer", "id":"60403a9d-f972-427d-a6ba-16812aa98576", "checked":true},
        {"label":"Feeney, Hickle and Luettgen", "id":"ec76491a-90ca-4217-98be-3ee98911eea5"},
        {"label":"Osinski LLC", "id":"ba98b91f-bad9-4e31-85dc-fdedb745811c", "checked":true, "disabled":true}
    ]}
]
```

Example with manually generated HTML tree:

```js
var uiTreeInstance = uiTree.init(document.getElementById('container'));
```

In this case HTML structure should looks like:

```html
<div id="container">
    <ul class="ui-tree-root"><li
        class="ui-tree-item ui-tree-item-group" data-ui-tree-expanded="true"><div
            class="ui-tree-item-label checkbox"><label
                class="ui-tree-item-label-real"><span
                    class="ui-tree-item-toggler"></span><input
                    class="ui-tree-item-checkbox" type="checkbox" value=""><span
                    class="ui-tree-item-text">UI Tree Root</span>
                </label>
            </div><ul
            class="ui-tree-children"><li
                class="ui-tree-item"><div
                    class="ui-tree-item-label checkbox"><label
                        class="ui-tree-item-label-real"><span
                            class="ui-tree-item-toggler"></span><input
                            class="ui-tree-item-checkbox" type="checkbox" value="60403a9d-f972-427d-a6ba-16812aa98576"><span
                            class="ui-tree-item-text">Christiansen, Grant and Spencer</span>
                        </label>
                    </div>
                </li><li
                class="ui-tree-item"><div
                    class="ui-tree-item-label checkbox"><label
                        class="ui-tree-item-label-real"><span
                            class="ui-tree-item-toggler"></span><input
                            class="ui-tree-item-checkbox" type="checkbox" checked disabled value="ba98b91f-bad9-4e31-85dc-fdedb745811c"><span
                            class="ui-tree-item-text">Osinski LLC</span>
                        </label>
                    </div>
                </li><li
                class="ui-tree-item ui-tree-item-group" data-ui-tree-expanded="true"><div
                    class="ui-tree-item-label checkbox"><label
                        class="ui-tree-item-label-real"><span
                            class="ui-tree-item-toggler"></span><input
                            class="ui-tree-item-checkbox" type="checkbox" value=""><span
                            class="ui-tree-item-text">Gutmann, Fritsch and Steuber</span>
                        </label>
                    </div><ul
                    class="ui-tree-children"><li
                        class="ui-tree-item"><div
                            class="ui-tree-item-label checkbox"><label
                                class="ui-tree-item-label-real"><span
                                    class="ui-tree-item-toggler"></span><input
                                    class="ui-tree-item-checkbox" type="checkbox" checked value="ec76491a-90ca-4217-98be-3ee98911eea5"><span
                                    class="ui-tree-item-text">Feeney, Hickle and Luettgen</span>
                                </label>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>   
</div>
```

There is some important requirements for your own HTML data:

* nodes should contains all needed `.ui-tree-*` classNames
* no whitespaces allowed between nodes for better performance
* all inputs should have `value` attribute even if it empty for proper collecting checked values,
otherwise all checkboxes will have default value `on`.
* use UiTree.render(tree) to take care for all this stuff;)
 
## License

[MIT license](LICENSE)
