/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';

import { RenderConfig } from 'in-components/Chart/renderer/types';
import renderer from 'in-components/Chart/renderer/Renderer';
import { MetricDataSeries } from 'in-components/Chart/types';
import { ScaleType } from 'in-services/scale/scale';

export function renderPredictions(config: RenderConfig, metrics: MetricDataSeries[], scale: ScaleType) {
  const metricIds = get(config, ['y1', 'metricIds']) ?? [];
  const colors100Arr = get(config, ['y1', 'colors100']) ?? [];

  const predictionsIndex = metricIds.findIndex((ids: string) => ids === 'predictions');

  if (predictionsIndex > 0) {
    return renderer.line.render({
      dataSeries: metrics[predictionsIndex],
      color: colors100Arr[predictionsIndex]!,
      scale,
      config
    });
  }
}
