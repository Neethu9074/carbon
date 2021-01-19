/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'distributeme.client',
  category: 'remote',

  typeName: {
    singular: 'DistributeMe call',
    plural: 'DistributeMe calls'
  },

  detailView: 'DistributeMeClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'distributeme', 'service'], 'Unkown');
  }
});
