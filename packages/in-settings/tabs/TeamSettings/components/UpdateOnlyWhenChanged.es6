import { Component } from 'react';

/**
 * Blocks unnecessary reloads by checking a single array property and only allowing updates if that single property has
 * changed, in contrast to updating on _every_ property change.
 *
 * Use with care.
 */
export default class extends Component {
  static displayName = 'UpdateOnlyWhenChanged';

  shouldComponentUpdate({ array }) {
    return shouldUpdate(this.props.array, array);
  }

  render() {
    return this.props.children;
  }
}

// exported for testing
export function shouldUpdate(previous, next) {
  if (!previous && !next) {
    // Both are null or undefined - the component does not need to update.
    return false;
  }
  if ((previous && !next) || (!previous && next)) {
    // One is null/undefined, the other isn't - the component should update.
    return true;
  }
  if (previous.length !== next.length) {
    // We have arrays of different length - the component should update.
    return true;
  }
  // both arrays are known to have the same length from here on

  for (let i = 0; i < previous.length; i++) {
    if (previous[i] !== next[i]) {
      // We found an element that has changed - the component should update.
      return true;
    }
  }

  // Both arrays have the same length and contain the same elements in the same order - the component does not need to
  // update.
  return false;
}
