/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { EXPRESSION, SPACING } from 'in-components/QueryBuilder/transformation/renderModelElementTypes';
import { not } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { ElementType } from 'in-components/QueryBuilder/transformation/formModel';
import { LogicalOperator } from 'in-types';

export type FormElementType = ElementType | typeof EXPRESSION | typeof SPACING;
export interface Element {
  type: FormElementType;
  logicalOperator?: LogicalOperator | typeof not;
}

export function isOpenBracket(element: Element): boolean;
export function isCloseBracket(element: Element): boolean;
export function isTag(element: Element): boolean;
export function isAndOr(element: Element): boolean;
export function isNot(element: Element): boolean;
export function isExpression(element: Element): boolean;

export const ADD_CLOSING_BRACKET: string;
export const REMOVE_BRACKET: string;
export const CLOSE_BRACKET: string;
export const REMOVE_CONJUNCTION: string;
export const MISSING_CLOSING_BRACKET: string;
export const ADD_CONJUNCTION: string;
