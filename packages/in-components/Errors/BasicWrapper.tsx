/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';

import { SvgIconSizes } from '@instana/components';

// @ts-expect-error
import locals from './BasicWrapper.mless';

export interface BasicWrapperProps {
  width?: string | number;
  height?: string | number;
  title?: string;
  text?: string;
  renderIcon: (size: IconSize) => JSX.Element;
  className?: string;
}

export type IconSize = keyof typeof SvgIconSizes;

export default function BasicWrapper({ width, height, title, text, renderIcon, className }: BasicWrapperProps) {
  let size: string = 'default';
  let iconSize: IconSize = 'xl';
  if (height && height < 80) {
    size = 'small';
    iconSize = 'regular';
  }

  return (
    <div
      style={{
        width,
        height
      }}
      className={classNames(locals.wrapper, className)}
    >
      {size === 'small' && renderIcon(iconSize)}
      {size === 'default' && (
        <Fragment>
          {renderIcon(iconSize)}
          {title && <h1 className={locals.title}>{title}</h1>}
          <span className={locals.text}>{text}</span>
        </Fragment>
      )}
    </div>
  );
}
