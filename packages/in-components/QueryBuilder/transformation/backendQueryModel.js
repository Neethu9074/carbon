/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CLOSE_BRACKET, OPEN_BRACKET, TAG, CONJUNCTION } from 'in-components/QueryBuilder/transformation/formModel';
import { GREATER_OR_EQUAL_THAN, LESS_THAN, EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getNumberTagFilters } from 'in-analyze/components/filterBar/NumberBarItemBehavior/util';
import { type as TAG_FILTER_TYPE } from 'in-components/QueryBuilder/transformation/tagFilter';
import { toTagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { deepFreeze } from 'in-services/util/object';

export const EXPRESSION = 'EXPRESSION';

export const OPERATOR_OR = 'OR';
export const OPERATOR_AND = 'AND';
export const OPERATOR_NOT = 'NOT';

export const EMPTY_EXPRESSION = deepFreeze(createTagFilterExpression(OPERATOR_AND, []));

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

export function getRangeFromBackendQueryModel(tag, backendQueryModel) {
  if (backendQueryModel.type === EXPRESSION && backendQueryModel.logicalOperator === OPERATOR_AND) {
    return getRangeFromFilters(tag, backendQueryModel.elements);
  }
  if (backendQueryModel.type === TAG_FILTER_TYPE && backendQueryModel.name === tag) {
    return getRangeFromFilters(tag, [backendQueryModel]);
  }
}

export function getRangeFromFilters(tag, tagFilter) {
  // find the most significant filters for each operator type, e.g.
  // call.latency > 2 is more significant than call.latency > 1
  const filters = getNumberTagFilters({
    tagFilters: tagFilter,
    tag,
    showRange: true,
    showEquality: true
  });

  if (filters.neq) {
    // don't support selection when filter with "!=" is used
    return {};
  }

  // values can come as numbers or/and strings
  let from = null;
  let to = null;
  if (filters.lt) {
    to = parseInt(filters.lt.value);
  } else if (filters.lte) {
    to = parseInt(filters.lte.value) + 1;
  }
  if (filters.gt) {
    from = Math.max(0, parseInt(filters.gt.value) + 1);
  } else if (filters.gte) {
    from = parseInt(filters.gte.value);
  }

  const selection = {};

  if (filters.eq) {
    if (!from && !to) {
      selection.from = parseInt(filters.eq.value);
      if (selection.from === 0) {
        // filter is "equals 0", should clear faceted search
        return {};
      }
      // the upper bound is specified as strict inequality (<), need to increment it by 1
      selection.to = selection.from + 1;
    }
  } else if (from == null || to == null || from < to) {
    if (from != null) {
      selection.from = from;
    }
    if (to != null) {
      selection.to = to;
    }
  }
  return selection;
}

export function updateRange({ tag, selection, backendQueryModel, updateFilter }) {
  const { from, to } = selection;
  const removedFilters = getFiltersToRemove(tag, backendQueryModel);
  let minFilter, maxFilter;
  if (typeof from === 'number') {
    minFilter = {
      type: TAG,
      name: tag,
      operator: GREATER_OR_EQUAL_THAN,
      value: from
    };
  }
  if (typeof to === 'number') {
    maxFilter = {
      type: TAG,
      name: tag,
      operator: LESS_THAN,
      value: to
    };
  }
  if (minFilter && maxFilter) {
    if (minFilter.value === maxFilter.value) {
      updateFilter({
        add: [
          {
            type: TAG,
            name: tag,
            operator: EQUALS,
            value: from
          }
        ],
        remove: removedFilters
      });
    } else {
      updateFilter({
        add: [minFilter, maxFilter],
        remove: removedFilters
      });
    }
  } else if (minFilter) {
    updateFilter({
      add: [minFilter],
      remove: removedFilters
    });
  } else if (maxFilter) {
    updateFilter({
      add: [maxFilter],
      remove: removedFilters
    });
  } else {
    updateFilter({
      remove: removedFilters
    });
  }
}

function getFiltersToRemove(tag, backendQueryModel) {
  if (backendQueryModel.type === EXPRESSION && backendQueryModel.logicalOperator === OPERATOR_AND) {
    return backendQueryModel.elements.filter(element => element.type === TAG_FILTER_TYPE && element.name === tag);
  } else if (backendQueryModel.type === TAG_FILTER_TYPE && backendQueryModel.name === tag) {
    return [backendQueryModel];
  }
}

export function getMaximumExpressionDepth(expression) {
  let max = 0;
  if (expression.type !== EXPRESSION) {
    return 0;
  }

  expression.elements
    .filter(element => element.type === EXPRESSION)
    .forEach(element => {
      max = Math.max(max, getMaximumExpressionDepth(element));
    });
  return max + 1;
}

export function containsTagName(expression, tagName) {
  if (!expression || !tagName) {
    return false;
  }

  if (expression.type !== EXPRESSION) {
    return expression.name === tagName;
  }

  return expression.elements.some(element => containsTagName(element, tagName));
}
