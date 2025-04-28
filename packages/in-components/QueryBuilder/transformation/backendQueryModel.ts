/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TagFilterOperator } from '@instana/types';

import {
  CLOSE_BRACKET,
  Conjunction,
  CONJUNCTION,
  FormModelElement,
  OPEN_BRACKET,
  TAG
} from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter, toTagFilter, type as TAG_FILTER_TYPE } from 'in-components/QueryBuilder/transformation/tagFilter';
import { LogicalOperator, Nullish, TagFilter, TagFilterExpression, TagFilterExpressionElementUnion } from 'in-types';
import { EQUALS, GREATER_OR_EQUAL_THAN, LESS_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
import { getNumberTagFilters } from 'in-analyze/components/filterBar/NumberBarItemBehavior/util';
import { deepFreeze } from 'in-services/util/object';

export const EXPRESSION = 'EXPRESSION';

export const OPERATOR_OR = 'OR';
export const OPERATOR_AND = 'AND';
export const OPERATOR_NOT = 'NOT';

export const EMPTY_EXPRESSION = deepFreeze(createTagFilterExpression(OPERATOR_AND, []));

export function toBackendQueryModel(formModel?: FormModelElement[], simplify = true) {
  if (!formModel || formModel.length === 0) {
    return EMPTY_EXPRESSION;
  }
  return parseOrExpression(formModel.slice(), simplify);
}

export function createTagFilterExpression(
  logicalOperator: LogicalOperator,
  elements: TagFilterExpressionElementUnion[]
): TagFilterExpression {
  return {
    type: EXPRESSION,
    logicalOperator,
    elements
  };
}

export function addTagFilters(
  backendQueryModel: TagFilterExpressionElementUnion | Nullish,
  tagFilters: TagFilterExpressionElementUnion[],
  logicalOperator: LogicalOperator = OPERATOR_AND,
  insertToBegin: boolean = false
): TagFilterExpressionElementUnion {
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
    elements: insertToBegin ? [...tagFilters, backendQueryModel!] : [backendQueryModel!, ...tagFilters]
  };
}

export function isEmptyExpression(backendQueryModel: TagFilterExpressionElementUnion | Nullish): boolean {
  return !backendQueryModel || (isTagFilterExpression(backendQueryModel) && backendQueryModel.elements.length === 0);
}

// grammar
// expression := or_expression .
// or_expression := and_expression { "OR" and_expression } .
// and_expression := not_expression { "AND" not_expression } .
// not_expression := ["NOT"] term .
// term := tag | "(" { expression } ")" .

function parseOrExpression(tokens: FormModelElement[], simplify = true): TagFilterExpressionElementUnion {
  const elements: TagFilterExpressionElementUnion[] = [];
  elements.push(parseAndExpression(tokens, simplify));
  let next = peek<FormModelElement>(tokens);
  while (next?.type === CONJUNCTION && (next as Conjunction)?.logicalOperator === OPERATOR_OR) {
    tokens.shift();
    elements.push(parseAndExpression(tokens, simplify));
    next = peek(tokens);
  }
  if (elements.length === 1) {
    return elements[0];
  }
  return createTagFilterExpression(OPERATOR_OR, elements);
}

function parseAndExpression(tokens: FormModelElement[], simplify = true): TagFilterExpressionElementUnion {
  const elements: TagFilterExpressionElementUnion[] = [];
  elements.push(parseNotExpression(tokens, simplify));
  let next = peek<FormModelElement>(tokens);
  while (next?.type === CONJUNCTION && (next as Conjunction)?.logicalOperator === OPERATOR_AND) {
    tokens.shift();
    elements.push(parseNotExpression(tokens, simplify));
    next = peek(tokens);
  }
  if (elements.length === 1) {
    return elements[0];
  }
  return createTagFilterExpression(OPERATOR_AND, elements);
}

// @ts-expect-error waitiong for reply on: https://instana.slack.com/archives/G5LCSUJGY/p1636447650143600
function parseNotExpression(tokens, simplify = true) {
  const next = peek(tokens);
  // @ts-expect-error
  if (next?.type === CONJUNCTION && next?.logicalOperator === OPERATOR_NOT) {
    tokens.shift();
    // @ts-expect-error
    return createTagFilterExpression(OPERATOR_NOT, [parseTerm(tokens, simplify)]);
  }
  return parseTerm(tokens, simplify);
}

