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
    if (!isPreviousNotSiblingValid(elements[index - 2])) {
      element.valid = false;
    }

    if (!isNextNotSiblingValid(elements[index + 2])) {
      element.valid = false;
    }
  } else {
    const prevElement = elements[index - 2]; // skipping the space
    if ((!prevElement || (!isTag(prevElement) && !isExpression(prevElement))) && !isNot(element)) {
      addSuggestionToElement(element, REMOVE_CONJUNCTION);
    }
  }
}

export function isPreviousAndOrSiblingValid(previous) {
  return previous && (isCloseBracket(previous) || isTag(previous));
}

export function isNextAndOrSiblingValid(next) {
  return next && (isOpenBracket(next) || isTag(next) || isNot(next));
}

export function isPreviousNotSiblingValid(previous) {
  return !previous || isAndOr(previous) || isOpenBracket(previous);
}

export function isNextNotSiblingValid(next) {
  return next && (isOpenBracket(next) || isExpression(next) || isTag(next));
}
