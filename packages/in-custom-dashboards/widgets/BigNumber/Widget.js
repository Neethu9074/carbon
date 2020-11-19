import React from 'react';

import BigNumberKpiCard from 'in-new-components/KpiCard/BigNumberKpiCard';
import { getFormatter } from 'in-stores/metric/formatters';

export default function BigNumber({ config, title, actions, dragHandle, isPreview }) {
  return (
    <BigNumberKpiCard
      config={config}
      title={title}
      actions={actions}
      dragHandle={dragHandle}
      useMaxAvailableHeight={!isPreview}
      formatter={getFormatter(config.formatter)}
    />
  );
}
