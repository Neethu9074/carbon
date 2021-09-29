/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIconSizes } from '@instana/components';

import IndeterminateLoadingIndicator from 'in-components/LoadingIndicators/IndeterminateLoadingIndicator';

import locals from './LoadingIndicator.mless';

export interface LoadingIndicatorProps {
  size: keyof typeof SvgIconSizes | undefined;
  title?: string | undefined;
  text?: string | undefined;
  className?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  style?: Record<string, string | number> | undefined;
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
  if (height && height < 80) {
    size = 'regular';
  }
  return (
    <div className={classNames(locals.container, className)} style={{ height, width, ...style }}>
      <div className={locals.content}>
        <IndeterminateLoadingIndicator size={SvgIconSizes[size]} />
        {title && <h2 className={locals.title}>{title}</h2>}
        <span className={locals.text}>{text}</span>
      </div>
    </div>
  );
}
