import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/log/spanDefinition';

registerSpanDefinition({
  type: 'log.slf4j',
  category: 'logger',

  typeName: {
    singular: 'Log',
    plural: 'Logs'
  },

  detailView: 'Slf4jDetailView',

  getLabel
});
