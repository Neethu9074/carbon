/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';

import { lighten } from 'in-services/formatters/color';
import theme from 'in-themes';
import { t } from 'in-i18n';

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
  SDK: t('in-applications:endpointTypes.sdk'),
  OPENTELEMETRY: t('in-applications:endpointTypes.otel')
};

export const colorTranslation = {
  BATCH: theme.lib.carbonCategorical.purple70,
  SHELL: theme.lib.carbonCategorical.cyan50,
  DATABASE: theme.lib.carbonCategorical.teal70,
  HTTP: theme.lib.carbonCategorical.magenta70,
  MESSAGING: theme.lib.carbonCategorical.red50,
  RPC: theme.lib.carbonCategorical.red90,
  EVENT: theme.lib.carbonCategorical.green60,
  GRAPHQL: theme.lib.carbonCategorical.blue80,
  INTERNAL: theme.lib.carbonCategorical.magenta50,
  UNDEFINED: theme.lib.carbonCategorical.yellow50,
  UNKNOWN: theme.lib.carbonCategorical.teal50,
  SELF: theme.lib.carbonCategorical.cyan90,
  SDK: theme.lib.carbonCategorical.orange70,
  OPENTELEMETRY: theme.lib.carbonCategorical.purple50
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
  return lighten(colorTranslation[type], 0.05) || colorTranslation.sdk;
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
