import { find } from 'lodash';
import React from 'react';

import * as colors from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';

import locals from './Badge.mless';

export default function Badge({ children, colorId }) {
  const { backgroundColor, foregroundColor } = find(colors, ({ id }) => id === colorId);
  return (
    <div style={{ backgroundColor, color: foregroundColor }} className={locals.badge}>
      {children}
    </div>
  );
}
