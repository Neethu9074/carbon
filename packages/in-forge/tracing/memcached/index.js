/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'memcached',
  category: 'cache',

  typeName: {
    singular: 'Memcached Call',
    plural: 'Memcached Calls'
  },

  detailView: 'MemcachedSpanDetailView',

  getLabel(span) {
    return 'Memcached ' + span.getIn(['data', 'memcached', 'operation']);
  }
});
