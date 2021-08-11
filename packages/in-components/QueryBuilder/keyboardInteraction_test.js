/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { expect } from 'chai';
import { spy } from 'sinon';

import { onKeyDown } from 'in-components/QueryBuilder/keyboardInteraction';

jest.mock('@instana/components', () => ({
  ...jest.requireActual('@instana/components'),
  isPrimaryInteractiveElement: e => e.isPrimaryInteractiveElement
}));

describe('in-components/QueryBuilder/keyboardInteraction', () => {
  describe('onKeyDown', () => {
    let stopElement;

    beforeEach(() => {
      stopElement = newElement();
    });

    it('must not stop event bubbling for other keys', () => {
      const first = newInteractiveElement();
      const second = newInteractiveElement();
      addChild(stopElement, first);
      addChild(stopElement, second);

      const event = getEvent(first, 38, 'ArrowUp');
      onKeyDown(event, stopElement);

      expect(first.focus.callCount).to.equal(0);
      expect(second.focus.callCount).to.equal(0);
      expect(event.stopPropagation.callCount).to.equal(0);
      expect(event.preventDefault.callCount).to.equal(0);
    });

    describe('right arrow key', () => {
      it('must focus the next interactive sibling', () => {
        const first = newInteractiveElement();
        const second = newInteractiveElement();
        addChild(stopElement, first);
        addChild(stopElement, second);

        const event = getEvent(first, 39, 'ArrowRight');
        onKeyDown(event, stopElement);

        expect(second.focus.callCount).to.equal(1);
        expect(event.stopPropagation.callCount).to.equal(1);
        expect(event.preventDefault.callCount).to.equal(1);
      });

      it('must not leave the stop element area', () => {
        const first = newInteractiveElement();
        const second = newInteractiveElement();
        addChild(stopElement, first);
        addChild(stopElement, second);

        const event = getEvent(second, 39, 'ArrowRight');
        onKeyDown(event, stopElement);

        expect(first.focus.callCount).to.equal(0);
        expect(second.focus.callCount).to.equal(0);
        expect(event.stopPropagation.callCount).to.equal(1);
        expect(event.preventDefault.callCount).to.equal(1);
      });

      it('must not change focus when the keyboard is used in primary interactive elements', () => {
        const first = newInteractiveElement();
        first.isPrimaryInteractiveElement = true;
        const second = newInteractiveElement();
        addChild(stopElement, first);
        addChild(stopElement, second);

        const event = getEvent(first, 39, 'ArrowRight');
        onKeyDown(event, stopElement);

        expect(first.focus.callCount).to.equal(0);
        expect(second.focus.callCount).to.equal(0);
        expect(event.stopPropagation.callCount).to.equal(0);
        expect(event.preventDefault.callCount).to.equal(0);
      });

      it('must focus the next-next sibling when a non-interactive element comes between them', () => {
        const first = newInteractiveElement();
        const third = newInteractiveElement();
        addChild(stopElement, first);
        addChild(stopElement, newElement());
        addChild(stopElement, third);

        const event = getEvent(first, 39, 'ArrowRight');
        onKeyDown(event, stopElement);

        expect(third.focus.callCount).to.equal(1);
      });

      it('must focus the next child', () => {
        const start = newInteractiveElement();
        const nextSibling = newInteractiveElement();
        const child = newInteractiveElement();
        addChild(stopElement, start);
        addChild(stopElement, nextSibling);
        addChild(start, child);

        const event = getEvent(start, 39, 'ArrowRight');
        onKeyDown(event, stopElement);

        expect(child.focus.callCount).to.equal(1);
      });

      it('must focus the next sibling when at the end of nested content', () => {
        const start = newInteractiveElement();
        const nextSibling = newInteractiveElement();
        const child = newInteractiveElement();
        addChild(stopElement, start);
        addChild(stopElement, nextSibling);
        addChild(start, child);

        const event = getEvent(child, 39, 'ArrowRight');
        onKeyDown(event, stopElement);

        expect(nextSibling.focus.callCount).to.equal(1);
      });
    });

    describe('left arrow key', () => {
      it('must focus the previous interactive sibling', () => {
        const first = newInteractiveElement();
        const second = newInteractiveElement();
        addChild(stopElement, first);
        addChild(stopElement, second);

        const event = getEvent(second, 37, 'ArrowLeft');
        onKeyDown(event, stopElement);

        expect(first.focus.callCount).to.equal(1);
        expect(event.stopPropagation.callCount).to.equal(1);
        expect(event.preventDefault.callCount).to.equal(1);
      });

      it('must not leave the stop element area', () => {
        const first = newInteractiveElement();
        const second = newInteractiveElement();
        addChild(stopElement, first);
        addChild(stopElement, second);

        const event = getEvent(first, 37, 'ArrowLeft');
        onKeyDown(event, stopElement);

        expect(first.focus.callCount).to.equal(0);
        expect(second.focus.callCount).to.equal(0);
        expect(event.stopPropagation.callCount).to.equal(1);
        expect(event.preventDefault.callCount).to.equal(1);
      });

      it('must not change focus when the keyboard is used in primary interactive elements', () => {
        const first = newInteractiveElement();
        const second = newInteractiveElement();
        second.isPrimaryInteractiveElement = true;
        addChild(stopElement, first);
        addChild(stopElement, second);

        const event = getEvent(second, 37, 'ArrowLeft');
        onKeyDown(event, stopElement);

        expect(first.focus.callCount).to.equal(0);
        expect(second.focus.callCount).to.equal(0);
        expect(event.stopPropagation.callCount).to.equal(0);
        expect(event.preventDefault.callCount).to.equal(0);
      });

      it('must focus the previous-previous sibling when a non-interactive element comes between them', () => {
        const first = newInteractiveElement();
        const third = newInteractiveElement();
        addChild(stopElement, first);
        addChild(stopElement, newElement());
        addChild(stopElement, third);

        const event = getEvent(third, 37, 'ArrowLeft');
        onKeyDown(event, stopElement);

        expect(first.focus.callCount).to.equal(1);
      });

      it('must focus the previous child', () => {
        const start = newInteractiveElement();
        const nextSibling = newInteractiveElement();
        const child = newInteractiveElement();
        addChild(stopElement, start);
        addChild(stopElement, nextSibling);
        addChild(start, child);

        const event = getEvent(nextSibling, 37, 'ArrowLeft');
        onKeyDown(event, stopElement);

        expect(child.focus.callCount).to.equal(1);
      });

      it('must focus the parent when at the end of nested content', () => {
        const start = newInteractiveElement();
        const child = newInteractiveElement();
        addChild(stopElement, start);
        addChild(start, child);

        const event = getEvent(child, 37, 'ArrowLeft');
        onKeyDown(event, stopElement);

        expect(start.focus.callCount).to.equal(1);
      });
    });
  });
});

function getEvent(target, keyCode, code) {
  return {
    keyCode,
    code,
    target,
    stopPropagation: spy(),
    preventDefault: spy()
  };
}

function newInteractiveElement() {
  return {
    ...newElement(),
    tabIndex: 0,
    dataset: {
      queryBuilderElement: 'true'
    }
  };
}

function newElement() {
  return {
    parentNode: undefined,
    previousSibling: undefined,
    nextSibling: undefined,
    childNodes: [],
    focus: spy(),
    dataset: {},
    tabIndex: undefined,
    isPrimaryInteractiveElement: false
  };
}

function addChild(parent, child) {
  const lastNode = parent.childNodes[parent.childNodes.length - 1];
  if (lastNode) {
    lastNode.nextSibling = child;
    child.previousSibling = lastNode;
  }
  parent.childNodes.push(child);
  child.parentNode = parent;
}
