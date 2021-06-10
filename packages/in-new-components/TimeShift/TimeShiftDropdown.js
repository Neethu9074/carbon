/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  urlParameter,
  timeShifts,
  previousHourTimeShift,
  getTimeShiftLabel,
  translateOffsetToTimeShiftConfig
} from 'in-stores/time/shifting';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import { formatExact } from 'in-new-components/time/timeframeFormatter';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from './TimeShiftDropdown.mless';

const urlStateDefinition = {
  bind: [urlParameter]
};

export default function TimeShiftDropdown({ disabled, onChange: onTimeShiftChange }) {
  const timeConfig = useTimeConfig();
  const [{ timeShiftOffset }, onChange] = useUrlState(urlStateDefinition);

  const options = timeShifts
    .filter(({ disallowSelection, offset }) => disallowSelection !== true && offset !== previousHourTimeShift.offset)
    .map(v => ({
      value: v.offset,
      label: renderItemContent(v, timeConfig)
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
      ariaLabel={t('in-components:timeShift.changeSelectedTimeShift')}
    >
      {({ elementProps, isOpen }) => (
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

function renderItemContent(timeShiftConfig, timeConfig) {
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
