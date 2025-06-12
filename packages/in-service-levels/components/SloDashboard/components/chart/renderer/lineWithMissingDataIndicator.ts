/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  correctionOverlay,
  isCorrectionWindowMetricId,
  overlappingSectionsMetricId
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/correctionOverlay';
import {
  renderMissingDataIndicator,
  timeWindowIncludesFirstCollectionTimestamp
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/missingDataIndicator';
import { Renderer, RenderProps } from 'in-components/Chart/renderer/types';
import renderer from 'in-components/Chart/renderer/Renderer';

export interface RenderWithMissingDataIndicatorProps {
  /**
   * Timestamp at which data collection for the rendered metrics has started.
   * If this timestamp is within the rendered time window the chart will be greyed out up to this timestamp.
   */
  firstCollectedMetricTimestamp?: number;
}

function createLineWithMissingDataIndicatorRenderer({
  firstCollectedMetricTimestamp = 0
}: RenderWithMissingDataIndicatorProps): Renderer {
  return {
    id: 'lineWithMissingDataIndicator',
    render: ({ color, scale, config, dataSeries, metricId }: RenderProps) => {
      if (metricId === overlappingSectionsMetricId || (metricId && isCorrectionWindowMetricId(metricId))) {
        correctionOverlay.render({ color, scale, config, dataSeries, metricId });
        return;
      }
      renderer.line.render({ color, scale, config, dataSeries, metricId });

      if (timeWindowIncludesFirstCollectionTimestamp(firstCollectedMetricTimestamp, config.timeConfig)) {
        renderMissingDataIndicator(config, firstCollectedMetricTimestamp);
      }
    }
  };
}

export function useLineWithMissingDataIndicatorRenderer(props: RenderWithMissingDataIndicatorProps) {
  return createLineWithMissingDataIndicatorRenderer(props);
}

export default createLineWithMissingDataIndicatorRenderer({});
