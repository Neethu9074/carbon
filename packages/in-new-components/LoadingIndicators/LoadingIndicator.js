/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import IndeterminateLoadingIndicator from 'in-new-components/LoadingIndicators/IndeterminateLoadingIndicator';
import { sizes as ICON_SIZES } from 'in-components/SvgIcon/SvgIcon';

import locals from './LoadingIndicator.mless';

export default function LoadingIndicator({ size = 'xl', title, text, className, width, height, style }) {
  if (height < 80) {
    size = 'regular';
  }
  return (
    <div className={classNames(locals.container, className)} style={{ height: height, width: width, ...style }}>
      <div className={locals.content}>
        <IndeterminateLoadingIndicator size={ICON_SIZES[size]} />
        {title && <h2 className={locals.title}>{title}</h2>}
        <span className={locals.text}>{text}</span>
      </div>
    </div>
  );
}

LoadingIndicator.propTypes = {
  size: PropTypes.oneOf(Object.keys(ICON_SIZES)),
  title: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  style: PropTypes.object
};
