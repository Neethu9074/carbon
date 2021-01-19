/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function ChartWidget({ actions, config, title, isPreview, dragHandle, customHeight }) {
  const timeConfig = useTimeConfig();

  return (
    <UnifiedMetricsChart
      timeConfig={timeConfig}
      cardUseMaxAvailableHeight={!isPreview}
      cardHeader={
        <>
          {dragHandle}
          {actions}
        </>
      }
      config={config}
      title={title}
      automaticallySize={!isPreview && !customHeight}
      customHeight={customHeight}
    />
  );
}
