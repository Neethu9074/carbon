/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import CustomDashboardMarkerLanes from './CustomDashboardMarkerLanes';

export default function ChartWidget({ actions, config, title, isPreview, dragHandle, customHeight }) {
  return (
    <UnifiedMetricsChart
      renderPostChartContent={markerLaneProps => (
        <CustomDashboardMarkerLanes
          config={config}
          markerLaneProps={markerLaneProps}
          openingDialogDisabled={isPreview}
          widgetTitle={title}
        />
      )}
      cardUseMaxAvailableHeight={!isPreview}
      rightHeaderContent={
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
      renderHistoricDataIndicator
    />
  );
}