function parseTerm(tokens: FormModelElement[], simplify = true): TagFilterExpressionElementUnion {
  const next = tokens.shift();

  if (next?.type === TAG) {
    return toTagFilter(next);
  }
  if (next?.type === OPEN_BRACKET) {
    const next = peek(tokens);
    if (next?.type === CLOSE_BRACKET) {
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
  throw new Error('Unexpected token ' + next?.type);
}

function peek<T>(arr: T[]): T | undefined {
  if (arr.length > 0) {
    return arr[0];
  } else {
    return undefined;
  }
}

interface Range {
  from?: number | null;
  to?: number | null;
}

export function getRangeFromBackendQueryModel(tag: string, backendQueryModel: TagFilterExpressionElementUnion): Range {
  if (isTagFilterExpression(backendQueryModel) && backendQueryModel.logicalOperator === OPERATOR_AND) {
    return getRangeFromFilters(tag, backendQueryModel.elements as TagFilter[]);
  }

  if (isTagFilter(backendQueryModel) && backendQueryModel.name === tag) {
    return getRangeFromFilters(tag, [backendQueryModel]);
  }

  return {};
}

export function getRangeFromFilters(tag: string, tagFilter: TagFilter[]): Range {
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
  let from: Range['from'] = null;
  let to: Range['to'] = null;
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

  const selection: Range = {};

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

type MinMaxFilterType = Omit<TagFilter, 'entity'> | undefined;

interface UpdateRangeArgs {
  tag: string;
  selection: Range;
  backendQueryModel: TagFilterExpressionElementUnion;
  updateFilter: (updateConfig: { add?: MinMaxFilterType[]; remove?: TagFilterExpressionElementUnion[] }) => void;
}

export function updateRange({ tag, selection, backendQueryModel, updateFilter }: UpdateRangeArgs): void {
  const { from, to } = selection;
  const removedFilters = getFiltersToRemove(tag, backendQueryModel);
  let minFilter: MinMaxFilterType;
  let maxFilter: MinMaxFilterType;

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

function getFiltersToRemove(
  tag: string,
  backendQueryModel: TagFilterExpressionElementUnion
): TagFilterExpressionElementUnion[] {
  if (isTagFilterExpression(backendQueryModel) && backendQueryModel.logicalOperator === OPERATOR_AND) {
    return backendQueryModel.elements.filter(element => isTagFilter(element) && element.name === tag);
  }

  if (isTagFilter(backendQueryModel) && backendQueryModel.name === tag) {
    return [backendQueryModel];
  }

  return [];
}

export function getMaximumExpressionDepth(expression: TagFilterExpressionElementUnion): number {
  let max = 0;
  if (isTagFilter(expression)) {
    return 0;
  }

  if (isTagFilterExpression(expression)) {
    expression.elements.filter(isTagFilterExpression).forEach(element => {
      max = Math.max(max, getMaximumExpressionDepth(element));
    });

    max++;
  }
  return max;
}

export function containsTagName(expression: TagFilterExpressionElementUnion, tagName: string): boolean {
  if (!expression || !tagName) {
    return false;
  }

  if (isTagFilter(expression)) {
    return expression.name === tagName;
  }

  if (isTagFilterExpression(expression)) {
    return expression.elements.some(element => containsTagName(element, tagName));
  }

  return false;
}

export function isTagFilterExpression(element: TagFilterExpressionElementUnion): element is TagFilterExpression {
  return element.type === EXPRESSION;
}

export function isTagFilter(element: TagFilterExpressionElementUnion): element is TagFilter {
  return element.type === TAG_FILTER_TYPE;
}

export function invert(element: TagFilterExpressionElementUnion): TagFilterExpressionElementUnion {
  if (isTagFilterExpression(element)) {
    return invertTagFilterExpression(element);
  }

  if (isTagFilter(element)) {
    return invertTagFilter(element);
  }

  throw new Error('Unsupported implementation of TagFilterExpressionElementUnion');
}

function invertTagFilter(filter: TagFilter): TagFilter {
  return tagFilter(filter.name, invertTagFilterOperator(filter.operator), filter.value, filter.key, filter.entity);
}

function invertTagFilterExpression(expression: TagFilterExpression): TagFilterExpression {
  return createTagFilterExpression(
    invertLogicalOperator(expression.logicalOperator),
    expression.elements.map(e => invert(e))
  );
}

function invertLogicalOperator(operator: LogicalOperator): LogicalOperator {
  return operator === 'AND' ? 'OR' : 'AND';
}

function invertTagFilterOperator(operator: TagFilterOperator): TagFilterOperator {
  switch (operator) {
    case 'EQUALS':
      return 'NOT_EQUAL';
    case 'CONTAINS':
      return 'NOT_CONTAIN';
    case 'STARTS_WITH':
      return 'NOT_STARTS_WITH';
    case 'ENDS_WITH':
      return 'NOT_ENDS_WITH';
    case 'IS_BLANK':
      return 'NOT_BLANK';
    case 'IS_EMPTY':
      return 'NOT_EMPTY';
    case 'GREATER_OR_EQUAL_THAN':
      return 'LESS_THAN';
    case 'GREATER_THAN':
      return 'LESS_OR_EQUAL_THAN';
    case 'LESS_OR_EQUAL_THAN':
      return 'GREATER_THAN';
    case 'LESS_THAN':
      return 'GREATER_OR_EQUAL_THAN';
    case 'NOT_EQUAL':
      return 'EQUALS';
    case 'NOT_CONTAIN':
      return 'CONTAINS';
    case 'NOT_STARTS_WITH':
      return 'STARTS_WITH';
    case 'NOT_ENDS_WITH':
      return 'ENDS_WITH';
    case 'NOT_BLANK':
      return 'IS_BLANK';
    case 'NOT_EMPTY':
      return 'IS_EMPTY';
    default: {
      // should be unreachable. Throwing satisfies the compiler.
      throw new Error(`Unsupported operator: ${operator}`);
    }
  }
}
