import rpt from 'prop-types';
import React from 'react';

/**
 * This tiny wrapper component can be used to wrap user provided components
 * on which React refs need to be registered.
 *
 * This is necessary because of the following React restriction:
 * https://github.com/facebook/react/issues/4936
 */
export default React.createClass({
  displayName: 'RefWrapper',

  propTypes: {
    children: rpt.any
  },

  render() {
    return React.Children.only(this.props.children);
  }
});
