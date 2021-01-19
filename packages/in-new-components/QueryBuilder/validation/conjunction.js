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

export const REMOVE_CONJUNCTION = 'REMOVE_CONJUNCTION';

export default function validate({ element, index, elements, addSuggestionToElement }) {
  if (isNot(element)) {
    element.valid = Boolean(
      isPreviousNotSiblingValid(elements[index - 2]) && isNextNotSiblingValid(elements[index + 2])
    );
  } else {
    element.valid = Boolean(
      isPreviousAndOrSiblingValid(elements[index - 2]) && isNextAndOrSiblingValid(elements[index + 2])
    );
    if (!element.valid) {
      addSuggestionToElement(element, REMOVE_CONJUNCTION);
    }
  }
}

export function isPreviousAndOrSiblingValid(previous) {
  return previous && (isCloseBracket(previous) || isExpression(previous) || isTag(previous));
}

export function isNextAndOrSiblingValid(next) {
  return next && (isOpenBracket(next) || isExpression(next) || isTag(next) || isNot(next));
}

export function isPreviousNotSiblingValid(previous) {
  return !previous || isAndOr(previous) || isOpenBracket(previous);
}

export function isNextNotSiblingValid(next) {
  return next && (isOpenBracket(next) || isExpression(next) || isTag(next));
}
