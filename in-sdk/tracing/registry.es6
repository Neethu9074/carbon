// maps type => spanDefinition
export const registry = {};

function defaultSpanDefinition(span) {
  const spanDefinition = {
    type: 'unknown',
    category: 'generic',
    direction: 'entryAndExit',

    typeName: {
      singular: 'Call',
      plural: 'Calls'
    },

    detailView: 'GenericSpanDetailView',

    getLabel() {
      return span.getIn(['data', 'label']) || 'Unknown (' + span.get('name') + ')';
    }

  };
  return spanDefinition;
}

export function registerSpanDefinition(spanDefinition) {
  registry[spanDefinition.type] = spanDefinition;
}


export function getSpanDefinition(type, span) {
  return registry[type] || defaultSpanDefinition(span);
}
