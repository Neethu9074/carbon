import { isEqual, findIndex } from 'lodash';

import { type as TAG_FILTER_TYPE, toNewTagFilterFormat } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
export const OPEN_BRACKET = 'OPEN_BRACKET';
export const CLOSE_BRACKET = 'CLOSE_BRACKET';
export const TAG = TAG_FILTER_TYPE;
export const CONJUNCTION = 'CONJUNCTION';

// This function can be used to transform between the old tag filters model
// we introduced with App 2.0 / websites 2.0 / mobile apps 1.0 in the new
// query builder model. tagFilters in this case is just an array with
// tag filters without any conjunctions.
export function fromTagFiltersArray(tagFilters, tagCatalog) {
  const doesRequireConversion = tagFilters.some(
    t => t.type == null || t.stringValue != null || t.numberValue != null || t.booleanValue != null
  );
  if (!doesRequireConversion) {
    return tagFilters;
  }

  const formModel = [];
  for (const tagFilter of tagFilters) {
    if (formModel.length > 0) {
      formModel.push({
        type: CONJUNCTION,
        logicalOperator: and
      });
    }
    formModel.push(toNewTagFilterFormat(tagFilter, tagCatalog));
  }
  return formModel;
}

export function joinExpressions(left, right, logicalOperator = and) {
  if (left.length === 0) {
    return right;
  }

  if (right.length === 0) {
    return left;
  }

  const conjunction = { type: CONJUNCTION, logicalOperator };

  return [...enclose(left), conjunction, ...enclose(right)];
}

function enclose(expression) {
  if (isEnclosed(expression)) {
    return expression;
  }
  return [{ type: OPEN_BRACKET }, ...expression, { type: CLOSE_BRACKET }];
}

function isEnclosed(expression) {
  return (
    expression.length === 0 ||
    expression.length === 1 ||
    expression.every(t => t.type === TAG_FILTER_TYPE || (t.type === CONJUNCTION && t.logicalOperator === and)) ||
    (expression[0].type === OPEN_BRACKET && expression[expression.length - 1].type === CLOSE_BRACKET)
  );
}

const andConjunction = { type: CONJUNCTION, logicalOperator: and };

export function expressionWithoutFilter(expression, filter) {
  const index = indexOfFilter(expression, { entity: DESTINATION, ...filter });
  const operatorIndex = adjascentAndIndex(expression, index);
  return removeSurroundingParenthesis(
    expression.filter((_, position) => position !== index && position !== operatorIndex)
  );
}

function removeSurroundingParenthesis(expression) {
  if (
    expression.length > 2 &&
    expression[0].type === OPEN_BRACKET &&
    expression[expression.length - 1].type === CLOSE_BRACKET
  ) {
    return expression.slice(1, expression.length - 1);
  }
  return expression;
}

function indexOfFilter(expression, filter) {
  let level = 0;
  return findIndex(expression, element => {
    if (element.type === OPEN_BRACKET) {
      level++;
    }
    if (element.type === CLOSE_BRACKET) {
      level--;
    }
    return level === 0 && isEqual({ entity: DESTINATION, ...element }, filter);
  });
}

function adjascentAndIndex(expression, indexOfFilter) {
  if (isEqual(expression[indexOfFilter - 1], andConjunction)) {
    return indexOfFilter - 1;
  }
  if (isEqual(expression[indexOfFilter + 1], andConjunction)) {
    return indexOfFilter + 1;
  }
  return undefined;
}
