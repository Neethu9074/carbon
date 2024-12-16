/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonMenuButton as MenuButton, CarbonMenuItem as MenuItem, SvgIcon } from '@instana/components';
import { TimeConfig } from '@instana/types';

import {
  urlParameter,
  timeShifts,
  previousHourTimeShift,
  translateOffsetToTimeShiftConfig
} from 'in-stores/time/shifting';
// @ts-expect-error needs TS migration
import { formatExact } from 'in-components/time/timeframeFormatter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from './TimeShiftDropdown.mless';

const urlStateDefinition = {
  bind: [urlParameter]
};

export default function TimeShiftDropdown({
  disabled,
  onChange: onTimeShiftChange
}: {
  disabled: boolean;
  onChange: (offset: number) => void;
}) {
  const timeConfig = useTimeConfig();
  const [{ timeShiftOffset }, onChange] = useUrlState(urlStateDefinition);

  const label = timeShifts.find(timeShift => timeShift.offset === timeShiftOffset)?.label;

  return (
    <MenuButton
      id="timeshift"
      kind="tertiary"
      size="sm"
      menuAlignment="bottom-end"
      //@ts-expect-error Underlying Button accepts node but not the menu
      label={
        <div className={locals.title}>
          <SvgIcon
            type={'lib_datetime_time'}
            size="xs"
            aria-label={t('in-components:timeShift.changeSelectedTimeShift')}
          />
          {t('in-components:timeShift.timeShiftValue', { timeShiftValue: label })}
        </div>
      }
      disabled={disabled}
      className={locals.menu}
    >
      {timeShifts
        .filter(({ offset }) => offset !== previousHourTimeShift.offset)
        .map((v, index, array) => (
          // MenuItem label typed as string but actual underlying button will excecpt a node.
          <>
            <MenuItem
              //@ts-expect-error
              label={renderItemContent(v, timeConfig)}
              onClick={() => {
                const offset = v.offset;
                onChange({ timeShiftOffset: offset });
                onTimeShiftChange(offset as number);
              }}
              className={classNames({
                [locals.menuitem]: true,
                [locals.selected]: timeShiftOffset == v.offset
              })}
              aria-label={v.label}
            />
            {array.length - 1 > index}
          </>
        ))}
    </MenuButton>
  );
}

interface TimeShiftConfig {
  offset: number | 'auto';
  description: string;
  label: string;
}

function renderItemContent(timeShiftConfig: TimeShiftConfig, timeConfig: TimeConfig) {
  const timeShiftTimeConfig = {
    windowSize: timeConfig.windowSize,
    to: (timeConfig.to || Date.now()) + translateOffsetToTimeShiftConfig(timeShiftConfig.offset, timeConfig).offset
  };
  return (
    <div title="">
      <div className={locals.label}>{timeShiftConfig.label}</div>
      <div className={locals.description}>
        {timeShiftConfig.offset
          ? t('in-components:timeShift.compareToTimeShiftTimeConfig', {
              timeShiftTimeConfig: formatExact(timeShiftTimeConfig)
            })
          : timeShiftConfig.description}
      </div>
    </div>
  );
}
