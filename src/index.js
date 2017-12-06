import { createCreateElement } from './factory';

export { createCreateElement };
export const nativeCreateElement = document.createElement;
document.createElement = createCreateElement(nativeCreateElement.bind(document));
