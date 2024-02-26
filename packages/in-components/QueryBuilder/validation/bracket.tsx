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
  isExpression,
  ADD_CLOSING_BRACKET,
  REMOVE_BRACKET,
  REMOVE_CONJUNCTION,
  MISSING_CLOSING_BRACKET,
  ADD_CONJUNCTION
} from 'in-components/QueryBuilder/validation/elementIdentificationHelpers';
import { Element } from 'in-components/QueryBuilder/validation/elementIdentificationHelpers';

interface SuggestionElement extends Element {
  valid: boolean;
  suggestions?: { type: SuggestionType };
}
interface ValidateOpenBracketProps {
  element: SuggestionElement;
  index: number;
  elements: SuggestionElement[];
}

type SuggestionType =
  | typeof REMOVE_BRACKET
  | typeof REMOVE_CONJUNCTION
  | typeof ADD_CLOSING_BRACKET
  | typeof MISSING_CLOSING_BRACKET
  | typeof ADD_CONJUNCTION;

interface ValidateCloseBracketProps extends ValidateOpenBracketProps {
  addSuggestionToElement: (element: SuggestionElement, suggestion: SuggestionType) => void;
}

export function validateOpenBracket({ element, index, elements }: ValidateOpenBracketProps) {
  element.valid =
    isPreviousOpenBracketSiblingValid(elements[index - 2]) && isNextOpenBracketSiblingValid(elements[index + 2]);
}

export function validateCloseBracket({ element, index, elements, addSuggestionToElement }: ValidateCloseBracketProps) {
  element.valid =
    isPreviousCloseBracketSiblingValid(elements[index - 2]) && isNextCloseBracketSiblingValid(elements[index + 2]);

  if (index < elements.length - 1) {
    addSuggestionToElement(element, REMOVE_BRACKET);
  }
}

export function isPreviousOpenBracketSiblingValid(previous: SuggestionElement | undefined): boolean {
  return !previous || isOpenBracket(previous) || isAndOr(previous) || isNot(previous);
}

export function isNextOpenBracketSiblingValid(next: SuggestionElement | undefined): boolean {
  if (!next) {
    return false;
  }
  return next && (isNot(next) || isOpenBracket(next) || isExpression(next) || isTag(next));
}

export function isPreviousCloseBracketSiblingValid(previous: SuggestionElement | undefined): boolean {
  if (!previous) {
    return false;
  }
  return previous && (isCloseBracket(previous) || isExpression(previous) || isTag(previous));
}

export function isNextCloseBracketSiblingValid(next: SuggestionElement | undefined): boolean {
  return !next || isCloseBracket(next) || isAndOr(next);
}
