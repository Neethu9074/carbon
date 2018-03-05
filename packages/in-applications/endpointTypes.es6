import invariant from 'invariant';

const endpointTranslation = {
  BATCH: 'Batch Methods',
  DATABASE: 'Database Endpoints',
  HTTP: 'HTTP Endpoints',
  MESSAGING: 'Topics',
  RPC: 'Methods',
  UNDEFINED: 'Undefined'
};

export const colorTranslation = {
  BATCH: '#14adff',
  DATABASE: '#cc553b',
  HTTP: '#1479ff',
  MESSAGING: '#3eb39a',
  RPC: '#61ccce',
  UNDEFINED: '#cc553b'
};

export function getEndpointsLabel(type) {
  if (__DEV__) {
    invariant(endpointTranslation[type], `Unknown endpoint type ${type}`);
  }
  return endpointTranslation[type] || `${type} Endpoints`;
}

export function getColor(type) {
  if (__DEV__) {
    invariant(colorTranslation[type], `Unknown endpoint type ${type}`);
  }
  return colorTranslation[type] || colorTranslation.sdk;
}

export function getEndpointTypesComboBoxItems() {
  return Object.keys(endpointTranslation)
    .sort()
    .reduce(
      (agg, k) =>
        agg.concat({
          value: k,
          label: k
        }),
      []
    );
}
