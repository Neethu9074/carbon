/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { renderStaticThresholdLineAndBackgrounds } from 'in-alerting/components/Chart/renderer/renderThresholdAndBackgrounds';
import { isGreaterOperatorOrUndefined } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { MultiMetricRenderProps, RenderAxis, Renderer } from 'in-components/Chart/renderer/types';
import { renderPredictions } from 'in-alerting/components/Chart/renderer/renderPredictions';
import renderer from 'in-components/Chart/renderer/Renderer';
import { ThresholdOperator } from 'in-types';

export function createLineWithThreshold(
  operator: ThresholdOperator,
  value: number | null,
  displayPredictions?: boolean
): Renderer<MultiMetricRenderProps> {
  return {
    render: ({ colors50, colors100, scale, config, metrics }): void => {
      const metric = metrics[0];
      const isGreaterOp = isGreaterOperatorOrUndefined(operator);
      const { backBufferCtx } = config;

      if (value != null) {
        renderStaticThresholdLineAndBackgrounds(config, scale, colors50, colors100, value, isGreaterOp);
      }

      // if displayPredictions is true, render predictions to the chart along with lowerbound and upperbound
      if (displayPredictions) {
        renderPredictions(config, metrics, scale);
      }

      // We render dotted line charts for predictions, so setLineDash to [] to keep the line chart for historical data.
      backBufferCtx.setLineDash([]);
      // render historical data
      renderer.line.render({ dataSeries: metric, color: colors100[0]!, scale, config });
    },
    enrich: (_config: unknown, axis: RenderAxis) => {
      axis.valuesDependOnEachOther = true;
    }
  };
}
