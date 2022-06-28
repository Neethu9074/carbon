/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';

import { renderHistoricBaseline } from 'in-alerting/components/Chart/renderer/historicBaseline';
import { AxisColor, Config, MetricDataSeries } from 'in-components/Chart/types';
import { RenderAxis, RenderConfig } from 'in-components/Chart/renderer/types';
import line from 'in-components/Chart/renderer/line';
import { ScaleType } from 'in-services/scale';

export default {
  render: ({
    colors50,
    colors100,
    scale,
    config,
    metrics
  }: {
    colors50: AxisColor[];
    colors100: AxisColor[];
    scale: ScaleType;
    config: RenderConfig;
    metrics: MetricDataSeries[];
  }): void => {
    validateProps(config);
    const metric = metrics[0];

    renderHistoricBaseline(config, scale, colors50, colors100);

    // historical data
    line.render({ dataSeries: metric, color: colors100[0]!, scale, config });
  },
  enrich: (_config: unknown, axis: RenderAxis) => {
    axis.valuesDependOnEachOther = true;
  }
};

function validateProps(config: Config) {
  if (__DEV__) {
    invariant(
      // @ts-expect-error threshold it not part of current type Axis
      Number(config.y1.sensitivity) >= 0,
      'Property "sensitivity" is missing in config. Example: y1={{ sensitivity, colors:[], ... }}'
    );
  }
}
