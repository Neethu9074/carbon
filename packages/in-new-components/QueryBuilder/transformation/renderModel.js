import {
  CLOSE_BRACKET as CLOSE_BRACKET_TYPE,
  OPEN_BRACKET as OPEN_BRACKET_TYPE,
  CONJUNCTION as CONJUNCTION_TYPE,
  TAG as TAG_TYPE
} from 'in-new-components/QueryBuilder/transformation/formModel';
import validateConjunction from 'in-new-components/QueryBuilder/validation/conjunction';
import validateExpression from 'in-new-components/QueryBuilder/validation/expression';
import validateCloseBracked from 'in-new-components/QueryBuilder/validation/bracket';
import validateSpacing from 'in-new-components/QueryBuilder/validation/spacing';

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
    return [createSpacing(LETTER, 0)];
  }

  return validate(buildExpressionTrees(addRenderModelIndices(addSpacingsAndIncides(formModel))));
}

export function addSpacingsAndIncides(elements) {
  const elementsWithSpacings = [];

  for (let formModelIndex = 0; formModelIndex < elements.length; formModelIndex++) {
    const element = { ...elements[formModelIndex] };
    const nextElement = elements[formModelIndex + 1];

    element.formModelIndex = formModelIndex;
    elementsWithSpacings.push(element);

    if (element.type === OPEN_BRACKET_TYPE || (nextElement && nextElement.type === CLOSE_BRACKET_TYPE)) {
      elementsWithSpacings.push(createSpacing(LETTER, formModelIndex));
    } else if (formModelIndex < elements.length - 1) {
      elementsWithSpacings.push(createSpacing(WORD, formModelIndex));
    }
  }

  // Trailing space to have a standard interaction point.
  elementsWithSpacings.push(createSpacing(LETTER, elements.length - 1));

  return elementsWithSpacings;
}

function addRenderModelIndices(elements) {
  return elements.map((element, i) => {
    element.renderModelIndex = i;
    return element;
  });
}

export function buildExpressionTrees(elements) {
  const expressionTreeStack = [];
  const rootTree = createExpressionTreeNode();
  let currentExpressionTree = rootTree;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.type === OPEN_BRACKET) {
      const newExpressionTree = createExpressionTreeNode();
      currentExpressionTree.elements.push(newExpressionTree);
      currentExpressionTree = newExpressionTree;
      expressionTreeStack.push(currentExpressionTree);
      currentExpressionTree.elements.push(element);
    } else if (element.type === CLOSE_BRACKET) {
      currentExpressionTree.elements.push(element);

      expressionTreeStack.pop();
      currentExpressionTree =
        expressionTreeStack.length > 0 ? expressionTreeStack[expressionTreeStack.length - 1] : rootTree;
    } else {
      currentExpressionTree.elements.push(element);
    }
  }

  return rootTree.elements;
}

export function validate(elements) {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const config = { element, index: i, elements, addSuggestionToElement };

    switch (element.type) {
      case EXPRESSION:
        validate(element.elements);
        validateExpression(config);
        break;
      case CLOSE_BRACKET:
        validateCloseBracked(config);
        break;
      case SPACING:
        validateSpacing(config);
        break;
      case CONJUNCTION:
        validateConjunction(config);
        break;
    }
  }

  return elements;
}

function addSuggestionToElement(element, suggestion) {
  element.valid = false;
  if (element.suggestions) {
    element.suggestions.push({ type: suggestion });
  } else {
    element.suggestions = [{ type: suggestion }];
  }
}

function createSpacing(type, index) {
  return {
    ...type,
    leftFormModelIndex: index,
    rightFormModelIndex: index + 1
  };
}

function createExpressionTreeNode() {
  return {
    type: EXPRESSION,
    elements: []
  };
}
