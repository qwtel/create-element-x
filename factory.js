import 'core-js/fn/array/for-each';
import 'core-js/fn/array/is-array';
import 'core-js/fn/object/keys';

export const createCreateElement = (createElement, createTextNode) => {
  function appendChild(c) {
    if (typeof c === 'string') this.appendChild(createTextNode(c));
    else this.appendChild(c);
  }

  return (tagName, attributes, children) => {
    const el = createElement(tagName);

    if (attributes) {
      Object.keys(attributes).forEach(attr => el.setAttribute(attr, attributes[attr]));
    }

    if (children) {
      if (Array.isArray(children)) children.forEach(appendChild, el);
      else appendChild.call(el, children);
    }

    return el;
  };
};

export default createCreateElement;
