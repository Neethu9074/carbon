/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { Column, Dropdown } from '@instana/carbon';

import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';
import {
  dayIntervalOptions,
  daysOfTheWeekOptions
} from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';
import RepeatTypeSection from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/RepeatTypeSection';
import DateSection from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/DateSection';
import { isFieldValid, getValidationMessage } from 'in-service-levels/utils/form';
import { t } from 'in-i18n';

const monthlyIntervalOption = {
  value: 'months',
  label: t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.ofTheMonth')
};

export default function MonthlySection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const scheduleField = form.get('schedule');
  const daysOfTheWeekField = scheduleField.getIn(['recurrence', 'daysOfTheWeek']);
  const dayIntervalField = scheduleField.getIn(['recurrence', 'dayInterval']);
  const repeatTypeField = scheduleField.getIn(['recurrence', 'repeatType']);

  const isDaysOfTheWeekFieldValid = isFieldValid(daysOfTheWeekField);
  const isDayIntervalFieldValid = isFieldValid(dayIntervalField);

  const [dayOfTheWeek] = daysOfTheWeekField.value;
  return (
    <>
      <RepeatTypeSection />
      {repeatTypeField.value === 'day' && (
        <>
          <Column lg={4} md={4}>
            <Dropdown
              onChange={({ selectedItem }) =>
                onChange(['schedule', 'recurrence', 'dayInterval'], () =>
                  dayIntervalField.setValue(selectedItem?.value).setTouched(true)
                )
              }
              label="Select"
              invalid={!isDayIntervalFieldValid}
              invalidText={getValidationMessage(dayIntervalField)}
              titleText={t(
                'in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.repeatOnEvery'
              )}
              id="correction-window-monthly-interval"
              items={dayIntervalOptions}
              selectedItem={dayIntervalOptions.find(({ value }) => value === dayIntervalField.value)}
            />
          </Column>
          <Column lg={4} md={4}>
            <Dropdown
              onChange={({ selectedItem }) => {
                onChange(['schedule', 'recurrence', 'daysOfTheWeek'], () =>
                  daysOfTheWeekField.setValue(selectedItem ? [selectedItem.value] : []).setTouched(true)
                );
              }}
              label={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.select')}
              titleText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.day')}
              id="correction-window-days-of-the-week"
              invalid={!isDaysOfTheWeekFieldValid}
              invalidText={getValidationMessage(daysOfTheWeekField)}
              items={daysOfTheWeekOptions}
              selectedItem={daysOfTheWeekOptions.find(({ value }) => value === dayOfTheWeek)}
            />
          </Column>
          <Column lg={4} md={4}>
            <Dropdown
              label=""
              titleText={<wbr />}
              id="correction-window-window-interval-unit"
              items={[monthlyIntervalOption]}
              readOnly
              disabled
              selectedItem={monthlyIntervalOption}
            />
          </Column>
        </>
      )}
      {repeatTypeField.value === 'date' && <DateSection />}
    </>
  );
}
