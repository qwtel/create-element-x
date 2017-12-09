/* eslint-env node, mocha */
/* eslint-disable arrow-body-style, function-paren-newline, one-var, one-var-declaration-per-line */

require('babel-polyfill');

const { createCreateElement } = require('../factory.js');

const { JSDOM } = require('jsdom');

const { window: { document } } = new JSDOM();

const createElement = createCreateElement(
  tagName => document.createElement(tagName),
  text => document.createTextNode(text),
);

const assert = require('assert');

describe('Create Element Extended', () => {
  it('should exist', () => {
    assert(createElement);
  });

  it('should create a simple element', () => {
    const div = createElement('div');
    const span = createElement('span');
    const option = createElement('option');
    assert.equal(div.tagName, 'DIV');
    assert.equal(span.tagName, 'SPAN');
    assert.equal(option.tagName, 'OPTION');
  });

  it('should set attributes', () => {
    const div = createElement('div', { id: 'test', class: 'test1 test2' });
    assert.equal(div.id, 'test');
    assert(div.classList.contains('test1'));
    assert(div.classList.contains('test2'));
  });

  it('should set data attributes', () => {
    const div = createElement('div', { 'data-foo': 'bar' });
    assert.equal(div.dataset.foo, 'bar');
  });

  it('should append a child', () => {
    const child = createElement('span');
    const div = createElement('div', null, child);
    assert.equal(div.children.length, 1);
    assert.equal(div.children[0], child);
  });

  it('should append multiple children', () => {
    const div = createElement('div', null, [
      createElement('span', { id: 'span-1' }),
      createElement('span', { id: 'span-2' }),
      createElement('span', { id: 'span-3' }),
    ]);
    assert.equal(div.children.length, 3);
    assert.equal(div.children[0].id, 'span-1');
    assert.equal(div.children[1].id, 'span-2');
    assert.equal(div.children[2].id, 'span-3');
  });

  it('should nest deep', () => {
    const div = createElement('div', null,
      createElement('div', null, [
        createElement('div', null, [
          createElement('div', null, [
            createElement('div', null, [
              createElement('div', null, [
                createElement('div'),
              ]),
            ]),
          ]),
        ]),
      ]),
    );
    assert(div.children.length);
    assert(div.children[0].children.length);
    assert(div.children[0].children[0].children.length);
    assert(div.children[0].children[0].children[0].children.length);
    assert(div.children[0].children[0].children[0].children[0].children.length);
    assert(div.children[0].children[0].children[0].children[0].children[0].children.length);
  });

  it('should append a text node', () => {
    const span = createElement('div', null, 'Text');
    assert.equal(span.textContent, 'Text');
  });

  it('should append multiple text nodes', () => {
    const span = createElement('div', null, ['Hello', ', ', 'World']);
    assert.equal(span.textContent, 'Hello, World');
    assert.equal(span.childNodes.length, 3);
  });

  it('should append text nodes and element nodes', () => {
    const div = createElement('div', null, [
      createElement('span', null, 'Hello'),
      ', ',
      createElement('span', null, 'World'),
    ]);
    assert.equal(div.childNodes.length, 3);
    assert.equal(div.childNodes[0].textContent, 'Hello');
    assert.equal(div.childNodes[1].textContent, ', ');
    assert.equal(div.childNodes[2].textContent, 'World');
  });

  describe('NodeList', () => {
    let div, div2;
    before(() => {
      div = createElement('div', null, [
        createElement('span', { id: 'span-1' }),
        createElement('span', { id: 'span-2' }),
        createElement('span', { id: 'span-3' }),
      ]);
      div2 = createElement('div', null, div.querySelectorAll('span'));
    });

    it('should allow passing a NodeList as children', () => {
      assert.equal(div2.children.length, 3);
    });

    it('should preserve order', () => {
      assert.equal(div2.children[0].id, 'span-1');
      assert.equal(div2.children[1].id, 'span-2');
      assert.equal(div2.children[2].id, 'span-3');
    });

    it('should detach nodes form the original node', () => {
      assert.equal(div.children.length, 0);
    });
  });

  describe('HTMLCollection', () => {
    let div, div2;
    before(() => {
      div = createElement('div', null, [
        createElement('span', { id: 'span-1' }),
        createElement('span', { id: 'span-2' }),
        createElement('span', { id: 'span-3' }),
      ]);
      div2 = createElement('div', null, div.children);
    });

    it('should allow passing a HTMLCollection as children', () => {
      assert.equal(div2.children.length, 3);
    });

    it('should preserve order', () => {
      assert.equal(div2.children[0].id, 'span-1');
      assert.equal(div2.children[1].id, 'span-2');
      assert.equal(div2.children[2].id, 'span-3');
    });

    it('should detach nodes form the original node', () => {
      assert.equal(div.children.length, 0);
    });
  });
});
