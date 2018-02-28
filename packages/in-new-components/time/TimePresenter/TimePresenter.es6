import React from 'react';

import format from 'in-new-components/time/timeframeFormatter';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import { formatTime, formatDate } from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import locals from './TimePresenter.mless';

export default function TimePresenter({ onClick, timeframe, className, expanded, refSetter }) {
  return (
    <Tooltip align="bottomMiddle" content={getTooltipContent(timeframe)}>
      <a
        className={joinClassNames(locals.wrapper, className)}
        href="#"
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          onClick();
        }}
        ref={refSetter}
      >
        <SvgIcon
          width={16}
          className={evaluateClassNames({
            [locals.timeIcon]: true,
            [locals.timeIconExpanded]: expanded
          })}
          type="time"
        />

        <span
          className={evaluateClassNames({
            [locals.timeSetting]: true,
            [locals.timeSettingExpanded]: expanded
          })}
        >
          {format(timeframe)}
        </span>

        <SvgIcon
          width={8}
          className={evaluateClassNames({
            [locals.toggleIcon]: true,
            [locals.toggleIconExpanded]: expanded
          })}
          type="triangle_down"
        />
      </a>
    </Tooltip>
  );
}

function getTooltipContent(timeframe) {
  const to = timeframe.to || Date.now();
  const from = to - timeframe.windowSize;

  const fromDate = `${formatDate(from)} ${formatTime(from)}`;
  const toDate = `${formatDate(to)} ${formatTime(to)}`;

  return (
    <div className={locals.tooltip}>
      <div>{fromDate}</div>
      <div>to</div>
      <div>{toDate}</div>
    </div>
  );
}
