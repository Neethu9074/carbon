/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import { useState } from 'react';
import { RRule } from 'rrule';
import React from 'react';

import { Stack, RadioButton } from '@instana/components';
import { formatDate } from '@instana/format-date';

import {
  setRRuleDateUntil,
  setRRuleCount,
  setInfiniteRRule
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { parseDate } from 'in-services/formatters/date';
import ErrorBoundary from 'in-components/ErrorBoundary';
import DateInput from 'in-components/form/DateInput';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

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

  const [endDateStr, setEndDateStr] = useState(rrule.options.until ? formatDate(rrule.options.until) : '');
  const untilValue = rrule.options.count || undefined;
  //@ts-expect-error-next-line
  const dateField = form.getIn(['window', 'start', 'date']) as Field<string | Nullish>;

  return (
    <div>
      <h2 className={locals.stepTitle}>{t('in-settings:tabs.scheduleRange')}</h2>
      <Stack direction="vertical" gap={'normal'}>
        <div>
          <HorizontalFlexWrapper>
            <Label>{t('in-settings:maintenanceWindow.startFrom')}</Label>
          </HorizontalFlexWrapper>
          <ErrorBoundary name="dateInput-schedule-RMW">
            <DateInput
              placeholder="YYYY-MM-DD"
              value={dateField?.value}
              onChange={v => setValue(form, ['window', 'start', 'date'], v)}
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
              <DateInput
                placeholder="YYYY-MM-DD"
                onChange={v => {
                  if (v) {
                    setFormRRule(form, setRRuleDateUntil(rrule, parseDate(v)));
                    setEndDateStr(v);
                  }
                }}
                value={endDateStr}
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
