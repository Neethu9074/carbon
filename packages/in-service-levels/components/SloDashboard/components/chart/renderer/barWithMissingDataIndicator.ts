/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  timeWindowIncludesFirstCollectionTimestamp,
  renderMissingDataIndicator
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/missingDataIndicator';
import {
  correctionOverlay,
  correctionWindowMetricId
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/correctionOverlay';
import { RenderWithMissingDataIndicatorProps } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import { MultiMetricRenderProps, Renderer } from 'in-components/Chart/renderer/types';
import Configuration from 'in-components/Chart/Configuration';
import renderer from 'in-components/Chart/renderer/Renderer';

function createBarWithMissingDataIndicatorRenderer({
  firstCollectedMetricTimestamp = 0
}: RenderWithMissingDataIndicatorProps): Renderer<MultiMetricRenderProps> {
  return {
    id: 'barWithMissingDataIndicator',
    render: data => {
      const { config, axis, colors, scale, metrics, metricIds, colors50, colors100, axisName } = data;
      const filteredValue = (config as unknown as Configuration).filteredDataSeries;
      const filteredMetricIds = [];
      const filteredMetrics = [];
      const filteredColors = [];
      const filteredColors50 = [];
      const filteredColors100 = [];

      for (let i = 0; i < metrics.length; i++) {
        const dataSeries = metrics[i];
        const metricId = metricIds[i];
        if (dataSeries.length === 0 || filteredValue.has(`${axisName}-${i}`)) {
          continue;
        }
        const color = colors100[i]!;
        if (metricId === correctionWindowMetricId) {
          correctionOverlay.render({ color, scale, config, dataSeries, metricId });
        } else {
          filteredMetricIds.push(metricId);
          filteredMetrics.push(metrics[i]);
          filteredColors.push(colors[i]);
          filteredColors50.push(colors50[i]);
          filteredColors100.push(colors100[i]);
        }
      }

      renderer.bar.render({
        metrics: filteredMetrics,
        scale: scale,
        config,
        // @ts-expect-error
        axis: { dynamicCalculatedBlockSizeMillis: config.granularity, ...axis },
        metricIds: filteredMetricIds,
        colors: filteredColors,
        colors50: filteredColors50,
        colors100: filteredColors100,
        axisName
      });

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
