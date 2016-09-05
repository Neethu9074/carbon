import {registerSpanDefinition} from 'in-sdk/tracing';

import {getLabel} from 'in-forge/tracing/log/spanDefinition';

registerSpanDefinition({
  type: 'log',
  category: 'logger',
  direction: 'local',

  typeName: {
    singular: 'Log',
    plural: 'Logs'
  },

  detailView: 'LogSpanDetailView',

  getLabel
});
