import { createLogger } from 'instalog';

let missingSpanDefinitionReported = false;

// maps type => spanDefinition
export const registry = {};

function defaultSpanDefinition(span) {
  const spanDefinition = {
    type: 'unknown',
    category: 'generic',

    typeName: {
      singular: 'Call',
      plural: 'Calls'
    },

    detailView: 'GenericSpanDetailView',

    groupingDetailView: 'GenericSpanGroupingDetailView',

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
  const spanDefinition = registry[type];
  if (spanDefinition) {
    return spanDefinition;
  }

  if (!missingSpanDefinitionReported) {
    createLogger('in-sdk/tracing/registry').warn(
      `Span definition for ${type} could not be found.`,
      span ? span.toJS() : undefined
    );
    missingSpanDefinitionReported = true;
  }

  return defaultSpanDefinition(span);
}
