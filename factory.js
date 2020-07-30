const isArray =
  Array.isArray ||
  (arg => Object.prototype.toString.call(arg) === "[object Array]");
const isHTMLCollection = arg =>
  Object.prototype.toString.call(arg) === "[object HTMLCollection]";
const isNodeList = arg =>
  Object.prototype.toString.call(arg) === "[object NodeList]";

const RE_HANDLER = /on([A-Z][A-Za-z]+)/;

export const createCreateElement = (createElement, createTextNode) => {
  function appendChild(c) {
    if (typeof c === "string") this.appendChild(createTextNode(c));
    else if (c != null) this.appendChild(c);
  }

  return (tagName, attributes, ...children) => {
    const el = createElement(tagName);

    for (const attr in attributes) {
      let res;
      if (res = RE_HANDLER.exec(attr)) {
        const [, eventName] = res;
        el.addEventListener(eventName.toLowerCase(), attributes[attr]);
      } else {
        el.setAttribute(attr, attributes[attr]);
      }
    }

    // Support old JSX syntax that wraps children in an array,
    // as 3rd parameter.
    let cs = children[0];
    let shouldCopy;
    if (
      isArray(cs) ||
      (shouldCopy = isHTMLCollection(cs)) ||
      (shouldCopy = isNodeList(cs))
    ) {
      // In case use user provides a `NodeList` or `HTMLCollection`,
      // appending will have the effect of removing the item the current
      // collection, which in turn will cause problems which `forEach`.
      // So we create a copy first:
      if (shouldCopy) {
        cs = Array.prototype.slice.call(cs, 0);
      }
      Array.prototype.forEach.call(cs, appendChild, el);
    } else {
      // Support new JSX syntax, where each child is an additional
      // function parameter.
      Array.prototype.forEach.call(children, appendChild, el);
    }

    return el;
  };
};

export default createCreateElement;
