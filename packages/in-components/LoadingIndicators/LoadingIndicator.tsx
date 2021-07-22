/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { SvgIconSizes } from '@instana/components';

import IndeterminateLoadingIndicator from 'in-components/LoadingIndicators/IndeterminateLoadingIndicator';

// @ts-expect-error
import locals from './LoadingIndicator.mless';

export interface LoadingIndicatorProps {
  size: keyof typeof SvgIconSizes;
  title?: string;
  text?: string;
  className?: string;
  width?: number;
  height?: number;
  style?: Record<string, string | number>;
}

export default function LoadingIndicator({
  size = 'xl',
  title,
  text,
  className,
  width,
  height,
  style
}: LoadingIndicatorProps) {
  if (height < 80) {
    size = 'regular';
  }
  return (
    <div className={classNames(locals.container, className)} style={{ height: height, width: width, ...style }}>
      <div className={locals.content}>
        <IndeterminateLoadingIndicator size={SvgIconSizes[size]} />
        {title && <h2 className={locals.title}>{title}</h2>}
        <span className={locals.text}>{text}</span>
      </div>
    </div>
  );
}
