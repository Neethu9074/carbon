/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import withSideEffect from 'react-side-effect';
import PropTypes from 'prop-types';

import { replaceFloatingActionButtons } from './stores/floatingActionButtons';

function reduceProps(propsList) {
  return propsList.reduce(
    (result, props) =>
      result
        .concat(props.items ?? props.children)
        // allow false/null as items for ease of use
        .filter(v => !!v),
    []
  );
}

const FloatingActionButtons = withSideEffect(reduceProps, replaceFloatingActionButtons)(() => null);

FloatingActionButtons.propTypes = {
  items: PropTypes.arrayOf(PropTypes.element),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
};

export default FloatingActionButtons;
