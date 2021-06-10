/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  TAG as TAG_TYPE,
  OPEN_BRACKET as OPEN_BRACKET_TYPE,
  CLOSE_BRACKET as CLOSE_BRACKET_TYPE,
  CONJUNCTION as CONJUNCTION_TYPE
} from 'in-components/QueryBuilder/transformation/formModel';
import { OPERATOR_NOT, OPERATOR_AND, OPERATOR_OR } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { EXPRESSION, SPACING } from 'in-components/QueryBuilder/transformation/renderModelElementTypes';

export function isExpression(element) {
  return element.type === EXPRESSION;
}

export function isSpacing(element) {
  return element.type === SPACING;
}

export function isOpenBracket(element) {
  return element.type === OPEN_BRACKET_TYPE;
}

export function isCloseBracket(element) {
  return element.type === CLOSE_BRACKET_TYPE;
}

export function isTag(element) {
  return element.type === TAG_TYPE;
}

export function isAndOr(element) {
  return (
    element.type === CONJUNCTION_TYPE &&
    (element.logicalOperator === OPERATOR_OR || element.logicalOperator === OPERATOR_AND)
  );
}

export function isNot(element) {
  return element.type === CONJUNCTION_TYPE && element.logicalOperator === OPERATOR_NOT;
}
