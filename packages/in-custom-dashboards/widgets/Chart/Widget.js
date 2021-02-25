/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';

export default function ChartWidget({ actions, config, title, isPreview, dragHandle, customHeight }) {
  return (
    <UnifiedMetricsChart
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
      shareMaxAxisDomain={config?.shareMaxAxisDomain}
    />
  );
}
