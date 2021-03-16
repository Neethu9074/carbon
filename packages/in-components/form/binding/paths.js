/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

export const pathPropType = PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]);

export function normalizePath(rootPath, path) {
  if (Array.isArray(path)) {
    return [...rootPath, ...path];
  }
  return [...rootPath, path];
}
