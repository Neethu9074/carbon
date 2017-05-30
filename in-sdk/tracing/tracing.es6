import invariant from 'invariant';

export { registry, registerSpanDefinition, getSpanDefinition } from 'in-sdk/tracing/registry';
import { getSpanDefinition } from 'in-sdk/tracing';

import messagingIcon from 'in-sdk/tracing/categoryIcons/messaging.svg';
import databaseIcon from 'in-sdk/tracing/categoryIcons/database.svg';
import missingIcon from 'in-sdk/tracing/categoryIcons/missing.svg';
import genericIcon from 'in-sdk/tracing/categoryIcons/generic.svg';
import remoteIcon from 'in-sdk/tracing/categoryIcons/remote.svg';
import loggerIcon from 'in-sdk/tracing/categoryIcons/logger.svg';
import httpIcon from 'in-sdk/tracing/categoryIcons/http.svg';
import xrayIcon from 'in-sdk/tracing/categoryIcons/xray.svg';
import rpcIcon from 'in-sdk/tracing/categoryIcons/rpc.svg';
import eumIcon from 'in-sdk/tracing/categoryIcons/eum.svg';

const categoryIcons = {
  batch: messagingIcon,
  database: databaseIcon,
  eum: eumIcon,
  eumResource: eumIcon,
  generic: genericIcon,
  http: httpIcon,
  rpc: rpcIcon,
  io: remoteIcon,
  logger: loggerIcon,
  messaging: messagingIcon,
  missing: missingIcon,
  remote: remoteIcon,
  xray: xrayIcon
};

export const SPAN_KINDS = {
  INTERMEDIATE: 'intermediate',
  ENTRY: 'entry',
  EXIT: 'exit'
};

export function getType(span) {
  return getSpanDefinition(span.get('name'), span).type || 'unknown';
}

export function getLabel(span) {
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

export function getSpanDetailView(span) {
  return getSpanDefinition(span.get('name'), span).detailView;
}

export function getSpanGroupingDetailView(span) {
  return getSpanDefinition(span.get('name'), span).groupingDetailView;
}

export function getCategoryIcon(category) {
  return categoryIcons[category];
}

export function isShowSelfTimeForCategory(category) {
  return category.indexOf('eum') !== 0;
}

export function shouldShowSelfTime(span) {
  return getSpanDefinition(span.get('name'), span).showSelfTime !== false;
}
