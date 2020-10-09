import invariant from 'invariant';
import theme from 'in-themes';

import { addTransparency } from 'in-themes/utils';

export const endpointNameTranslations = {
  BATCH: 'Batch',
  SHELL: 'Shell',
  DATABASE: 'Database',
  HTTP: 'Http',
  MESSAGING: 'Messaging',
  RPC: 'Rpc',
  EVENT: 'Event',
  GRAPHQL: 'GraphQL',
  INTERNAL: 'Internal',
  UNDEFINED: 'Undefined',
  SELF: 'Self',
  SDK: 'SDK'
};

export const colorTranslation = {
  BATCH: theme.lib.colors.batch,
  SHELL: theme.lib.colors.yellow800,
  DATABASE: theme.lib.colors.database,
  HTTP: theme.lib.colors.http,
  MESSAGING: theme.lib.colors.messaging,
  RPC: theme.lib.colors.rpc,
  EVENT: theme.lib.colors.event,
  GRAPHQL: theme.lib.colors.lime800,
  INTERNAL: theme.lib.colors.purple800,
  UNDEFINED: theme.lib.colors.purple800,
  UNKNOWN: theme.lib.colors.purple800,
  SELF: theme.lib.colors.N400,
  SDK: theme.lib.colors.N600Light
};

export function getColor(type) {
  if (__DEV__) {
    invariant(colorTranslation[type], `Unknown endpoint type ${type}`);
  }
  return colorTranslation[type] || colorTranslation.sdk;
}

export function getColorChart(type) {
  if (__DEV__) {
    invariant(colorTranslation[type], `Unknown endpoint type ${type}`);
  }
  return addTransparency(colorTranslation[type], 0.05) || colorTranslation.sdk;
}

export function getEndpointTypesComboBoxItems(restrict = null) {
  return Object.keys(endpointNameTranslations)
    .filter(k => restrict == null || restrict.indexOf(k) !== -1)
    .filter(k => k !== 'SELF') // self is a special case which we never want to expose in a combobox
    .filter(k => k !== 'UNDEFINED')
    .sort()
    .reduce(
      (agg, k) =>
        agg.concat({
          value: k,
          label: endpointNameTranslations[k]
        }),
      []
    );
}

export function hasHttpEndpoints(types) {
  if (!types) {
    return false;
  }
  return hasType('HTTP', types);
}

export function hasHttpAndOtherEndpoints(types) {
  return hasHttpEndpoints(types) && types.length > 1;
}

function hasType(type, types) {
  return types.indexOf(type) >= 0;
}
