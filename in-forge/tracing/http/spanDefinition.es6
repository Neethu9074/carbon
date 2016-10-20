import {config} from 'in-services/config';

export function getLabel(span) {
  const host = config.tenant === 'douglas' ? span.getIn(['data', 'http', 'host'], '') : '';
  const url = removeUrlParameters(span.getIn(['data', 'http', 'url']));
  const method = span.getIn(['data', 'http', 'method']);

  if (url && method) {
    return `${method} ${host}${url}`;
  } else if (url) {
    return `${host}${url}`;
  } else if (method) {
    return method;
  }
  return null;
}

function removeUrlParameters(url) {
  if (url == null) {
    return url;
  }
  return url.replace(/\?.*/i, '');
}
