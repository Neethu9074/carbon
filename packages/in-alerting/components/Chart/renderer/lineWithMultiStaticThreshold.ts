/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderMultiStaticThresholdLinesAndBackgrounds } from 'in-alerting/components/Chart/renderer/renderThresholdAndBackgrounds';
import { isGreaterOperatorOrUndefined } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { MultiMetricRenderProps, RenderAxis, Renderer } from 'in-components/Chart/renderer/types';
import renderer from 'in-components/Chart/renderer/Renderer';
import { ThresholdOperator } from 'in-types';

export function createLineWithMultiStaticThreshold(
  operator: ThresholdOperator,
  warningThresholdValue: number | undefined,
  criticalThresholdValue: number | undefined
): Renderer<MultiMetricRenderProps> {
  return {
    render: ({ colors50, colors100, scale, config, metrics }): void => {
      const metric = metrics[0];
      const isGreaterOp = isGreaterOperatorOrUndefined(operator);

      renderMultiStaticThresholdLinesAndBackgrounds(
        config,
        scale,
        colors50,
        colors100,
        warningThresholdValue,
        criticalThresholdValue,
        isGreaterOp
      );

      renderer.line.render({ dataSeries: metric, color: colors100[0]!, scale, config });
    },
    enrich: (_config: unknown, axis: RenderAxis) => {
      axis.valuesDependOnEachOther = true;
    }
  };
}
