import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/log/spanDefinition';

registerSpanDefinition({
  type: 'log.log4j2',
  category: 'logger',
  direction: 'local',

  typeName: {
    singular: 'Log',
    plural: 'Logs'
  },

  detailView: 'Log4j2DetailView',

  getLabel
});
