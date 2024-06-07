/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';

import { EndpointType } from '@instana/types';

import { carbonCategorical } from 'in-themes/chartColors';
import { lighten } from 'in-services/formatters/color';
import { t } from 'in-i18n';

export const endpointNameTranslations: Record<string, string> = {
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

export const colorTranslation: Record<string, string> = {
  BATCH: carbonCategorical.purple70,
  SHELL: carbonCategorical.cyan50,
  DATABASE: carbonCategorical.teal70,
  HTTP: carbonCategorical.magenta70,
  MESSAGING: carbonCategorical.red50,
  RPC: carbonCategorical.red90,
  EVENT: carbonCategorical.green60,
  GRAPHQL: carbonCategorical.blue80,
  INTERNAL: carbonCategorical.magenta50,
  UNDEFINED: carbonCategorical.yellow50,
  UNKNOWN: carbonCategorical.teal50,
  SELF: carbonCategorical.cyan90,
  SDK: carbonCategorical.orange70,
  OPENTELEMETRY: carbonCategorical.purple50
};

export function getColor(type: string) {
  if (__DEV__) {
    invariant(colorTranslation[type], `Unknown endpoint type ${type}`);
  }
  return colorTranslation[type] || colorTranslation.SDK;
}

export function getColorChart(type: string) {
  if (__DEV__) {
    invariant(colorTranslation[type], `Unknown endpoint type ${type}`);
  }
  return lighten(colorTranslation[type], 0.05) || colorTranslation.SDK;
}

export function getEndpointTypesComboBoxItems(restrict: Array<EndpointType> | null = null) {
  return Object.keys(endpointNameTranslations)
    .filter((k: string) => restrict == null || restrict.indexOf(k as EndpointType) !== -1)
    .filter(k => k !== 'SELF') // self is a special case which we never want to expose in a combobox
    .filter(k => k !== 'UNDEFINED')
    .sort()
    .reduce(
      (
        agg: Array<{
          value: string;
          label: string;
        }>,
        k: string
      ) =>
        agg.concat({
          value: k,
          label: endpointNameTranslations[k]
        }),
      []
    );
}

export function hasHttpEndpoints(types: EndpointType[]) {
  if (!types) {
    return false;
  }
  return hasType('HTTP', types);
}

export function hasHttpAndOtherEndpoints(types: EndpointType[]) {
  return hasHttpEndpoints(types) && types.length > 1;
}

function hasType(type: EndpointType, types: EndpointType[]) {
  return types.indexOf(type) >= 0;
}
