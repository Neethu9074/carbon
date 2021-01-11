import React from 'react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import useTimeConfig from 'in-hooks/useTimeConfig';
import pie from 'in-components/Chart/renderer/pie';

export default function ChartWidget({ actions, config, title, isPreview, dragHandle, customHeight }) {
  const timeConfig = useTimeConfig();

  // force different y1.renderer
  config.y1.renderer = pie.id;

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
      customHeight={isPreview ? '10rem' : customHeight}
    />
  );
}
