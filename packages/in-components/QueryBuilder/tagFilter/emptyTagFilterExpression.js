/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { deepFreeze } from 'in-services/util/object';

const _tagFilterExpression = { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] };

export default deepFreeze(_tagFilterExpression);

export function getEmptyTagFilterExpression() {
  return { ..._tagFilterExpression, elements: [] };
}
