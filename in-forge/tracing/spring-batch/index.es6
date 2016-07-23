import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'spring-batch',

  typeName: {
    singular: 'Spring Batch Job',
    plural: 'Spring Batch Jobs'
  },

  detailView: 'SpringBatchSpanDetailView',

  getLabel(span) {
    const job = span.getIn(['data', 'batch', 'job']);
    const status = span.getIn(['data', 'batch', 'status']);

    if (job && status) {
      return job + ' ' + status;
    } else if (job) {
      return job;
    }
    return null;
  }
});
