// maps type => spanDefinition
export const registry = {};

const defaultSpanDefinition = {
  type: 'unknown',
  category: 'generic',
  direction: 'entryAndExit',

  typeName: {
    singular: 'Unknown',
    plural: 'Unknown'
  },

  getLabel() {
    return 'Unknown';
  }
};

export function registerSpanDefinition(spanDefinition) {
  registry[spanDefinition.type] = spanDefinition;
}


export function getSpanDefinition(type) {
  return registry[type] || defaultSpanDefinition;
}
