/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { floatingActionButtons$ } from '../FloatingActionButton/stores/floatingActionButtons';
import connectTo from 'in-hoc/connectTo';

import locals from './HorizontalControlsPresenter.mless';

export default connectTo(() => ({
  hasFloatingFooter: floatingActionButtons$.map(buttons => buttons && buttons.length > 0)
}))(HorizontalControlsPresenter);

function HorizontalControlsPresenter({ children, position = 'bottomMiddle' }) {
  return (
    <div
      className={classNames({
        [locals[position]]: position
      })}
    >
      {children}
    </div>
  );
}

HorizontalControlsPresenter.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['bottomLeft', 'bottomMiddle', 'bottomRight', 'topLeft', 'topMiddle', 'topRight'])
};
