import {
  isOpenBracket,
  isCloseBracket,
  isTag,
  isAndOr,
  isNot
} from 'in-new-components/QueryBuilder/validation/elementIdentificationHelpers';

export const ADD_CLOSING_BRACKET = 'ADD_CLOSING_BRACKET';
export const REMOVE_BRACKET = 'REMOVE_BRACKET';
export const CLOSE_BRACKET = 'CLOSE_BRACKET';

export function validateOpenBracket() {
  // TODO
}

export function validateCloseBracket({ element, index, elements, addSuggestionToElement }) {
  // if (!isPreviousCloseBracketSiblingValid(elements[index - 1]) || !isNextCloseBracketSiblingValid(elements[index + 1])) {
  //   element.valid = false;
  // }

  if (index < elements.length - 1) {
    addSuggestionToElement(element, REMOVE_BRACKET);
  }
}

export function isPreviousOpenBracketSiblingValid(previous) {
  return !previous || isOpenBracket(previous) || isAndOr(previous) || isNot(previous);
}

export function isNextOpenBracketSiblingValid(next) {
  return next && (isNot(next) || isOpenBracket(next) || isTag(next));
}

export function isPreviousCloseBracketSiblingValid(previous) {
  return previous && (isCloseBracket(previous) || isTag(previous));
}

export function isNextCloseBracketSiblingValid(next) {
  return !next || isCloseBracket(next) || isAndOr(next);
}
