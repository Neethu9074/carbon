/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { Align, ThemeStyle } from 'in-components/Tooltip/store';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './TimeIcon.mless';

export const historicDataMessage = (retention: number) =>
  t('in-components:time.timeIconHistoricDataMessage', { retention: retention });
export const LARGE_DATA_MESSAGE = t('in-components:time.timeIconLargeDataMessage');

export interface TimeIconProps {
  selected?: boolean;
  containsHistoricData?: boolean;
  retention: number;
  largeData?: boolean;
  theme: ThemeStyle;
  tooltipTheme?: ThemeStyle;
  tooltipAlign?: Align;
  className: string;
}

export default function TimeIcon({
  selected,
  containsHistoricData,
  retention,
  largeData,
  theme = 'dark',
  tooltipTheme = 'light',
  tooltipAlign = 'leftMiddle',
  className
}: TimeIconProps) {
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

type TooltipContentProps = { message: string };

function TooltipContent({ message }: TooltipContentProps) {
  return <div>{message}</div>;
}
