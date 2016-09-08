import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sdk',
  category: 'generic',
  direction(span) {
    const type = span.getIn(['data', 'sdk', 'type']);
    return type ? type.toLowerCase() : 'entryAndExit';
  },
  searchAliases: ['sdk'],

  typeName: {
    singular: 'Call',
    plural: 'Calls'
  },

  detailView: 'SdkSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'sdk', 'name']);
  }
});
