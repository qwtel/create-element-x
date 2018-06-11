const isArray = Array.isArray
  || (arg => Object.prototype.toString.call(arg) === '[object Array]');
const isHTMLCollection = arg =>
  Object.prototype.toString.call(arg) === '[object HTMLCollection]';
const isNodeList = arg =>
  Object.prototype.toString.call(arg) === '[object NodeList]';

export const createCreateElement = (createElement, createTextNode) => {
  function appendChild(c) {
    if (typeof c === 'string') this.appendChild(createTextNode(c));
    else this.appendChild(c);
  }

  return (tagName, attributes, ...children) => {
    const el = createElement(tagName);

    for (const attr in attributes) el.setAttribute(attr, attributes[attr]);

    // Support old JSX sytax that wraps children in an array,
    // as 3rd parameter.
    let cs = children[0];
    let shouldCopy;
    if (isArray(cs)
      || (shouldCopy = isHTMLCollection(cs))
      || (shouldCopy = isNodeList(cs))
    ) {
      // In case use user provides a `NodeList` or `HTMLCollection`,
      // appening will have the effect of removing the item the current
      // collection, which in turn will cause problems which `forEach`.
      // So we create a copy frist:
      if (shouldCopy) {
        cs = Array.prototype.slice.call(cs, 0);
      }
      Array.prototype.forEach.call(cs, appendChild, el);

    // Support new JSX syntax, where each child is an additional
    // function parameter.
    } else {
      Array.prototype.forEach.call(children, (child) => {
        if (typeof child === 'string') {
          el.appendChild(createTextNode(child));
        } else {
          el.appendChild(child);
        }
      });
    }

    return el;
  };
};

export default createCreateElement;
