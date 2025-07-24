/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TagFilterExpression } from '@instana/types';

import { deepFreeze } from 'in-services/util/object';

const _tagFilterExpression: TagFilterExpression = { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] };

export default deepFreeze(_tagFilterExpression);

export function getEmptyTagFilterExpression() {
  return { ..._tagFilterExpression, elements: [] };
}
