/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  correctionOverlay,
  isCorrectionWindowMetricId,
  overlappingSectionsMetricId
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/correctionOverlay';
import {
  timeWindowIncludesFirstCollectionTimestamp,
  renderMissingDataIndicator
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/missingDataIndicator';
import { RenderWithMissingDataIndicatorProps } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import { lineWithThreshold } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithThreshold';
import { RenderProps, Renderer } from 'in-components/Chart/renderer/types';

type RenderWithThresholdAndMissingDataIndicatorProps = RenderWithMissingDataIndicatorProps & { isGreaterOp?: boolean };

function createLineWithThresholdAndMissingDataIndicatorRenderer({
  firstCollectedMetricTimestamp = 0,
  isGreaterOp = true
}: RenderWithThresholdAndMissingDataIndicatorProps): Renderer {
  return {
    id: 'lineWithThresholdAndMissingDataIndicator',
    render: ({ color, scale, config, dataSeries, metricId }: RenderProps) => {
      if (metricId === overlappingSectionsMetricId || (metricId && isCorrectionWindowMetricId(metricId))) {
        correctionOverlay.render({ color, scale, config, dataSeries, metricId });
        return;
      }

      lineWithThreshold.render({ color, scale, config, dataSeries, metricId, isGreaterOp });

      if (timeWindowIncludesFirstCollectionTimestamp(firstCollectedMetricTimestamp, config.timeConfig)) {
        renderMissingDataIndicator(config, firstCollectedMetricTimestamp);
      }
    }
  };
}
export function useLineWithThresholdAndMissingDataIndicatorRenderer(
  props: RenderWithThresholdAndMissingDataIndicatorProps
) {
  return createLineWithThresholdAndMissingDataIndicatorRenderer(props);
}

export default createLineWithThresholdAndMissingDataIndicatorRenderer({});
