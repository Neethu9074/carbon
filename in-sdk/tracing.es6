import {getSpanDefinition} from 'in-sdk/registry/tracing';

export function getLabel(span) {
  return getSpanDefinition(span.get('name'), span).getLabel(span) || '<unknown>';
}

export function getCategory(span) {
  return getSpanDefinition(span.get('name'), span).category || 'generic';
}

export function getDirection(span) {
  return getSpanDefinition(span.get('name'), span).direction || 'entryAndExit';
}

export function getTypeLabelSingular(span) {
  return getSpanDefinition(span.get('name'), span).typeName.singular;
}

export function getTypeLabelPlural(span) {
  return getSpanDefinition(span.get('name'), span).typeName.plural;
}

export function getSpanDetailView(span) {
  return getSpanDefinition(span.get('name'), span).detailView;
}
