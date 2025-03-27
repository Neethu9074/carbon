/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TagType } from 'in-types';

export const BOOLEAN: TagType = 'BOOLEAN';
export const STRING: TagType = 'STRING';
export const NUMBER: TagType = 'NUMBER';
// Set of values (no duplicates, and no guarantees concerning order of iteration)
export const STRING_SET: TagType = 'STRING_SET';
// Ordered list.
export const STRING_LIST: TagType = 'STRING_LIST';
export const KEY_VALUE_PAIR: TagType = 'KEY_VALUE_PAIR';
export const KEY_NUMBER_PAIR: TagType = 'KEY_NUMBER_PAIR';
export const FLOAT_LIST: TagType = 'FLOAT_LIST';
