/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CLOSE_BRACKET, ADD_CLOSING_BRACKET } from 'in-components/QueryBuilder/validation/bracket';
export const MISSING_CLOSING_BRACKET = 'MISSING_CLOSING_BRACKET';

export default function validate({ element, addSuggestionToElement }) {
  const lastElement = element.elements[element.elements.length - 1];
  if (lastElement && lastElement.type !== CLOSE_BRACKET) {
    addSuggestionToElement(lastElement, ADD_CLOSING_BRACKET);
    addSuggestionToElement(element, MISSING_CLOSING_BRACKET);
  }
}
