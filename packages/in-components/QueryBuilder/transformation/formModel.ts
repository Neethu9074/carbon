/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { findIndex, isEqual } from 'lodash';

import { toNewTagFilterFormat, type as TAG_FILTER_TYPE } from 'in-components/QueryBuilder/transformation/tagFilter';
import { LogicalOperator, TagCatalog, TagFilter, TagFilterExpression, TagFilterExpressionElement } from 'in-types';
import { and, or, not } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';

export const OPEN_BRACKET = 'OPEN_BRACKET';
export const CLOSE_BRACKET = 'CLOSE_BRACKET';
export const TAG = TAG_FILTER_TYPE;
export const CONJUNCTION = 'CONJUNCTION';

export type ElementType = typeof OPEN_BRACKET | typeof CLOSE_BRACKET | typeof TAG | typeof CONJUNCTION;

export interface Conjunction {
  type: typeof CONJUNCTION;
  logicalOperator: typeof and | typeof or | typeof not;
}

export interface Bracket {
  type: typeof OPEN_BRACKET | typeof CLOSE_BRACKET;
}

export type FormModelElement = TagFilter | Conjunction | Bracket;

// This function can be used to transform between the old tag filters model
// we introduced with App 2.0 / websites 2.0 / mobile apps 1.0 in the new
// query builder model. tagFilters in this case is just an array with
// tag filters without any conjunctions.
export function fromTagFiltersArray(tagFilters: TagFilter[], tagCatalog: TagCatalog): FormModelElement[] {
  const doesRequireConversion = tagFilters.some(
    t => t.type == null || t.stringValue != null || t.numberValue != null || t.booleanValue != null
  );
  if (!doesRequireConversion) {
    return tagFilters;
  }

  const formModel: FormModelElement[] = [];
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

export function fromBackendModel(backendModel: TagFilterExpressionElement): FormModelElement[] {
  if (!backendModel) {
    return [];
  }

  if (backendModel.type === TAG) {
    return [backendModel as TagFilter];
  }

  const tagFilterExpression = backendModel as TagFilterExpression;
  if (
    tagFilterExpression.elements.length === 1 &&
    (tagFilterExpression.logicalOperator === and || tagFilterExpression.logicalOperator === or)
  ) {
    return enclose(fromBackendModel(tagFilterExpression.elements[0]));
  }

  const joined = joinExpressions({
    logicalOperator: tagFilterExpression.logicalOperator,
    expressions: tagFilterExpression.elements.map(fromBackendModel)
  });

  return joined;
}

export function joinExpressions({
  logicalOperator = and,
  expressions = []
}: {
  logicalOperator: LogicalOperator;
  expressions: FormModelElement[][];
}): FormModelElement[] {
  const nonEmptyExpressions = expressions
    .map(expression => (Array.isArray(expression) ? expression : [expression]))
    .filter(expression => expression.length > 0);
  if (nonEmptyExpressions.length == 0) {
    return [];
  }
  if (nonEmptyExpressions.length == 1) {
    return nonEmptyExpressions[0];
  }
  const conjunction: Conjunction = { type: CONJUNCTION, logicalOperator };
  const firstExpression = encloseIfNotAlready(nonEmptyExpressions[0]);
  const result = nonEmptyExpressions
    .slice(1)
    .reduce((acc, cur) => [...acc, conjunction, ...encloseIfNotAlready(cur)], firstExpression);
  return result;
}

function encloseIfNotAlready(expression: FormModelElement[]): FormModelElement[] {
  if (isEnclosed(expression)) {
    return expression;
  }
  return enclose(expression);
}

function enclose(expression: FormModelElement[]): FormModelElement[] {
  return [{ type: OPEN_BRACKET }, ...expression, { type: CLOSE_BRACKET }];
}

function isEnclosed(expression: FormModelElement[]): boolean {
  return (
    expression.length === 0 ||
    expression.length === 1 ||
    expression.every(t => t.type === TAG_FILTER_TYPE || ('logicalOperator' in t && t.logicalOperator === and)) ||
    (expression[0].type === OPEN_BRACKET && expression[expression.length - 1].type === CLOSE_BRACKET)
  );
}

const andConjunction = { type: CONJUNCTION, logicalOperator: and };

function removeSingleTopLevelFilter(expression: FormModelElement[], filter: TagFilter): FormModelElement[] {
  const index = indexOfFilter(expression, { ...filter, entity: DESTINATION });
  const operatorIndex = adjacentAndIndex(expression, index);
  return removeSurroundingBrackets(
    expression.filter((_, position) => position !== index && position !== operatorIndex)
  );
}

export function removeTopLevelFilters(expression: FormModelElement[], ...filters: TagFilter[]): FormModelElement[] {
  return filters.reduce((acc, filter) => removeSingleTopLevelFilter(acc, filter), expression);
}

function removeSurroundingBrackets(expression: FormModelElement[]): FormModelElement[] {
  if (
    expression.length > 2 &&
    expression[0].type === OPEN_BRACKET &&
    expression[expression.length - 1].type === CLOSE_BRACKET
  ) {
    return expression.slice(1, expression.length - 1);
  }
  return expression;
}

function indexOfFilter(expression: FormModelElement[], filter: TagFilter): number {
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

function adjacentAndIndex(expression: FormModelElement[], indexOfFilter: number) {
  if (isEqual(expression[indexOfFilter - 1], andConjunction)) {
    return indexOfFilter - 1;
  }
  if (isEqual(expression[indexOfFilter + 1], andConjunction)) {
    return indexOfFilter + 1;
  }
  return undefined;
}
