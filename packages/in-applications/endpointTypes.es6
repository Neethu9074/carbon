import invariant from 'invariant';

export const endpointNameTranslations = {
  BATCH: 'Batch',
  DATABASE: 'Database',
  HTTP: 'Http',
  MESSAGING: 'Messaging',
  RPC: 'Rpc',
  UNDEFINED: 'Undefined',
  SELF: 'Self'
};

export const colorTranslation = {
  BATCH: '#14adff',
  DATABASE: '#cc553b',
  HTTP: '#1479ff',
  MESSAGING: '#3eb39a',
  RPC: '#61ccce',
  UNDEFINED: '#cc553b',
  SELF: '#000000'
};

export function getColor(type) {
  if (__DEV__) {
    invariant(colorTranslation[type], `Unknown endpoint type ${type}`);
  }
  return colorTranslation[type] || colorTranslation.sdk;
}

export function getEndpointTypesComboBoxItems(restrict = null) {
  return Object.keys(colorTranslation)
    .filter(k => restrict == null || restrict.indexOf(k) !== -1)
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
