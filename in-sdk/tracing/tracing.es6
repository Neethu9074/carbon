export {registry, registerSpanDefinition, getSpanDefinition} from 'in-sdk/tracing/registry';
import {getSpanDefinition} from 'in-sdk/tracing';

import messagingIcon from 'in-sdk/tracing/categoryIcons/messaging.svg';
import databaseIcon from 'in-sdk/tracing/categoryIcons/database.svg';
import missingIcon from 'in-sdk/tracing/categoryIcons/missing.svg';
import genericIcon from 'in-sdk/tracing/categoryIcons/generic.svg';
import remoteIcon from 'in-sdk/tracing/categoryIcons/remote.svg';
import loggerIcon from 'in-sdk/tracing/categoryIcons/logger.svg';
import httpIcon from 'in-sdk/tracing/categoryIcons/http.svg';
import eumIcon from 'in-sdk/tracing/categoryIcons/eum.svg';

const categoryIcons = {
  batch: messagingIcon,
  database: databaseIcon,
  eum: eumIcon,
  eumResource: eumIcon,
  generic: genericIcon,
  http: httpIcon,
  io: remoteIcon,
  logger: loggerIcon,
  messaging: messagingIcon,
  missing: missingIcon,
  remote: remoteIcon
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

export function getDirection(span) {
  const direction = getSpanDefinition(span.get('name'), span).direction;
  if (!direction) {
    return 'entryAndExit';
  } else if (typeof direction === 'string') {
    return direction;
  }

  return direction(span) || 'entryAndExit';
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

export function getCategoryIcon(category) {
  return categoryIcons[category];
}

export function shouldShowSelfTime(span) {
  return getSpanDefinition(span.get('name'), span).showSelfTime !== false;
}
