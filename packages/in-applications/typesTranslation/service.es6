import invariant from 'invariant';

const endpointTranslation = {
  BATCH: 'Batch Methods',
  DATABASE: 'Database Endpoints',
  WEB: 'HTTP Endpoints',
  HTTP: 'HTTP Endpoints',
  MESSAGING: 'Topics',
  RPC: 'Methods',
  SDK: 'SDK Endpoints',
  WEBSITE: 'Pages'
};

export default function translate(type) {
  if (__DEV__) {
    invariant(endpointTranslation[type], `Unknown service type ${type}`);
  }

  return endpointTranslation[type] || `${type} Endpoints`;
}
