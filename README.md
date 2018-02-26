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
Import the library funtion instead:
```js
/* pragma: createElement */
import { createElement } from 'create-element-x/library'
```

### How do I use this without webpack, browserify?
Monkey-patch:
```html
<script src="https://unpkg.com/create-element-x/dist/index.min.js"></script>
```

Library:
```html
<script src="https://unpkg.com/create-element-x/dist/library.min.js"></script>
<script>
  const { createElement } = window.createElementX;
  createElement('div', { id, 'class': 'sk-folding-cube' });
  // ...
</script>
```

### Type signature?
```ts
function (tagName: string, attributes: object, children: string | Array<Element | string>): Element
```

### How do I use this with `jsdom` or other DOM implementations?
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
This package does less. All it does is to create a DOM node.

### Why not jQuery?
Courage.
