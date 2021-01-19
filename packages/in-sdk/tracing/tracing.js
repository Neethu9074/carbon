/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import invariant from 'invariant';

export { registry, registerSpanDefinition, getSpanDefinition } from 'in-sdk/tracing/registry';
import { getSpanDefinition } from 'in-sdk/tracing';

export const SPAN_KINDS = {
  INTERMEDIATE: 'intermediate',
  ENTRY: 'entry',
  EXIT: 'exit'
};

export function getType(span) {
  return getSpanDefinition(span.get('name'), span).type || 'unknown';
}

export function getLabel(span) {
  const label = span.get('label');
  if (label) {
    return label;
  }
  return getSpanDefinition(span.get('name'), span).getLabel(span) || 'Unknown';
}

export function getCategory(span) {
  return getSpanDefinition(span.get('name'), span).category || 'generic';
}

export function getServiceSideForOverview(span) {
  const serviceSideForOverview = getSpanDefinition(span.get('name'), span).serviceSideForOverview;
  if (serviceSideForOverview) {
    if (__DEV__) {
      invariant(
        serviceSideForOverview === 'destination' || serviceSideForOverview === 'source',
        'Must either be source or destination'
      );
    }
    return serviceSideForOverview;
  }

  const kind = span.get('kind');
  if (kind === SPAN_KINDS.ENTRY) {
    return 'destination';
  }
  return 'source';
}

export function getTypeLabelSingular(span) {
  return getSpanDefinition(span.get('name'), span).typeName.singular;
}

export function getTypeLabelPlural(span) {
  return getSpanDefinition(span.get('name'), span).typeName.plural;
}

export function getTypeLabelPluralByType(spanType) {
  return getSpanDefinition(spanType).typeName.plural;
}

export function getSpanDetailView(span) {
  return getSpanDefinition(span.get('name'), span).detailView;
}

export function isShowSelfTimeForCategory(category) {
  return category.indexOf('eum') !== 0;
}

export function shouldShowSelfTime(span) {
  return getSpanDefinition(span.get('name'), span).showSelfTime !== false;
}
