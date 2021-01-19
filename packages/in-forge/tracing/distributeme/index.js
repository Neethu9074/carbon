/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'distributeme',
  category: 'remote',

  typeName: {
    singular: 'DistributeMe call',
    plural: 'DistributeMe calls'
  },

  detailView: 'DistributeMeSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'distributeme', 'service'], 'Unkown');
  }
});
