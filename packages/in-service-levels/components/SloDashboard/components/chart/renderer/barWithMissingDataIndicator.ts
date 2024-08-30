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
import { DataSeries, RenderAxis, RenderConfig, RenderProps, Renderer } from 'in-components/Chart/renderer/types';
import Configuration from 'in-components/Chart/Configuration';
import renderer from 'in-components/Chart/renderer/Renderer';
import { ScaleType } from 'in-services/scale/scale';

interface BarProps {
  config: RenderConfig;
  axis?: RenderAxis;
  dataSeries: DataSeries;
  scale: ScaleType;
  colors?: string;
}

interface ExtendedRenderProps extends RenderProps {
  metrics: DataSeries[];
}

function createBarWithMissingDataIndicatorRenderer({
  firstCollectedMetricTimestamp = 0
}: RenderWithMissingDataIndicatorProps): Renderer {
  return {
    id: 'barWithMissingDataIndicator',
    render: data => {
      const { config, axis, dataSeries, colors, scale }: BarProps = data;

      const filteredValue = (config as unknown as Configuration).filteredDataSeries.size;

      renderer.bar.render({
        metrics: filteredValue === 1 ? [dataSeries] : axis!.metrics,
        colors100: colors,
        scale: scale,
        config,
        axis: { dynamicCalculatedBlockSizeMillis: config.granularity, ...axis },
        dataSeries,
        color: colors!
      } as ExtendedRenderProps);

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
