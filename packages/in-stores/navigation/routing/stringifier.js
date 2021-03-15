/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function stringify(location) {
  let href = location.pathname
    .split('/')
    .slice(1)
    .reduce((agg, path) => {
      path = `/${path}`;
      return agg + path + toParams(location.matrix[path], ';', ';');
    }, '');

  return href + toParams(location.query, '?', '&');
}

export function toParams(params, firstSeparator, followUpSeparator) {
  if (!params) {
    return '';
  }

  let result = '';
  let first = true;
  for (let key in params) {
    if (first) {
      result += firstSeparator;
      first = false;
    } else {
      result += followUpSeparator;
    }

    const value = params[key];
    if (value == null || value === '') {
      result += `${encodeURIComponent(key)}`;
    } else {
      result += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
  }

  return result;
}
