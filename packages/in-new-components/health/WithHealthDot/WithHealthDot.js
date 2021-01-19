/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { getColorBySeverity } from 'in-stores/events';

import locals from './WithHealthDot.mless';

export default function WithHealthDot({ severity = 0, iconSize, children }) {
  return (
    <div className={locals.wrapper}>
      {children}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          left: `calc(100% - ${iconSize * 1.75}px)`,
          backgroundColor: getColorBySeverity(severity)
        }}
        className={locals.dot}
      />
    </div>
  );
}

WithHealthDot.propTypes = {
  severity: PropTypes.number,
  iconSize: PropTypes.number,
  children: PropTypes.node
};
