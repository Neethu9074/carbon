import { find } from 'lodash';
import React from 'react';

import { defaultFormatter, formatters } from 'in-stores/metric/formatters';
import BigNumberKpiCard from 'in-new-components/KpiCard/BigNumberKpiCard';

export default function BigNumber({ config, title, actions, dragHandle, isPreview }) {
  return (
    <BigNumberKpiCard
      config={config}
      title={title}
      actions={actions}
      dragHandle={dragHandle}
      useMaxAvailableHeight={!isPreview}
      formatter={(find(formatters, ({ id }) => id === config.formatter) || defaultFormatter).formatter}
    />
  );
}
