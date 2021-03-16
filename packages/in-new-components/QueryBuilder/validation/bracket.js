/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  isOpenBracket,
  isCloseBracket,
  isTag,
  isAndOr,
  isNot,
  isExpression
} from 'in-new-components/QueryBuilder/validation/elementIdentificationHelpers';

export const ADD_CLOSING_BRACKET = 'ADD_CLOSING_BRACKET';
export const REMOVE_BRACKET = 'REMOVE_BRACKET';
export const CLOSE_BRACKET = 'CLOSE_BRACKET';

export function validateOpenBracket({ element, index, elements }) {
  element.valid =
    isPreviousOpenBracketSiblingValid(elements[index - 2]) && isNextOpenBracketSiblingValid(elements[index + 2]);
}

export function validateCloseBracket({ element, index, elements, addSuggestionToElement }) {
  element.valid =
    isPreviousCloseBracketSiblingValid(elements[index - 2]) && isNextCloseBracketSiblingValid(elements[index + 2]);

  if (index < elements.length - 1) {
    addSuggestionToElement(element, REMOVE_BRACKET);
  }
}

export function isPreviousOpenBracketSiblingValid(previous) {
  return !previous || isOpenBracket(previous) || isAndOr(previous) || isNot(previous);
}

export function isNextOpenBracketSiblingValid(next) {
  return next && (isNot(next) || isOpenBracket(next) || isExpression(next) || isTag(next));
}

export function isPreviousCloseBracketSiblingValid(previous) {
  return previous && (isCloseBracket(previous) || isExpression(previous) || isTag(previous));
}

export function isNextCloseBracketSiblingValid(next) {
  return !next || isCloseBracket(next) || isAndOr(next);
}
