/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LogicalOperator } from '@instana/types';

import {
  TAG as TAG_TYPE,
  OPEN_BRACKET as OPEN_BRACKET_TYPE,
  CLOSE_BRACKET as CLOSE_BRACKET_TYPE,
  CONJUNCTION as CONJUNCTION_TYPE
} from 'in-components/QueryBuilder/transformation/formModel';
import { OPERATOR_NOT, OPERATOR_AND, OPERATOR_OR } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { EXPRESSION, SPACING } from 'in-components/QueryBuilder/transformation/renderModelElementTypes';
import { not } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { ElementType } from 'in-components/QueryBuilder/transformation/formModel';

export type FormElementType = ElementType | typeof EXPRESSION | typeof SPACING;
export interface Element {
  type: FormElementType;
  logicalOperator?: LogicalOperator | typeof not;
}

export function isExpression(element: Element): boolean {
  return element.type === EXPRESSION;
}

export function isSpacing(element: Element): boolean {
  return element.type === SPACING;
}

export function isOpenBracket(element: Element): boolean {
  return element.type === OPEN_BRACKET_TYPE;
}

export function isCloseBracket(element: Element): boolean {
  return element.type === CLOSE_BRACKET_TYPE;
}

export function isTag(element: Element): boolean {
  return element.type === TAG_TYPE;
}

export function isAndOr(element: Element): boolean {
  return (
    element.type === CONJUNCTION_TYPE &&
    (element.logicalOperator === OPERATOR_OR || element.logicalOperator === OPERATOR_AND)
  );
}

export function isNot(element: Element): boolean {
  return element.type === CONJUNCTION_TYPE && element.logicalOperator === OPERATOR_NOT;
}
