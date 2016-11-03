export function joinClassNames() {
  let result = '';

  for (let i = 0, len = arguments.length; i < len; i++) {
    const className = arguments[i];
    if (className != null) {
      result += ' ' + className;
    }
  }

  return result;
}

/**
 * Adapted from https://github.com/JedWatson/classnames, but only supports the
 * most common parameter type and assumes that we don't extend the prototype
 * chain.
 *
 * @param {object} definition Keys define the class names and values define
 *  whether the class name should be included in the result
 * @returns {string} Space-separated list of classnames that should be used.
 */
export default function classnames(definition) {
  let classes = '';
  for (const key in definition) {
    if (definition[key]) {
      classes += ' ' + key;
    }
  }
  return classes.substr(1);
}
