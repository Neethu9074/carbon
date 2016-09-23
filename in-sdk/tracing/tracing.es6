export {registry, registerSpanDefinition, getSpanDefinition} from 'in-sdk/tracing/registry';

import {getSpanDefinition} from 'in-sdk/tracing';
import httpIcon from 'in-sdk/tracing/categoryIcons/http.svg';
import messagingIcon from 'in-sdk/tracing/categoryIcons/messaging.svg';
import eumIcon from 'in-sdk/tracing/categoryIcons/eum.svg';
import databaseIcon from 'in-sdk/tracing/categoryIcons/database.svg';
import remoteIcon from 'in-sdk/tracing/categoryIcons/remote.svg';
import genericIcon from 'in-sdk/tracing/categoryIcons/generic.svg';
import loggerIcon from 'in-sdk/tracing/categoryIcons/logger.svg';

const categoryIcons = {
  database: databaseIcon,
  remote: remoteIcon,
  io: remoteIcon,
  http: httpIcon,
  messaging: messagingIcon,
  batch: messagingIcon,
  generic: genericIcon,
  logger: loggerIcon,
  eum: eumIcon
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
