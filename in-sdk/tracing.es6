import {getSpanDefinition} from 'in-sdk/registry/tracing';

export function getLabel(span) {
  return getSpanDefinition(span.get('name'), span).getLabel(span) || '<unknown>';
}
