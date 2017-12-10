# Create Element Extended

[![Build Status](https://travis-ci.org/qwtel/create-element-x.svg?branch=master)](https://travis-ci.org/qwtel/create-element-x)

Extends `document.createElement` to conform to the target API of JSX transpilation.

```js
var element = document.createElement(tagName[, attributes[, children]])
```

This package is useful when frequently creating DOM nodes on the fly, e.g.:

```js
function makeSpinner(id) {
  const div = document.createElement('div');
  div.id = id;
  div.classList.add('sk-folding-cube');

  const cube1 = document.createElement('div');
  cube1.classList.add('sk-cube1')
  cube1.classList.add('sk-cube')

  const cube2 = document.createElement('div');
  cube2.classList.add('sk-cube2')
  cube2.classList.add('sk-cube')

  const cube3 = document.createElement('div');
  cube3.classList.add('sk-cube3')
  cube3.classList.add('sk-cube')

  const srOnly = document.createElement('span')
  srOnly.classList.add('sr-only');
  srOnly.textContent = 'Loading...';

  div.appendChild(cube1);
  div.appendChild(cube2);
  div.appendChild(cube3);
  div.appendChild(srOnly);

  return div;
}
```

becomes

```js
import 'create-element-x';

function makeSpinner(id) {
  return document.createElement('div', { id, 'class': 'sk-folding-cube' }, [
    document.createElement('div', { 'class': 'sk-cube1 sk-cube' }),
    document.createElement('div', { 'class': 'sk-cube2 sk-cube' }),
    document.createElement('div', { 'class': 'sk-cube3 sk-cube' }),
    document.createElement('span', { 'class': 'sr-only' }, 'Loading...'),
  ]);
}
```

When using babel and `babel-plugin-transform-react-jsx` you can use JSX,
which transpiles to the example above.

```js
/* pragma: document.createElement */

import 'create-element-x';

function makeSpinner(id) {
  return (
    <div id={id} class="sk-folding-cube">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
      <span class="sr-only">Loading...</span>
    </div>
  );
}
```


Instead of setting `pragma` via comment, you can configure babel globally via `.babelrc`:

```json
{
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "document.createElement"
    }]
  ]
}
```

## FAQ
### I don't like monkey-patching...
```js
import { createElement } from 'create-element-x/library'
/* pragma: createElement */
```

### How do I use this without webpack, browserify?
```html
<script src="https://unpkg.com/create-element-x/dist"></script>
```
-- or --

```html
<script src="https://unpkg.com/create-element-x/dist/library.js"></script>
<script>var createElement = createElementExtended.createElement</script>
```

### Type signature?
```ts
function (tagName: string, attributes: object, children: string | Array<Element | string>): Element
```

### How do I use dis with `jsdom` or other DOM implementations?
```js
import { JSDOM } from 'jsdom';
import { createCreateElement } from 'create-element-x/factory';

const { window: { document } } = new JSDOM();

const createElement = createCreateElement(
  tagName => document.createElement(tagName),
  text => document.createTextNode(text),
);
```

### How is this different from `jsx-dom`, `jsx-create-element`, `nativejsx`, and `jsx-foobar`?
This package does less. All I wanted was to create a DOM node.

Here is (almost) the entire source code:

```js
export const createCreateElement = (createElement, createTextNode) => {
  function appendChild(c) {
    if (typeof c === 'string') this.appendChild(createTextNode(c));
    else this.appendChild(c);
  }

  return (tagName, attributes, children) => {
    const el = createElement(tagName);

    for (const attr in attributes) el.setAttribute(attr, attributes[attr]);

    if (children) {
      if (typeof children === 'string') {
        el.appendChild(createTextNode(children));
      } else if (children.length) {
        const copy = Array.prototype.slice.call(children, 0);
        Array.prototype.forEach.call(copy, appendChild, el);
      } else {
        el.appendChild(children);
      }
    }

    return el;
  };
};
```

### Why not jQuery?
Courage.

### Why not React/Vue/Zoidberg?
Because all I wanted was to create a DOM node.

### LOL, the DOM is way to slow to re-render the entire page every time. React has a tree diffing algorithm that only updates the parts of the DOM that have changed, and it's super fast, and everybody should use it, and it's like the Doom 3 rendering engine, and...
Cool.
