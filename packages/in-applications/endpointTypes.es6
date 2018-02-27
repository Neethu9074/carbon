import invariant from 'invariant';

const endpointTranslation = {
  BATCH: 'Batch Methods',
  DATABASE: 'Database Endpoints',
  WEB: 'HTTP Endpoints',
  HTTP: 'HTTP Endpoints',
  MESSAGING: 'Topics',
  RPC: 'Methods',
  SDK: 'SDK Endpoints',
  WEBSITE: 'Pages',
  UNKNOWN: 'Unknown'
};

const colorTranslation = {
  BATCH: '#45d1f7',
  DATABASE: '#eb731e',
  HTTP: '#318af6',
  MESSAGING: '#89ef15',
  RPC: '#4e94c6',
  SDK: '#ecbb18',
  WEBSITE: '#f054f2',
  UNKNOWN: 'red'
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
