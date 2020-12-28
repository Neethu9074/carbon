import classNames from 'classnames';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './TimeIcon.mless';

export const historicDataMessage = retention =>
  'You are viewing approximate data due to the data retention settings. Precise data is available within the last ' +
  retention +
  ' days.';
export const LARGE_DATA_MESSAGE =
  'You are viewing approximate data due to a large data set. Please reduce the time range for precise data.';

export default function TimeIcon({ selected, containsHistoricData, retention, largeData, theme = 'dark', className }) {
  const content = (
    <div
      className={classNames({
        [locals.iconWrapper]: true,
        [locals[theme]]: true,
        [className]: className
      })}
    >
      <SvgIcon
        className={classNames({
          [locals.timeIcon]: true,
          [locals.timeIconExpanded]: selected
        })}
        type="lib_datetime_time"
      />

      {containsHistoricData && <SvgIcon size="xs" className={locals.indicator} type="lib_help_error_error_circle" />}

      {largeData && <SvgIcon size="xs" className={locals.indicator} type="lib_approximately_equal" />}
    </div>
  );

  if (containsHistoricData) {
    return (
      <Tooltip
        themeStyle="light"
        align="leftMiddle"
        content={<TooltipContent message={historicDataMessage(retention)} />}
      >
        {content}
      </Tooltip>
    );
  }

  if (largeData) {
    return (
      <Tooltip themeStyle="light" align="leftMiddle" content={<TooltipContent message={LARGE_DATA_MESSAGE} />}>
        {content}
      </Tooltip>
    );
  }

  return content;
}

function TooltipContent({ message }) {
  return <div>{message}</div>;
}
