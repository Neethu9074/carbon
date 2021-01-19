/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import WithActiveTheme from 'in-themes/WithActiveTheme';

import locals from './TileWrapper.mless';

export default function TileWrapper({ children, useMaxAvailableHeight, actions }) {
  return (
    <WithActiveTheme>
      {theme => (
        <div
          className={classNames({
            [locals.wrapper]: true,
            [locals[theme]]: true,
            [locals.useMaxAvailableHeight]: useMaxAvailableHeight
          })}
        >
          {children}

          {actions && <div className={locals.actions}>{actions}</div>}
        </div>
      )}
    </WithActiveTheme>
  );
}

TileWrapper.propTypes = {
  children: PropTypes.any,
  actions: PropTypes.node,
  useMaxAvailableHeight: PropTypes.bool
};
