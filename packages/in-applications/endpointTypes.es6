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
  BATCH: '#1DA7EA',
  DATABASE: '#3EC56D',
  HTTP: '#00ACA2',
  MESSAGING: '#8B56DB',
  RPC: '#00BFCB',
  UNDEFINED: '#D4D8DB',
  SELF: '#D4D8DB'
};

export function getColor(type) {
  if (__DEV__) {
    invariant(colorTranslation[type], `Unknown endpoint type ${type}`);
  }
  return colorTranslation[type] || colorTranslation.sdk;
}

export function getEndpointTypesComboBoxItems(restrict = null) {
  return Object.keys(endpointNameTranslations)
    .filter(k => restrict == null || restrict.indexOf(k) !== -1)
    .filter(k => k !== 'SELF') // self is a special case which we never want to expose in a combobox
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
