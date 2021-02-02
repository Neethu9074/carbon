/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';

import locals from './SloTile.mless';

export default function SloTile({ smallRowStyle, title, value, color, targetInfo, targetValue }) {
  if (smallRowStyle) {
    return (
      <div className={locals.oneRow}>
        <div className={locals.titleValueBorder}>
          <span>{title}:</span>
          <span className={locals.value} style={{ color }}>
            {value || valueMissingPlaceholder}
          </span>
        </div>
        <div className={locals.targetInfo}>
          <span>{targetInfo}</span>
          <span className={locals.targetInfoValue}>{targetValue || valueMissingPlaceholder}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={locals.tile}>
      <div className={locals.title}>{title}</div>

      <div className={locals.value} style={{ color }}>
        <span>{value || valueMissingPlaceholder}</span>
      </div>

      <div className={locals.targetInfo}>
        <span>{targetInfo}</span> <span className={locals.leftSpace}>{targetValue || valueMissingPlaceholder}</span>
      </div>
    </div>
  );
}

SloTile.propTypes = {
  smallRowStyle: PropTypes.bool,
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  targetInfo: PropTypes.string.isRequired,
  targetValue: PropTypes.string.isRequired,
  color: PropTypes.string
};
