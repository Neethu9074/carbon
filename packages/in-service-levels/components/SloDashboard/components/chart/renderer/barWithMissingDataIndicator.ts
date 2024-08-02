/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  timeWindowIncludesFirstCollectionTimestamp,
  renderMissingDataIndicator
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/missingDataIndicator';
import { RenderWithMissingDataIndicatorProps } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import { lineWithThreshold } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThreshold';
import { RenderProps, Renderer } from 'in-components/Chart/renderer/types';

function createBarWithMissingDataIndicatorRenderer({
  firstCollectedMetricTimestamp = 0
}: RenderWithMissingDataIndicatorProps): Renderer {
  return {
    id: 'barWithMissingDataIndicator',
    render: ({ color, scale, config, dataSeries, metricId }: RenderProps) => {
      lineWithThreshold.render({ color, scale, config, dataSeries, metricId });

      if (timeWindowIncludesFirstCollectionTimestamp(firstCollectedMetricTimestamp, config.timeConfig)) {
        renderMissingDataIndicator(config, firstCollectedMetricTimestamp);
      }
    }
  };
}
export function useBarWithMissingDataIndicatorRenderer(props: RenderWithMissingDataIndicatorProps) {
  return createBarWithMissingDataIndicatorRenderer(props);
}

export default createBarWithMissingDataIndicatorRenderer({});
