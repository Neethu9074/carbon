/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import theme from 'in-themes';
import React from 'react';

import { getSliFormatter } from 'in-custom-dashboards/widgets/Slo/sliFormatter';
import SloTimeTile from 'in-custom-dashboards/widgets/Slo/Tiles/SloTimeTile';
import { findResultMetric } from 'in-custom-dashboards/widgets/Slo/Widget';
import SloTile from 'in-custom-dashboards/widgets/Slo/Tiles/SloTile';
import { percentage } from 'in-services/formatters/number';

import locals from 'in-custom-dashboards/widgets/Slo/WidgetHeader.mless';

export function WidgetHeader({ slo, budget, isDynamic, isRolling, fromTimestamp, toTimestamp, result, sliEntity }) {
  const spent = findResultMetric(result, 'spent')?.[0][1];
  const sli = findResultMetric(result, 'sli')?.[0][1];
  const { green800, red800 } = theme.lib.colors;
  const sliColor = slo === null || sli === null ? '' : sli >= slo ? green800 : red800;
  const remaining = findResultMetric(result, 'remaining')?.[0][1];
  const budgetColor = !remaining ? '' : remaining > 0 ? green800 : red800;
  const sliFormatter = getSliFormatter(sliEntity);

  return (
    <>
      <div className={locals.tilesContainer}>
        <SloTile
          title="Status"
          value={sli && percentage.detailed(sli)}
          targetInfo="Target:"
          targetValue={slo && percentage.detailed(slo)}
          color={sliColor}
        />
        <SloTile
          title="Error Budget Spent"
          value={spent && sliFormatter(spent)}
          targetInfo="Error Budget:"
          targetValue={budget && sliFormatter(budget)}
          color={budgetColor}
        />
        <SloTimeTile
          title="Time Window"
          info={isDynamic ? 'Dynamic time window' : isRolling ? 'Rolling time window' : 'Fixed time window'}
          fromTimestamp={fromTimestamp}
          toTimestamp={toTimestamp}
        />
      </div>
      <div className={locals.listContainer}>
        <SloTile
          title="Status"
          value={sli && percentage.detailed(sli)}
          targetInfo="Target:"
          targetValue={slo && percentage.detailed(slo)}
          color={sliColor}
          smallRowStyle
        />
        <SloTile
          title="Error Budget Spent"
          value={spent && sliFormatter(spent)}
          targetInfo="Error Budget:"
          targetValue={budget && sliFormatter(budget)}
          color={budgetColor}
          smallRowStyle
        />
        <SloTimeTile
          info={isDynamic ? 'Dynamic time window' : isRolling ? 'Rolling time window' : 'Fixed time window'}
          fromTimestamp={fromTimestamp}
          toTimestamp={toTimestamp}
          smallRowStyle
        />
      </div>
    </>
  );
}

export default WidgetHeader;
