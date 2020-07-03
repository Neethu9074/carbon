export const ADD_CLOSING_BRACKET = 'ADD_CLOSING_BRACKET';
export const REMOVE_BRACKET = 'REMOVE_BRACKET';
export const CLOSE_BRACKET = 'CLOSE_BRACKET';

export default function validate({ element, index, elements, addSuggestionToElement }) {
  if (index < elements.length - 1) {
    addSuggestionToElement(element, REMOVE_BRACKET);
  }
}
