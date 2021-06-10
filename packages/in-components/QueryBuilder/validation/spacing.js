/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TAG, CLOSE_BRACKET, OPEN_BRACKET } from 'in-components/QueryBuilder/transformation/formModel';
import { EXPRESSION } from 'in-components/QueryBuilder/transformation/renderModelElementTypes';

export const ADD_CONJUNCTION = 'ADD_CONJUNCTION';

export default function validate({ element, index, elements, addSuggestionToElement }) {
  const prevElement = elements[index - 1];
  const nextElement = elements[index + 1];

  if (
    prevElement &&
    nextElement &&
    (prevElement.type === TAG || prevElement.type === CLOSE_BRACKET || prevElement.type === EXPRESSION) &&
    (nextElement.type === TAG || nextElement.type === EXPRESSION || nextElement.type === OPEN_BRACKET)
  ) {
    addSuggestionToElement(element, ADD_CONJUNCTION);
  }
}
