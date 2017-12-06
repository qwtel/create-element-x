import { createCreateElement } from './factory';

export { createCreateElement };
export const createElement = createCreateElement(document.createElement.bind(document));
export default createElement;
