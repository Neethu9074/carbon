/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import { t } from 'in-i18n';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './TimeIcon.mless';

export const historicDataMessage = retention =>
  t('in-new-components:time.timeIconHistoricDataMessage', { retention: retention });
export const LARGE_DATA_MESSAGE = t('in-new-components:time.timeIconLargeDataMessage');

export default function TimeIcon({
  selected,
  containsHistoricData,
  retention,
  largeData,
  theme = 'dark',
  tooltipTheme = 'light',
  tooltipAlign = 'leftMiddle',
  className
}) {
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
        themeStyle={tooltipTheme}
        align={tooltipAlign}
        content={<TooltipContent message={historicDataMessage(retention)} />}
      >
        {content}
      </Tooltip>
    );
  }

  if (largeData) {
    return (
      <Tooltip themeStyle={tooltipTheme} align={tooltipAlign} content={<TooltipContent message={LARGE_DATA_MESSAGE} />}>
        {content}
      </Tooltip>
    );
  }

  return content;
}

function TooltipContent({ message }) {
  return <div>{message}</div>;
}
