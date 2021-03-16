/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'vertx.redis',
  category: 'database',
  typeName: {
    singular: 'Vert.x Redis call',
    plural: 'Vert.x Redis calls'
  },
  detailView: 'VertxRedisSpanDetailView',
  getLabel(span) {
    return span.getIn(['data', 'vertx', 'redis', 'cmd']);
  }
});
