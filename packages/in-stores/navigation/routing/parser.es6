import { emptyObject } from 'in-services/fixedObjects';

export function parseUrl(href, isURIDecoded = false) {
  href = href || '/';

  const decode = isURIDecoded ? decodeURIReservedChars : decodeURIComponent;

  let location = parseQueryParameters(href);
  location = parseMatrix(location, decode);

  return location;
}

function decodeURIReservedChars(uri) {
  uri = uri
    .replace(/%26/gi, '&')
    .replace(/%3F/gi, '?')
    .replace(/%23/gi, '#')
    .replace(/%2B/gi, '+')
    .replace(/%3B/gi, ';')
    .replace(/%2C/gi, ',')
    .replace(/%2F/gi, '/')
    .replace(/%3A/gi, ':')
    .replace(/%40/gi, '@')
    .replace(/%3D/gi, '=')
    .replace(/%24/gi, '$');
  return uri;
}

function parseQueryParameters(href) {
  const match = href.match(/^(.*)\?([^#$]*)/);
  if (!match) {
    return {
      pathname: href,
      query: emptyObject
    };
  }

  const pathname = match[1];
  const query = match[2].split('&').reduce(paramReducer(decodeURIComponent), {});
  return { pathname, query };
}

function paramReducer(decode) {
  return (agg, parameter) => {
    let [key, value] = parameter.split('=');
    if (!key) {
      return agg;
    }
    if (value == null) {
      value = '';
    }
    agg[decode(key)] = decode(value);
    return agg;
  };
}

function parseMatrix(location, decode) {
  location.matrix = location.pathname
    .split('/')
    .slice(1)
    .reduce(segmentReducer(decode), {});

  let pathname = '';
  for (let key in location.matrix) {
    pathname += key;
  }
  location.pathname = pathname;

  return location;
}

function segmentReducer(decode) {
  return (agg, pathname) => {
    pathname = '/' + pathname;
    const split = pathname.split(';');
    const pathnameSegment = split[0];
    if (split.length <= 0) {
      agg[pathnameSegment] = emptyObject;
      return agg;
    }
    agg[pathnameSegment] = split.slice(1).reduce(paramReducer(decode), {});
    return agg;
  };
}
