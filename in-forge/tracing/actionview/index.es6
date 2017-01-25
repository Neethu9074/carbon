import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'actionview',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'ActionView',
    plural: 'ActionView Calls'
  },

  detailView: 'ActionViewSpanDetailView',

  getLabel() {
    return '';
  }
});
