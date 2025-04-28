/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// The following ${type}_${operator} combinations require a key to be configure for a tag filter
//
// Missing combinations of ${type}_${operator} fall back to 'false'

export const KEY_VALUE_PAIR_EQUALS = true;
export const KEY_VALUE_PAIR_NOT_EQUAL = true;
export const KEY_VALUE_PAIR_CONTAINS = true;
export const KEY_VALUE_PAIR_NOT_CONTAIN = true;
export const KEY_VALUE_PAIR_NOT_EMPTY = true;
export const KEY_VALUE_PAIR_IS_EMPTY = true;
export const KEY_VALUE_PAIR_IS_BLANK = true;
export const KEY_VALUE_PAIR_NOT_BLANK = true;
export const KEY_VALUE_PAIR_STARTS_WITH = true;
export const KEY_VALUE_PAIR_ENDS_WITH = true;
export const KEY_VALUE_PAIR_REGEX_MATCH = true;

export const KEY_NUMBER_PAIR_EQUALS = true;
export const KEY_NUMBER_PAIR_NOT_EQUAL = true;
export const KEY_NUMBER_PAIR_LESS_THAN = true;
export const KEY_NUMBER_PAIR_GREATER_THAN = true;
export const KEY_NUMBER_PAIR_NOT_EMPTY = true;
export const KEY_NUMBER_PAIR_IS_EMPTY = true;
export const KEY_NUMBER_PAIR_LESS_OR_EQUAL_THAN = true;
export const KEY_NUMBER_PAIR_GREATER_OR_EQUAL_THAN = true;
