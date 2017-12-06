import { createCreateElement } from './factory';

export const createElement = createCreateElement(document.createElement.bind(document));
export default createElement;
