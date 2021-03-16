/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function getLabel(span) {
  const url = removeUrlParameters(span.getIn(['data', 'http', 'url'], span.getIn(['data', 'http', 'path'])));
  const method = span.getIn(['data', 'http', 'method']);

  if (url && method) {
    return `${method} ${url}`;
  } else if (url) {
    return url;
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
