import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import locals from './Row.mless';
import theme from 'in-themes';

export default function TopListRow({ item, selectedMetricFormatter }) {
  const formattedTraceCount = number.compact(item.traceCount);
  const percent = Math.min(item.contributed / item.total, 1);
  const positionPercent = `${percent * 100}%`;
  const color = theme.lib.colors.chart.strokeColors100[0];

  return (
    <li className={locals.row}>
      <div
        className={locals.contributed}
        style={{
          marginLeft: positionPercent
        }}
      >
        <Tooltip content="Average time contributed to trace.">
          <span
            className={evaluateClassNames({
              [locals.contributedAlignmentHelper]: true,
              [locals.leftAlignedContribution]: percent > 0.5
            })}
          >
            {selectedMetricFormatter(item.contributed)}
          </span>
        </Tooltip>
      </div>
      <div className={locals.hairLine} style={{ marginLeft: positionPercent, background: color }} />

      <div className={locals.bar}>
        <div
          className={locals.barInner}
          style={{
            width: positionPercent,
            background: color
          }}
        />
      </div>

      <div className={locals.description}>
        <div className={locals.left}>
          <SvgIcon type="lib_application_trace" width={24} height={24} className={locals.icon} />
          <Tooltip content="Trace entry">
            <span className={locals.label}>{item.endpoint.label}</span>
          </Tooltip>
          <Tooltip content="Number of traces">
            <span className={locals.numberOfTracesIndicator}>{`(${formattedTraceCount})`}</span>
          </Tooltip>
        </div>

        <div className={locals.right}>
          <Tooltip content={`Average trace duration across ${formattedTraceCount} traces.`}>
            <span className={locals.total}>{selectedMetricFormatter(item.total)}</span>
          </Tooltip>
        </div>
      </div>
    </li>
  );
}
