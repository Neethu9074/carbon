import React from 'react';

import { traceDetailFullyQualified } from 'in-analyze/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${traceDetailFullyQualified}/tree`,
    component: () => <span>TODO tree</span>
  },
  {
    label: 'Flow Map',
    path: `${traceDetailFullyQualified}/flowMap`,
    component: () => <span>TODO flow map</span>
  }
];
