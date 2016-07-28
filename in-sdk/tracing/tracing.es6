import {getSpanDefinition} from 'in-sdk/registry/tracing';

import httpIcon from 'in-sdk/tracing/categoryIcons/http.svg';
import messagingIcon from 'in-sdk/tracing/categoryIcons/messaging.svg';
import databaseIcon from 'in-sdk/tracing/categoryIcons/database.svg';
import remoteIcon from 'in-sdk/tracing/categoryIcons/remote.svg';

const categoryIcons = {
  database: databaseIcon,
  remote: remoteIcon,
  io: remoteIcon,
  http: httpIcon,
  messaging: messagingIcon,
  batch: messagingIcon
};

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

export function getCategoryIcon(category) {
  return categoryIcons[category];
}
