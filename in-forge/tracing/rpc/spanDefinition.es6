import {config} from 'in-services/config';

export function getLabel(span) {
  const host = config.tenant === 'douglas' ? span.getIn(['data', 'rpc', 'host'], '') : '';
  const service = span.getIn(['data', 'service'], '');

  if (service) {
    return service;
  } else if (host) {
    return host;
  }

  return null;
}
