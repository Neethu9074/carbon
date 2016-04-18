import {getSpanDefinition} from 'in-sdk/registry/tracing';

export function getLabel(span) {
  return getSpanDefinition(span.get('name'), span).getLabel(span) || '<unknown>';
}

export function getTypeLabelSingular(span) {
  return getSpanDefinition(span.get('name'), span).typeName.singular || '<unknown>';
}

export function getTypeLabelPlural(span) {
  return getSpanDefinition(span.get('name'), span).typeName.plural || '<unknown>';
}
