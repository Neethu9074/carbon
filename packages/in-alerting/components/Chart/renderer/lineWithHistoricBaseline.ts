/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Granularity } from '@instana/types';

import { Highlight, renderHighlight } from 'in-alerting/components/Chart/renderer/renderThresholdAndBackgrounds';
import { MultiMetricRenderProps, RenderAxis, Renderer } from 'in-components/Chart/renderer/types';
import { renderHistoricBaseline } from 'in-alerting/components/Chart/renderer/historicBaseline';
import line from 'in-components/Chart/renderer/line';
import { HistoricBaselineData } from 'in-types';

export const createLineWithBaselineAndOptionalPotentialProblem = (
  thresholdConfig: HistoricBaselineData,
  granularity: Granularity,
  highlight?: Highlight
): Renderer<MultiMetricRenderProps> => {
  return {
    render: ({ colors50, colors100, scale, config, metrics }): void => {
      const metric = metrics[0];

      renderHistoricBaseline(config, scale, colors50, colors100, thresholdConfig, granularity, metric);

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
