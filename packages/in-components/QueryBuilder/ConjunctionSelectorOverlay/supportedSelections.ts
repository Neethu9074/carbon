/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LogicalOperator } from 'in-types';

export const and: LogicalOperator = 'AND';
export const or: LogicalOperator = 'OR';
export const not = 'NOT';
export const openBracket = '(';
export const closeBracket = ')';
export const clear = '';

export type ConjunctionSelectorSelection =
  | LogicalOperator
  | typeof not
  | typeof openBracket
  | typeof closeBracket
  | typeof clear;
