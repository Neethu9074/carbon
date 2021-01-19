/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import { find } from 'lodash';

import * as colors from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';

import locals from './Badge.mless';

export default forwardRef(function Badge({ children, colorId }, ref) {
  const { backgroundColor, foregroundColor } = find(colors, ({ id }) => id === colorId);
  return (
    <div style={{ backgroundColor, color: foregroundColor }} className={locals.badge} ref={ref}>
      {children}
    </div>
  );
});
