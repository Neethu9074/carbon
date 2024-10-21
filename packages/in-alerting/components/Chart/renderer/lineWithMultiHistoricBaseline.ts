/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Granularity, ThresholdOperator } from '@instana/types';

import { Highlight, renderHighlight } from 'in-alerting/components/Chart/renderer/renderThresholdAndBackgrounds';
import { HistoricBaselineDataForMultiThreshold } from 'in-alerting/components/Chart/renderer/historicBaseline';
import { renderMultiHistoricBaseline } from 'in-alerting/components/Chart/renderer/historicBaseline';
import { MultiMetricRenderProps, RenderAxis, Renderer } from 'in-components/Chart/renderer/types';
import line from 'in-components/Chart/renderer/line';

export const createLineWithMultiHistoricBaselineAndOptionalPotentialProblem = (
  operator: ThresholdOperator,
  warningThreshold: HistoricBaselineDataForMultiThreshold | undefined,
  criticalThreshold: HistoricBaselineDataForMultiThreshold | undefined,
  granularity: Granularity,
  highlight?: Highlight
): Renderer<MultiMetricRenderProps> => {
  return {
    render: ({ colors50, colors100, scale, config, metrics }): void => {
      const metric = metrics[0];

      renderMultiHistoricBaseline(
        config,
        scale,
        colors50,
        colors100,
        operator,
        warningThreshold,
        criticalThreshold,
        granularity,
        metric
      );

      if (highlight) {
        renderHighlight(config, scale, highlight);
      }

      // historical data
      line.render({ dataSeries: metric, color: colors100[0]!, scale, config });
    },
    enrich: (_config: unknown, axis: RenderAxis) => {
      axis.valuesDependOnEachOther = true;
    }
  };
};
