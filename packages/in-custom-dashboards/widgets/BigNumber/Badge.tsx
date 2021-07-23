/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef, ReactNode } from 'react';
import { find } from 'lodash';

import * as colors from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';

// @ts-ignore
import locals from './Badge.mless';

export interface BadgeProps {
  colorId: string;
  children: ReactNode;
}

export default forwardRef<HTMLDivElement, BadgeProps>(function Badge({ children, colorId }, ref) {
  const color = find(colors, ({ id }) => id === colorId);
  if (!color) {
    return null;
  }
  const { backgroundColor, foregroundColor } = color;
  return (
    <div style={{ backgroundColor, color: foregroundColor }} className={locals.badge} ref={ref}>
      {children}
    </div>
  );
});
