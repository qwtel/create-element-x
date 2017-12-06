import { createCreateElement } from './factory';

export const nativeCreateElement = document.createElement;
document.createElement = createCreateElement(nativeCreateElement.bind(document));
export const createElement = document.createElement.bind(document);
export default createElement;
