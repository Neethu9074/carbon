import React from 'react';

import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import { formatTime, formatDate } from 'in-services/formatters/date';
import format from 'in-new-components/time/timeframeFormatter';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './TimePresenter.mless';

export default function TimePresenter({ onClick, timeConfig, className, expanded, refSetter }) {
  return (
    <Tooltip themeStyle="light" align="bottomMiddle" content={getTooltipContent(timeConfig)}>
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
          className={evaluateClassNames({
            [locals.timeIcon]: true,
            [locals.timeIconExpanded]: expanded
          })}
          type="lib_datetime_time_inverted"
          width={24}
        />

        <span
          className={evaluateClassNames({
            [locals.timeSetting]: true,
            [locals.timeSettingExpanded]: expanded
          })}
        >
          {format(timeConfig)}
        </span>

        <SvgIcon
          width={24}
          className={evaluateClassNames({
            [locals.toggleIcon]: true,
            [locals.toggleIconExpanded]: expanded
          })}
          type="lib_arrow_drop_down"
        />
      </a>
    </Tooltip>
  );
}

function getTooltipContent(timeConfig) {
  const to = timeConfig.to || Date.now();
  const from = to - timeConfig.windowSize;

  const fromDate = `${formatDate(from)} ${formatTime(from)}`;
  const toDate = `${formatDate(to)} ${formatTime(to)}`;

  return (
    <div className={locals.tooltip}>
      <div className={locals.tooltipFrom}>{fromDate}</div>
      <div className={locals.tooltipLabel}>to</div>
      <div className={locals.tooltipTo}>{toDate}</div>
    </div>
  );
}
