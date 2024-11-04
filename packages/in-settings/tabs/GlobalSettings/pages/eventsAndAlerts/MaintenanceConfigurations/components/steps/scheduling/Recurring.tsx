/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import { Frequency, RRule } from 'rrule';
import React from 'react';

import { Stack } from '@instana/components';

import MonthlyFrequency from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/scheduling/MonthlyFrequency';
import YearlyFrequency from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/scheduling/YearlyFrequency';
import WeeklyFrequency from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/scheduling/WeeklyFrequency';
import { setRRuleInterval } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { SetFormFunction } from 'in-settings/hooks/useEntityForm';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm.mless';

interface RecurringProps {
  form: MapForm<any>;
  recurrentType: number | Frequency;
  setForm: SetFormFunction;
  rrule: RRule;
  setFormRRule: (form: MapForm<any>, newRRule: RRule) => void;
}

export default function Recurring({ form, recurrentType, setForm, rrule, setFormRRule }: RecurringProps) {
  const recurrentTypeLabelName = ['yearly', 'monthly', 'weekly', 'daily'];
  //@ts-expect-error-next-line
  const intervalEvery = form.getIn(['window', 'recurrence', 'interval']) as Field<string>;
  return (
    <div>
      <h2 className={locals.stepTitle}>{t('in-settings:tabs.frequency')}</h2>
      {recurrentType !== RRule.YEARLY ? (
        <Stack direction="horizontal" gap="medium">
          <Stack direction="vertical" gap="xxsmall">
            <Label htmlFor={'recurring-every'}>{t('in-settings:tabs.every')}</Label>
            <Stack direction="horizontal" gap="xxsmall" align="center">
              <Input
                className={locals.smallInput}
                type="number"
                id="recurring-every"
                placeholder="#"
                onChange={v => {
                  //@ts-expect-error-next-line
                  let updatedForm = form.updateIn(['window', 'recurrence', 'rrule'], (fieldItem: Item) =>
                    (fieldItem as Field<RRule | null>)
                      .setValue(setRRuleInterval(rrule, v.target.valueAsNumber))
                      .setTouched(true)
                  );
                  //@ts-expect-error-next-line
                  updatedForm = updatedForm.updateIn(['window', 'recurrence', 'interval'], (fieldItem: Item) =>
                    (fieldItem as Field<string | undefined>).setValue(v.target.value).setTouched(true)
                  );

                  setForm(updatedForm);
                }}
                width="120px"
                value={intervalEvery.value}
                min="1"
                max={getMaxRecurrenceAndDuration(recurrentType)}
              />
              <Label htmlFor="recurring-every">
                {t('in-settings:maintenanceWindow.recurrentFrequency', {
                  context: recurrentTypeLabelName[recurrentType]
                })}
              </Label>
            </Stack>
          </Stack>
          {recurrentType === RRule.WEEKLY && <WeeklyFrequency form={form} setFormRRule={setFormRRule} rrule={rrule} />}
          {recurrentType === RRule.MONTHLY && (
            <MonthlyFrequency form={form} setFormRRule={setFormRRule} rrule={rrule} />
          )}
        </Stack>
      ) : (
        <div>
          <HorizontalFlexWrapper>
            <YearlyFrequency form={form} setFormRRule={setFormRRule} rrule={rrule} />
          </HorizontalFlexWrapper>
        </div>
      )}
    </div>
  );
}

function getMaxRecurrenceAndDuration(recurrentType: Frequency): string {
  if (recurrentType === RRule.DAILY) return '31';
  if (recurrentType === RRule.WEEKLY) return '52';
  if (recurrentType === RRule.MONTHLY) return '12';
  if (recurrentType === RRule.YEARLY) return '1';
  return '';
}
