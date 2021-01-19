/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { CLOSE_BRACKET, OPEN_BRACKET, TAG, CONJUNCTION } from 'in-new-components/QueryBuilder/transformation/formModel';
import { toTagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { deepFreeze } from 'in-services/util/object';

export const EXPRESSION = 'EXPRESSION';

export const OPERATOR_OR = 'OR';
export const OPERATOR_AND = 'AND';
export const OPERATOR_NOT = 'NOT';

export const EMPTY_EXPRESSION = deepFreeze(createTagFilterExpression(OPERATOR_OR, []));

export function toBackendQueryModel(formModel, simplify = true) {
  if (!formModel || formModel.length === 0) {
    return EMPTY_EXPRESSION;
  }
  return parseOrExpression(formModel.slice(), simplify);
}

export function createTagFilterExpression(logicalOperator, elements) {
  return {
    type: EXPRESSION,
    logicalOperator,
    elements
  };
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

// grammar
// expression := or_expression .
// or_expression := and_expression { "OR" and_expression } .
// and_expression := not_expression { "AND" not_expression } .
// not_expression := ["NOT"] term .
// term := tag | "(" { expression } ")" .

function parseOrExpression(tokens, simplify = true) {
  const elements = [];
  elements.push(parseAndExpression(tokens, simplify));
  let next = peek(tokens);
  while (next?.type === CONJUNCTION && next?.logicalOperator === OPERATOR_OR) {
    tokens.shift();
    elements.push(parseAndExpression(tokens, simplify));
    next = peek(tokens);
  }
  if (elements.length === 1) {
    return elements[0];
  }
  return createTagFilterExpression(OPERATOR_OR, elements);
}

function parseAndExpression(tokens, simplify = true) {
  const elements = [];
  elements.push(parseNotExpression(tokens, simplify));
  let next = peek(tokens);
  while (next?.type === CONJUNCTION && next?.logicalOperator === OPERATOR_AND) {
    tokens.shift();
    elements.push(parseNotExpression(tokens, simplify));
    next = peek(tokens);
  }
  if (elements.length === 1) {
    return elements[0];
  }
  return createTagFilterExpression(OPERATOR_AND, elements);
}

function parseNotExpression(tokens, simplify = true) {
  const next = peek(tokens);
  if (next?.type === CONJUNCTION && next?.logicalOperator === OPERATOR_NOT) {
    tokens.shift();
    return createTagFilterExpression(OPERATOR_NOT, [parseTerm(tokens, simplify)]);
  }
  return parseTerm(tokens, simplify);
}

function parseTerm(tokens, simplify = true) {
  const next = tokens.shift();
  if (next.type === TAG) {
    return toTagFilter(next);
  }
  if (next.type === OPEN_BRACKET) {
    const next = peek(tokens);
    if (next.type === CLOSE_BRACKET) {
      return EMPTY_EXPRESSION;
    }
    const term = parseOrExpression(tokens, simplify);
    if (tokens.shift()?.type !== CLOSE_BRACKET) {
      throw new Error('Expected close bracket');
    }
    if (simplify) {
      return term;
    }
    return createTagFilterExpression(OPERATOR_AND, [term]);
  }
  throw new Error('Unexpected token ' + next.type);
}

function peek(arr) {
  if (arr.length > 0) {
    return arr[0];
  } else {
    return undefined;
  }
}
