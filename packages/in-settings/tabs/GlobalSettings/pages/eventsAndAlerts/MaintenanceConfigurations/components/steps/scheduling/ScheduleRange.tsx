/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import { useState } from 'react';
import { RRule } from 'rrule';
import React from 'react';

import { Stack, RadioButton, DateInput as CarbonDateInput } from '@instana/components';
import { formatDate } from '@instana/format-date';

import {
  setRRuleDateUntil,
  setRRuleCount,
  setInfiniteRRule
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { getSingle } from 'in-services/settings/settings';
import ErrorBoundary from 'in-components/ErrorBoundary';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, activeLocale } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm.mless';

interface ScheduleRangeProps {
  form: MapForm<any>;
  setValue: Function;
  setFormRRule: Function;
  rrule: RRule;
}

export default function ScheduleRange({ form, setValue, setFormRRule, rrule }: ScheduleRangeProps) {
  const [repeatType, setRepeatType] = useState(
    //@ts-expect-error-next-line
    (form.getIn(['window', 'recurrence', 'repeatType']) as Field<String>).value
  );
  // Because the date input automatically localizes to the user's local time, we might run
  // into a scenario where the user has UTC times displayed. In this case we need to display
  // a localized version of their date while maintaining a visually accurate version of their date
  const [dateDisplayed, setDateDisplayed] = useState<Date | undefined>(undefined);
  const [endDateDisplayed, setEndDateDisplayed] = useState<Date | undefined>(undefined);

  const untilValue = rrule.options.count || undefined;
  const formatTimeStampsAsUTC = getSingle('formatTimestampsAsUtc');

  return (
    <div>
      <h2 className={locals.stepTitle}>{t('in-settings:tabs.scheduleRange')}</h2>
      <Stack direction="vertical" gap={'normal'}>
        <div>
          <HorizontalFlexWrapper>
            <Label>{t('in-settings:maintenanceWindow.startFrom')}</Label>
          </HorizontalFlexWrapper>
          <ErrorBoundary name="dateInput-schedule-RMW">
            <CarbonDateInput
              value={dateDisplayed}
              dateFormat="d/m/Y"
              placeholder="dd/mm/yyyy"
              locale={activeLocale}
              //@ts-expect-error
              onChange={(v: Date[] | undefined) => {
                if (v && v.length > 0) {
                  const dateSelected = v[0];
                  setDateDisplayed(dateSelected);

                  let fieldDate = formatDate(dateSelected);

                  if (formatTimeStampsAsUTC) {
                    const day = dateSelected.getDate();
                    const month = dateSelected.getMonth();
                    const year = dateSelected.getFullYear();
                    fieldDate = formatDate(Date.UTC(year, month, day, 0, 0, 0));
                  }

                  return setValue(form, ['window', 'start', 'date'], fieldDate);
                }
              }}
            />
          </ErrorBoundary>
        </div>
        <div>
          <Label>{t('in-settings:tabs.repeatUntil')}</Label>
          <Stack direction="vertical" gap={'xxsmall'}>
            <RadioButton
              className={locals.repeatUntil}
              label={t('in-settings:maintenanceWindow.aDate')}
              checked={repeatType === 'aDate'}
              onChange={() => {
                setRepeatType('aDate');
                setValue(form, ['window', 'recurrence', 'repeatType'], 'aDate');
              }}
            />
            <RadioButton
              className={locals.repeatUntil}
              label={t('in-settings:maintenanceWindow.numOccur')}
              checked={repeatType === 'numOccur'}
              onChange={() => {
                setValue(form, ['window', 'recurrence', 'repeatType'], 'numOccur');
                setRepeatType('numOccur');
              }}
            />
            <RadioButton
              className={locals.repeatUntil}
              label={t('in-settings:maintenanceWindow.forever')}
              checked={repeatType === 'forever'}
              onChange={() => {
                const updatedForm = form.updateIn(
                  //@ts-expect-error-next-line
                  ['window', 'recurrence', 'repeatType'],
                  (fieldItem: Item) => (fieldItem as Field<string>).setValue('forever').setTouched(true) // In the case of a yearly recurrence we need to set the interval to one so the MW recurs every year
                );
                setFormRRule(updatedForm, setInfiniteRRule(rrule));
                setRepeatType('forever');
              }}
            />
          </Stack>
        </div>

        {repeatType === 'aDate' && (
          <div>
            <HorizontalFlexWrapper>
              <Label htmlFor={`dateUntil`}>{t('in-settings:maintenanceWindow.dateUntil')}</Label>
            </HorizontalFlexWrapper>
            <ErrorBoundary name="dateInput-schedule-RMW">
              <CarbonDateInput
                locale={activeLocale}
                value={endDateDisplayed}
                dateFormat="d/m/Y"
                placeholder="dd/mm/yyyy"
                //@ts-expect-error
                onChange={(v: Date[] | undefined) => {
                  if (v && v.length > 0) {
                    const dateSelected = v[0];
                    setEndDateDisplayed(dateSelected);

                    dateSelected.setHours(23, 59, 59, 99);
                    setFormRRule(form, setRRuleDateUntil(rrule, dateSelected));
                  }
                }}
              />
            </ErrorBoundary>
          </div>
        )}

        {repeatType === 'numOccur' && (
          <div>
            <HorizontalFlexWrapper>
              <Label htmlFor={`dateUntil`}>{t('in-settings:maintenanceWindow.occurences')}</Label>
            </HorizontalFlexWrapper>
            <Input
              type="number"
              id="recurrent-occurence"
              placeholder="#"
              onChange={v => setFormRRule(form, setRRuleCount(rrule, v.target.valueAsNumber))}
              value={untilValue}
              min="1"
            />
          </div>
        )}
      </Stack>
    </div>
  );
}
