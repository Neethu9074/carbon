/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'gcs',
  category: 'database',

  typeName: {
    singular: 'Google Cloud Storage',
    plural: 'Google Cloud Storage'
  },

  detailView: 'GCSSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'gcs', 'op']);
  }
});
