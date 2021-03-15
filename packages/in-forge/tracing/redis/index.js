/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'redis',
  category: 'database',
  typeName: {
    singular: 'Redis call',
    plural: 'Redis calls'
  },
  detailView: 'RedisSpanDetailView',
  getLabel(span) {
    return span.getIn(['data', 'redis', 'command']);
  }
});
