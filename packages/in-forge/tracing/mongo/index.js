/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'mongo',
  category: 'database',

  typeName: {
    singular: 'MongoDB query',
    plural: 'MongoDB queries'
  },

  detailView: 'MongoSpanDetailView',

  groupingDetailView: 'MongoSpanGroupingDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mongo', 'command']);
  }
});
