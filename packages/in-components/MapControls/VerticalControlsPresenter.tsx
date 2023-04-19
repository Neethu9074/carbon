/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import locals from './VerticalControlsPresenter.mless';

export default function VerticalControlsPresenter({ children, position = 'rightMiddle' }) {
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

VerticalControlsPresenter.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['leftBottom', 'leftMiddle', 'leftTop', 'rightBottom', 'rightMiddle', 'rightTop'])
};
