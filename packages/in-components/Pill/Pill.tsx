/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { lighten } from 'in-services/formatters/color';

// @ts-ignore
import locals from './Pill.mless';

export const kinds = ['primary', 'info'];

type Kind = 'primnary' | 'info' | string;

interface PillProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  color?: string;
  lightenOpacity?: number;
  kind?: Kind;
}

export default forwardRef<HTMLSpanElement, PillProps>(function Pill(
  { id, className, children, color = '#000000', lightenOpacity = 0.1, kind = 'bold', ...props }: PillProps,
  ref
) {
  let style;
  // For users leveraging our pre-defined kinds, we do not support the color and lightenOpacity props.
  // Instead, it works similar to our Button component.
  if (kinds.indexOf(kind) === -1) {
    if (kind === 'inverted') {
      style = { color };
    } else if (kind === 'light') {
      style = {
        color,
        background: lighten(color, lightenOpacity)
      };
    } else if (kind === 'lighter') {
      style = {
        color: '#fff',
        background: '#BCC4CC'
      };
    } else {
      style = {
        background: color
      };
    }
  }

  return (
    <span id={id} className={classNames(locals.pill, `${locals[kind]}`, className)} style={style} ref={ref} {...props}>
      {children}
    </span>
  );
});
