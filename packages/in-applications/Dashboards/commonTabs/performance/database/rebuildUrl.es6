import * as _ from 'lodash';

// TODO BK This feels like it offers functionality similar to in-stores/navigation/navigation.
// I wonder if this and in-stores/navigation/navigation should and can be merged?

/**
 * Rebuilds the (relative) URL from the location object (obtained from react-router-dom <Switch> routeProps), optionally
 * modifying the URL with the given function.
 *
 * @param location the location object (required attributes: location.matrix, location.pathname, location.query)
 * @param modifier a function to modify the URL after rebuilding it, before adding query parameters
 * @returns {string} the new URL, as a string
 */
export function rebuildUrlAndReplace(location, modifier) {
  // rebuild current URL from location object, including matrix parameters
  let path =
    '#' +
    _.reduce(
      location.matrix,
      (path, valueObject, key) => {
        if (!!valueObject && _.size(valueObject) > 0) {
          const matrixParametersForOnePathSegment = _.chain(valueObject)
            .toPairs()
            .map(pair => _.join(pair, '='))
            .join(';')
            .value();
          return path.replace(key, key + ';' + matrixParametersForOnePathSegment);
        } else {
          return path;
        }
      },
      location.pathname
    );

  // apply the specified URL modification
  if (modifier) {
    path = modifier(path);
  }

  // append all former query parameters
  if (!!location.query && _.size(location.query) > 0) {
    path =
      path +
      '?' +
      _.chain(location.query)
        .toPairs()
        .map(pair => `${pair[0]}=${pair[1]}`)
        .join('&')
        .value();
  }
  return path;
}

/**
 * Rebuilds the (relative) URL from the location object (obtained from react-router-dom <Switch> routeProps), optionally
 * appending a new path fragment at the end.
 *
 * @param location the location object (required attributes: location.matrix, location.pathname, location.query)
 * @param additionalPathSegment the path segment to append at the end (before query parameters)
 * @returns {string} the new URL, as a string
 */
export function rebuildUrlAndAppend(location, additionalPathSegment) {
  return rebuildUrlAndReplace(location, path => (path += '/' + additionalPathSegment));
}
