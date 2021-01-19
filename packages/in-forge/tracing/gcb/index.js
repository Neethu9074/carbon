/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'gcb',
  category: 'database',

  typeName: {
    singular: 'Google Cloud Bigtable call',
    plural: 'Google Cloud Bigtable calls'
  },

  detailView: 'GCBSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'gcb', 'op']);
  }
});
