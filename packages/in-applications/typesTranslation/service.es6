const endpointTranslation = {
  BATCH: 'Batch Methods',
  DATABASE: 'Database Endpoints',
  WEB: 'HTTP Endpoints',
  MESSAGING: 'Messaging Endpoints',
  RPC: 'RPC Methods',
  SDK: 'SDK Endpoints',
  WEBSITE: 'Website Endpoints'
};

export default function translate(type) {
  const translation = endpointTranslation[type];
  if (translation == null) {
    return 'TRANSLATION NOT FOUND';
  } else {
    return translation;
  }
}
