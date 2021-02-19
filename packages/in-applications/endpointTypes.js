/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import invariant from 'invariant';
import theme from 'in-themes';
import { t } from 'in-i18n';

import { addTransparency } from 'in-themes/utils';

export const endpointNameTranslations = {
  BATCH: t('in-applications:endpointTypes.batch'),
  SHELL: t('in-applications:endpointTypes.shell'),
  DATABASE: t('in-applications:endpointTypes.database'),
  HTTP: t('in-applications:endpointTypes.http'),
  MESSAGING: t('in-applications:endpointTypes.messaging'),
  RPC: t('in-applications:endpointTypes.rpc'),
  EVENT: t('in-applications:endpointTypes.event'),
  GRAPHQL: t('in-applications:endpointTypes.graphQL'),
  INTERNAL: t('in-applications:endpointTypes.internal'),
  UNDEFINED: t('in-applications:endpointTypes.undefined'),
  SELF: t('in-applications:endpointTypes.self'),
  SDK: t('in-applications:endpointTypes.sdk')
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
