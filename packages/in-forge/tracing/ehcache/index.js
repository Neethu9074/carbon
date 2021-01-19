/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'ehcache',
  category: 'cache',

  typeName: {
    singular: 'Ehcache call',
    plural: 'Ehcache calls'
  },

  detailView: 'EhcacheSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'action']) + ' ' + span.getIn(['data', 'name']);
  }
});
