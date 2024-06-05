/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import {
  urlParameter,
  timeShifts,
  previousHourTimeShift,
  getTimeShiftLabel,
  translateOffsetToTimeShiftConfig
} from 'in-stores/time/shifting';
// @ts-expect-error needs TS migration
import { formatExact } from 'in-components/time/timeframeFormatter';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-components/Button/DropdownButton';
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

  const options = timeShifts
    .filter(({ offset }) => offset !== previousHourTimeShift.offset)
    .map(v => ({
      value: v.offset,
      label: renderItemContent(v, timeConfig) as any
    }));

  const valueLabel =
    timeShifts.find(timeShift => timeShift.offset === timeShiftOffset)?.label ||
    // fallback for non-predefined time shift offset values
    getTimeShiftLabel(translateOffsetToTimeShiftConfig(timeShiftOffset, timeConfig));
  return (
    <ComboBoxBehavior
      value={timeShiftOffset}
      options={options}
      onChange={timeShiftOffset => {
        onChange({ timeShiftOffset });
        onTimeShiftChange(timeShiftOffset);
      }}
      disableAutomaticOptionSorting
      aria-label={t('in-components:timeShift.changeSelectedTimeShift')}
    >
      {({ elementProps, isOpen }) => (
        // @ts-expect-error not fully matching expected type
        <DropdownButton
          {...elementProps}
          kind="secondary"
          icon="lib_datetime_time"
          expanded={isOpen}
          disabled={disabled}
        >
          {t('in-components:timeShift.timeShiftValue', { timeShiftValue: valueLabel })}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
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
    <div className={locals.overlay}>
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
