import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'render',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'Render',
    plural: 'Render Calls'
  },

  detailView: 'RenderSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'render', 'type']) + ' => ' + span.getIn(['data', 'render', 'name']);
  }
});
