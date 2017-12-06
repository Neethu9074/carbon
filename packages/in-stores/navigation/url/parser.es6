import { emptyObject } from 'in-services/fixedObjects';

export function parseUrl(href) {
  href = href || '/';

  let location: location = parseQueryParameters(href);
  location = parseMatrix(location);

  return location;
}

function parseQueryParameters(href) {
  const match = href.match(/^(.*)\?([^#$]*)/);
  if (!match) {
    return {
      path: href,
      query: emptyObject
    };
  }

  const path = match[1];
  const query = match[2].split('&').reduce(paramReducer, {});
  return { path, query };
}

function paramReducer(agg, parameter) {
  let [key, value] = parameter.split('=');
  if (!key) {
    return agg;
  }
  if (value == null) {
    value = '';
  }
  agg[decodeURIComponent(key)] = decodeURIComponent(value);
  return agg;
}

function parseMatrix(location) {
  location.matrix = location.path
    .split('/')
    .slice(1)
    .reduce(segmentReducer, {});

  let path = '';
  for (let key in location.matrix) {
    path += key;
  }
  location.path = path;

  return location;
}

function segmentReducer(agg, path) {
  path = '/' + path;
  const [pathSegment, matrixStr] = path.split(';', 2);

  if (!matrixStr) {
    agg[pathSegment] = emptyObject;
    return agg;
  }

  agg[pathSegment] = matrixStr.split(';').reduce(paramReducer, {});
  return agg;
}
