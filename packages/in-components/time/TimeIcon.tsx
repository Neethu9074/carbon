/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { Align, ThemeStyle } from 'in-components/Tooltip/store';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

import locals from './TimeIcon.mless';

export const historicDataMessage = (retention: number) =>
  t('in-components:time.timeIconHistoricDataMessage', { retention: retention });

export interface TimeIconProps {
  selected?: boolean;
  theme: ThemeStyle;
  tooltipTheme?: ThemeStyle;
  tooltipAlign?: Align;
  className: string;
}

export default function TimeIcon({ selected, theme = 'dark', className }: TimeIconProps) {
  if (carbonButtonEnabled) {
    return null;
  }
  return (
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
    </div>
  );
}
