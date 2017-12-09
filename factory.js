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

export default createCreateElement;
