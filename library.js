import { createCreateElement } from "./factory";

export const createElement = createCreateElement(
  document.createElement.bind(document),
  document.createTextNode.bind(document)
);
export default createElement;
