import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/log/spanDefinition';

registerSpanDefinition({
  type: 'log.jul',
  category: 'logger',

  typeName: {
    singular: 'Log',
    plural: 'Logs'
  },

  detailView: 'JulDetailView',

  getLabel
});
