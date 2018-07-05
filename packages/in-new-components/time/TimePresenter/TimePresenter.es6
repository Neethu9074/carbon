import React from 'react';

import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import { formatTime, formatDate } from 'in-services/formatters/date';
import format from 'in-new-components/time/timeframeFormatter';
import TimeIcon from 'in-new-components/time/TimeIcon';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './TimePresenter.mless';

export default connectTo(
  props => ({
    containsPastLiveData: containsPastLiveData$(props.timeConfig, props.containsPastLiveData)
  }),
  function TimePresenter({ onClick, timeConfig, className, expanded, refSetter, containsPastLiveData }) {
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
          <TimeIcon
            className={locals.timeIcon}
            containsPastLiveData={containsPastLiveData}
            timeConfig={timeConfig}
            selected={expanded}
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
);

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
