# Create Element Extended
Extends the native DOM `document.createElement` method to conform to the target API of JSX transpilation, i.e.

    createElement(tagName [, attributes [, children]])

This is useful when frequently creating DOM nodes on the fly.

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

With `create-element-extended` this becomes:

```js
import 'create-element-extended';

function makeSpinner(id) {
  return document.createElement('div', { id, 'class': 'sk-folding-cube' }, [
    document.createElement('div', { 'class': 'sk-cube1 sk-cube' }),
    document.createElement('div', { 'class': 'sk-cube2 sk-cube' }),
    document.createElement('div', { 'class': 'sk-cube3 sk-cube' }),
    document.createElement('span', { 'class': 'sr-only' }, 'Loading...'),
  ]);
}
```

When usign babel, ...

asdfadsf  `npm` `install` `babel-plugin-transform-react-jsx`

```js
/* pragma: document.createElement */

import 'create-element-extended';

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

Instead of `pragma`, configure babel, e.g. via `.babelrc`:

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
import { createElement } from 'create-element-extended/fn'
/* pragma: createElement */
```

### How do I use dis with `jsdom` or other DOM implementations?
```js
import { JSDOM } from 'jsdom';
import { createCreateElement } from 'create-element-extended/factory';

const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);

const createElement = createCreateElement(
  tagName => dom.window.document.createElement(tagName),
);
```


### Why not jQuery?
Courage.

### Why not React/Vue/Zoidberg?
Because all I wanted was to create a DOM node.

### LOL, the DOM is way to slow to re-render the entire page every time. React has a tree diffing algorithm that only updates the parts of the DOM that have changed, and it's super fast, and everybody should use it, and it's like the Doom 3 rendering engine, and...
Cool.
