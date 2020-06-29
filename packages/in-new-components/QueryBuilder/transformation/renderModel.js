import {
  CLOSE_BRACKET as CLOSE_BRACKET_TYPE,
  OPEN_BRACKET as OPEN_BRACKET_TYPE,
  CONJUNCTION as CONJUNCTION_TYPE,
  TAG as TAG_TYPE
} from 'in-new-components/QueryBuilder/transformation/formModel';

export const CLOSE_BRACKET = CLOSE_BRACKET_TYPE;
export const OPEN_BRACKET = OPEN_BRACKET_TYPE;
export const CONJUNCTION = CONJUNCTION_TYPE;
export const TAG = TAG_TYPE;
export const EXPRESSION = 'EXPRESSION';
export const SPACING = 'SPACING';

export const LETTER = {
  type: SPACING,
  size: 'LETTER'
};

export const WORD = {
  type: SPACING,
  size: 'WORD'
};

export function toRenderModel(formModel) {
  if (!formModel || formModel.length === 0) {
    return [];
  }

  return addSpacingsAndIncides(formModel);
}

export function addSpacingsAndIncides(elements) {
  const elementsWithSpacings = [];

  for (let formModelIndex = 0; formModelIndex < elements.length; formModelIndex++) {
    const element = elements[formModelIndex];
    const nextElement = elements[formModelIndex + 1];

    element.formModelIndex = formModelIndex;
    elementsWithSpacings.push(element);

    if (element.type === OPEN_BRACKET_TYPE || (nextElement && nextElement.type === CLOSE_BRACKET_TYPE)) {
      elementsWithSpacings.push(createSpacing(LETTER, formModelIndex));
    } else if (formModelIndex < elements.length - 1) {
      elementsWithSpacings.push(createSpacing(WORD, formModelIndex));
    }
  }

  return elementsWithSpacings;
}

function createSpacing(type, index) {
  return {
    ...type,
    leftFormModelIndex: index,
    rightFormModelIndex: index + 1
  };
}
