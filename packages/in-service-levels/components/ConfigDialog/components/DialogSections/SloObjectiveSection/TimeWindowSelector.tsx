/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, SvgIcon, Select, Input, ValidationBlock } from '@instana/components';
import { DurationUnitType, TimeWindowType } from '@instana/types';

import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { getMaxTimeWindowDurationValue } from 'in-service-levels/utils/time';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import DateInput from 'in-components/form/DateInput/DateInput';
import TimeInput from 'in-components/TimeInput/TimeInput';
import { titleWidth } from 'in-service-levels/constants';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

import locals from './SloObjectiveSection.mless';

export default function TimeWindowSelector() {
  const { form, onChange } = useContext(SloFormContext);
  const windowTypeField = form.getIn(['objective', 'type']);
  const windowDurationField = form.getIn(['objective', 'duration']);
  const windowDurationUnitField = form.getIn(['objective', 'durationUnit']);
  const dateField = form.getIn(['objective', 'startTimestamp', 'date']);
  const timeField = form.getIn(['objective', 'startTimestamp', 'time']);
  const timeStamp = form.getIn(['objective']);
  const isFixed = windowTypeField.value === 'fixed';
  const isTimeFieldValid = isFieldValid(timeField);
  const isDateFieldValid = isFieldValid(dateField);

  return (
    <>
      <SelectInSection
        id="time-window-type"
        label={t('in-service-levels:createSloDialog.timeWindow')}
        value={windowTypeField.value}
        onChange={e => {
          onChange(['objective', 'type'], () =>
            windowTypeField.setValue(e.target.value as TimeWindowType).setTouched(true)
          );
        }}
        titleWidth={titleWidth}
      >
        <option value="fixed">{t('in-service-levels:general.timeWindow.type_fixed')}</option>
        <option value="rolling">{t('in-service-levels:general.timeWindow.type_rolling')}</option>
      </SelectInSection>

      <Section
        title={t('in-service-levels:createSloDialog.length')}
        titleHtmlFor="time-window-size"
        titleWidth={titleWidth}
      >
        <Stack direction="horizontal" gap="xsmall">
          <Input
            className={locals.objectiveInput}
            type="number"
            id="time-window-size"
            value={windowDurationField.value}
            onChange={e => {
              onChange(['objective', 'duration'], () =>
                windowDurationField.setValue(Number(e.target.value)).setTouched(true)
              );
            }}
            min="1"
            max={getMaxTimeWindowDurationValue(windowDurationUnitField.value)}
            hasError={!windowDurationField.valid && windowDurationField.touched}
          />
          <Select
            value={windowDurationUnitField.value}
            onChange={e => {
              onChange(['objective', 'durationUnit'], () =>
                windowDurationUnitField.setValue(e.target.value as DurationUnitType).setTouched(true)
              );
            }}
          >
            <option value="day">
              {t('in-service-levels:general.timeWindow.option_day', { count: windowDurationField.value })}
            </option>
            <option value="week">
              {t('in-service-levels:general.timeWindow.option_week', { count: windowDurationField.value })}
            </option>
          </Select>
        </Stack>
        {!timeStamp.valid &&
          timeStamp.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
      </Section>

      {isFixed && (
        <Section title={t('in-service-levels:createSloDialog.start')} titleWidth={titleWidth}>
          <Stack direction="horizontal" gap="xsmall" inline align="center">
            <DateInput
              fixedWidth
              value={dateField.value}
              iconType="lib_datetime_date"
              onChange={date => {
                onChange(['objective', 'startTimestamp', 'date'], () =>
                  dateField.setValue(date as string).setTouched(true)
                );
              }}
            />

            <Stack direction="horizontal" gap="xsmall" inline align="center">
              <TimeInput
                id="slo-objective-time-input"
                value={timeField.value}
                onChange={time => {
                  onChange(['objective', 'startTimestamp', 'time'], () => timeField.setValue(time).setTouched(true));
                }}
                hasError={!timeField.valid && timeField.touched}
              />
              <label htmlFor="slo-objective-time-input">
                <SvgIcon aria-label="time_icon" type="lib_datetime_time" />
              </label>
            </Stack>
          </Stack>
          {!isDateFieldValid &&
            dateField.messages.map(({ message }, index) => (
              <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
            ))}
          {!isTimeFieldValid &&
            timeField.messages.map(({ message }, index) => (
              <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
            ))}
        </Section>
      )}
    </>
  );
}
