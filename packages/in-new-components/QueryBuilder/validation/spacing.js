import { EXPRESSION } from 'in-new-components/QueryBuilder/transformation/renderModelElementTypes';
import { TAG, CLOSE_BRACKET } from 'in-new-components/QueryBuilder/transformation/formModel';

export const ADD_CONJUNCTION = 'ADD_CONJUNCTION';

export default function validate({ element, index, elements, addSuggestionToElement }) {
  const prevElement = elements[index - 1];
  const nextElement = elements[index + 1];

  if (
    prevElement &&
    nextElement &&
    (prevElement.type === TAG || prevElement.type === CLOSE_BRACKET || prevElement.type === EXPRESSION) &&
    nextElement.type === TAG
  ) {
    addSuggestionToElement(element, ADD_CONJUNCTION);
  }
}
