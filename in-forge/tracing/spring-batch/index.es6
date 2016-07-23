import {registerSpanDefinition} from 'in-sdk/registry/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'spring-batch',

  typeName: {
    singular: 'Spring Batch Job',
    plural: 'Spring Batch Jobs'
  },

  detailView: 'SpringBatchSpanDetailView',

  getLabel
});
