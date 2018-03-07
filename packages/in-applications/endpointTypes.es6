import invariant from 'invariant';

export const colorTranslation = {
  BATCH: '#14adff',
  DATABASE: '#cc553b',
  HTTP: '#1479ff',
  MESSAGING: '#3eb39a',
  RPC: '#61ccce',
  UNDEFINED: '#cc553b'
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
