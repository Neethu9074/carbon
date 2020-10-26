import { CLOSE_BRACKET, OPEN_BRACKET, TAG, CONJUNCTION } from 'in-new-components/QueryBuilder/transformation/formModel';
import { toTagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';

export const EXPRESSION = 'EXPRESSION';

export const OPERATOR_OR = 'OR';
export const OPERATOR_AND = 'AND';
export const OPERATOR_NOT = 'NOT';

export function toBackendQueryModel(formModel) {
  if (!formModel || formModel.length === 0) {
    return createTagFilterExpression(OPERATOR_OR, []);
  }

  // convert all tag filters in the form model to our desired structure
  formModel = formModel.map(element => (element.type === TAG ? toTagFilter(element) : element));

  // Create levels for brackets
  // [A, AND, NOT, (, B, AND, C, OR, D )] => [A, AND, NOT, [B, AND, C, OR, D]]
  let result = createLevelsForBrackets(formModel, 0, formModel.length, []).levels;

  // Add levels for NOT conjunctions (stronger binding than OR)
  // [A, AND, NOT, [B, AND, C, OR, D]] => [A, AND, [NOT, [B, AND, C, OR, D]]]
  result = addLevelsForNegation(result);

  // Add levels for AND conjunctions (stronger binding than OR)
  // [A, AND, [NOT, [B, AND, C, OR, D]]] => [[A, AND, [NOT, [[B, AND, C], OR, D]]]]
  // [A, OR, B, AND, C] => [A, OR, [B, AND, C]]
  result = addLevelsForAndConjunctions(result);

  // transform conjunction/bracket levels into backend compatible logical expressions
  result = transformLevelsToLogicalExpressions(result);

  return result;
}

export function addTagFilters(backendQueryModel, tagFilters, logicalOperator = OPERATOR_AND) {
  if (isEmptyExpression(backendQueryModel)) {
    if (tagFilters.length == 1) {
      return tagFilters[0];
    }

    return {
      type: EXPRESSION,
      logicalOperator,
      elements: tagFilters
    };
  }
  return {
    type: EXPRESSION,
    logicalOperator,
    elements: [backendQueryModel, ...tagFilters]
  };
}

function isEmptyExpression(backendQueryModel) {
  return !backendQueryModel || (backendQueryModel.type === EXPRESSION && backendQueryModel.elements.length === 0);
}

function createLevelsForBrackets(elements, index, endIndexExclusive, levels) {
  const element = elements[index];

  var nextIndex = index + 1;

  if (element.type === OPEN_BRACKET) {
    const nextStep = createLevelsForBrackets(elements, nextIndex, endIndexExclusive, []);
    levels.push(nextStep.levels);
    nextIndex = nextStep.index + 1;
  } else if (element.type === CLOSE_BRACKET) {
    return {
      levels: levels,
      index: index
    };
  } else {
    levels.push(element);
  }

  if (nextIndex >= endIndexExclusive) {
    return {
      levels: levels,
      nextStep: endIndexExclusive
    };
  }

  return createLevelsForBrackets(elements, nextIndex, endIndexExclusive, levels);
}

function addLevelsForAndConjunctions(elements) {
  let startIndex = -1;
  const result = [];
  const hasNoAndConjunction = !elements.some(e => e.logicalOperator === OPERATOR_AND);

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    if (element.type === CONJUNCTION && element.logicalOperator !== OPERATOR_NOT) {
      if (element.logicalOperator === OPERATOR_OR) {
        if (startIndex >= 0) {
          result.push(
            elements.slice(startIndex, i).map(e => {
              if (e instanceof Array) {
                return addLevelsForAndConjunctions(e);
              } else {
                return e;
              }
            })
          );
        }

        result.push(element);
        startIndex = -1;
      } else if (element.logicalOperator === OPERATOR_AND && startIndex < 0) {
        startIndex = i - 1;
      }
    } else if (hasNoAndConjunction || (startIndex < 0 && elements[i + 1]?.logicalOperator !== OPERATOR_AND)) {
      if (element instanceof Array) {
        result.push(addLevelsForAndConjunctions(element));
      } else {
        result.push(element);
      }
    }
  }

  if (startIndex >= 0) {
    result.push(
      elements.slice(startIndex, elements.length).map(e => {
        if (e instanceof Array) {
          return addLevelsForAndConjunctions(e);
        } else {
          return e;
        }
      })
    );
  }

  return result;
}

function addLevelsForNegation(elements) {
  const result = [];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    if (element.logicalOperator === OPERATOR_NOT) {
      i++;
      let nextElement = elements[i];
      if (nextElement instanceof Array) {
        nextElement = addLevelsForNegation(nextElement);
      }
      result.push([element, nextElement]);
    } else if (element instanceof Array) {
      result.push(addLevelsForNegation(element));
    } else {
      result.push(element);
    }
  }

  return result;
}

function transformLevelsToLogicalExpressions(elements) {
  if (!(elements instanceof Array)) {
    return elements;
  }

  if (elements.length === 1) {
    return transformLevelsToLogicalExpressions(elements[0]);
  }

  const logicalOperator = elements.find(e => e.type === CONJUNCTION).logicalOperator;
  return createTagFilterExpression(
    logicalOperator,
    elements.filter(e => e.type !== CONJUNCTION).map(transformLevelsToLogicalExpressions)
  );
}

function createTagFilterExpression(logicalOperator, elements) {
  return {
    type: EXPRESSION,
    logicalOperator,
    elements
  };
}
