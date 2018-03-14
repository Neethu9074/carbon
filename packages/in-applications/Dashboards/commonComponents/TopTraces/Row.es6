import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { number } from 'in-services/formatters/number';
import Counter from 'in-new-components/Counter';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import locals from './Row.mless';

export default function TopListRow({ item, selectedMetricFormatter }) {
  const formattedTraceCount = number.compact(item.traceCount);
  const percent = Math.min(item.contributed / item.total, 1);
  const positionPercent = `${percent * 100}%`;

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
      <div className={locals.hairLine} style={{ marginLeft: positionPercent }} />

      <div className={locals.bar}>
        <div
          className={locals.barInner}
          style={{
            width: positionPercent
          }}
        />
      </div>

      <div className={locals.description}>
        <div className={locals.left}>
          <SvgIcon type="traces" width={16} className={locals.icon} />
          <Tooltip content="Trace entry">
            <span className={locals.label}>{item.endpoint.label}</span>
          </Tooltip>
          <Tooltip content="Number of traces">
            <Counter>{formattedTraceCount}</Counter>
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
