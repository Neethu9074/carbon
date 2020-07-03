import { EXPRESSION } from 'in-new-components/QueryBuilder/transformation/renderModel';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';

export const REMOVE_CONJUNCTION = 'REMOVE_CONJUNCTION';

export default function validate({ element, index, elements, addSuggestionToElement }) {
  const prevElement = elements[index - 2]; // skipping the space
  if (
    (!prevElement || (prevElement.type !== TAG && prevElement.type !== EXPRESSION)) &&
    element.logicalOperator !== 'NOT'
  ) {
    addSuggestionToElement(element, REMOVE_CONJUNCTION);
  }
}
