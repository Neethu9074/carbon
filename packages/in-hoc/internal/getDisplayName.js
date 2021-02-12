/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function getDisplayName(Component, wrapperName) {
  return `${wrapperName}(${getComponentDisplayName(Component)})`;
}

function getComponentDisplayName(Component) {
  if (typeof Component === 'string') {
    return Component;
  }

  if (!Component) {
    return undefined;
  }

  return Component.displayName || Component.name || 'Component';
}
