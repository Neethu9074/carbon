import {registerSpanDefinition} from 'in-sdk/registry/tracing';
import {getLabel} from 'in-forge/tracing/log/spanDefinition';

registerSpanDefinition({
  type: 'log.log4j',
  category: 'logger',
  direction: 'exit',

  typeName: {
    singular: 'Log',
    plural: 'Logs'
  },

  detailView: 'Log4jDetailView',

  getLabel
});
