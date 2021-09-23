/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';

const firstElement = document.createElement('a') as HTMLAnchorElement;
const lastElement = document.createElement('button') as HTMLButtonElement;
const parentDivElement = document.createElement('div') as HTMLDivElement;

function mockChildrenOfParentDivElement() {
  return () => {
    return [firstElement, lastElement];
  };
}

jest.mock('in-services/util/dom', () => ({
  getInteractiveElements: jest.fn(mockChildrenOfParentDivElement())
}));

function getKeyboardEvent(keyCode: number, target: HTMLElement) {
  const event = new KeyboardEvent('keydown', { keyCode });
  Object.defineProperty(event, 'target', {
    get: () => target
  });
  Object.defineProperty(event, 'currentTarget', {
    get: () => parentDivElement
  });
  return event;
}

describe('in-services/util/domFocus', () => {
  describe('onArrowKeyDownFocusSiblings', () => {
    it('should return the next element on arrow–down', () => {
      const arrowDownKeyboardEvent = getKeyboardEvent(40, firstElement);
      const element = onArrowKeyDownFocusSiblings(arrowDownKeyboardEvent);
      expect(element).toBe(lastElement);
    });

    it('should return the previous element on arrow–up', () => {
      const arrowDownKeyboardEvent = getKeyboardEvent(38, lastElement);
      const element = onArrowKeyDownFocusSiblings(arrowDownKeyboardEvent);
      expect(element).toBe(firstElement);
    });

    it('should return the undefined if the keyboardEvent is not an arrow key', () => {
      const unknownDownKeyboardEvent = getKeyboardEvent(9999, firstElement);
      const element = onArrowKeyDownFocusSiblings(unknownDownKeyboardEvent);
      expect(element).toBeUndefined();
    });

    it('should return the first element if the arrow up happens on the first element', () => {
      const arrowUpKeyboardEvent = getKeyboardEvent(38, firstElement);
      const element = onArrowKeyDownFocusSiblings(arrowUpKeyboardEvent);
      expect(element).toBe(firstElement);
    });

    it('should return the last element if the arrow down happens on the last element', () => {
      const arrowUpKeyboardEvent = getKeyboardEvent(40, lastElement);
      const element = onArrowKeyDownFocusSiblings(arrowUpKeyboardEvent);
      expect(element).toBe(lastElement);
    });
  });
});
