/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'bull',
  category: 'messaging',

  typeName: {
    singular: 'Bull job',
    plural: 'Bull jobs'
  },

  detailView: 'BullSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'bull', 'queue']);
  }
});
