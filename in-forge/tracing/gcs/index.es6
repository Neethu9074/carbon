import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'gcs',
  category: 'database',

  typeName: {
    singular: 'Google Cloud Storage call',
    plural: 'Google Cloud Storage calls'
  },

  detailView: 'GCSSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'gcs', 'op']) + ' ' + span.getIn(['data', 'gcs', 'bucket']);
  }
});
