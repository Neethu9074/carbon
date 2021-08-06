/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { List, Set, Map } from 'immutable';

// We should create empty Lists, Maps, Sets only once and cache them. This
// is important for two important reasons:
//
//  - Reduce GC pressure by creating less temporary objects.
//  - Allow change detection to identify unnecessary re-renders.

export const emptyList = List();
export const emptySet = Set();
export const emptyMap = Map();
