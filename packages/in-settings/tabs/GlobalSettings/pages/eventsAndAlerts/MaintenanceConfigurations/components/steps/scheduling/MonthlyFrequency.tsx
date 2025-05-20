/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';
import { RRule, Weekday } from 'rrule';
import { MapForm } from 'formalistic';

import { Stack, RadioButton } from '@instana/components';

import {
  setRRuleByMonthDay,
  resetRRuleFirstLastWeekday,
  resetRRuleByMonthDay,
  setRRuleFirstToLastAndWeekday
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import ComboBox, { Option } from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm.mless';

interface MonthlyFrequencyProps {
  form: MapForm<any>;
  setFormRRule: Function;
  rrule: RRule;
}

export default function MonthlyFrequency({ form, setFormRRule, rrule }: MonthlyFrequencyProps) {
  const dayNum = rrule.options.bymonthday ? rrule.options.bymonthday[0] || 0 : undefined;
  const nweekday = rrule.options.bynweekday ? rrule.options.bynweekday[0] : undefined;
  const [posDay, setPosDay] = useState<string | undefined>(nweekday?.length === 2 ? nweekday[1].toString() : undefined);
  const [weekDay, setWeekDay] = useState<string | undefined>(
    nweekday?.length === 2 ? nweekday[0].toString() : undefined
  );
  const [onDay, setOnDay] = useState<boolean>(weekDay && posDay ? false : true);

  useEffect(() => {
    if (
      !onDay &&
      weekDay &&
      posDay &&
      (!nweekday ||
        (nweekday &&
          nweekday.length === 2 &&
          (nweekday[1].toString() !== posDay || nweekday[0].toString() !== weekDay)))
    ) {
      let givenWeekDay = new Weekday(parseInt(weekDay));
      const givenPosDay = parseInt(posDay);
      givenWeekDay = givenWeekDay.nth(givenPosDay);
      setFormRRule(form, setRRuleFirstToLastAndWeekday(rrule, givenWeekDay, true));
    } else if (onDay && weekDay && posDay) {
      setPosDay(undefined);
      setWeekDay(undefined);
    }
  }, [posDay, rrule, weekDay, form, setFormRRule, nweekday, onDay]);
  const setByMonthDay = (val: number) => {
    setFormRRule(form, setRRuleByMonthDay(rrule, val, true));
  };

  return (
    <div>
      <Label>{t('in-settings:maintenanceWindow.on')}</Label>
      <Stack direction="vertical" gap="xsmall">
        <Stack direction="horizontal" gap="xsmall">
          <RadioButton
            onChange={() => {
              setOnDay(true);
              setFormRRule(form, resetRRuleFirstLastWeekday(rrule));
            }}
            label="Day"
            checked={onDay}
          />
          <div className={locals.smallInput}>
            <Input
              type="number"
              id="monthly-recurrence-day"
              placeholder="#"
              disabled={!onDay}
              onChange={v => {
                if (v.target.valueAsNumber <= 0) return;
                setByMonthDay(v.target.valueAsNumber);
              }}
              value={dayNum || ''}
              className={locals.smallInput}
              min="1"
              max="31"
            />
          </div>
        </Stack>
        <Stack direction="horizontal" gap="xsmall">
          <RadioButton
            onChange={() => {
              setOnDay(false);
              setFormRRule(form, resetRRuleByMonthDay(rrule));
            }}
            label="The"
            checked={!onDay}
          />
          <ComboBox
            options={[
              { value: '1', label: t('in-settings:maintenanceWindow.first') },
              { value: '2', label: t('in-settings:maintenanceWindow.second') },
              { value: '3', label: t('in-settings:maintenanceWindow.third') },
              { value: '4', label: t('in-settings:maintenanceWindow.fourth') },
              { value: '-1', label: t('in-settings:maintenanceWindow.last') }
            ]}
            value={posDay}
            onChange={v => setPosDay((v as Option)?.value)}
            placeholder={t('in-settings:maintenanceWindow.number')}
            disabled={onDay}
          />
          <ComboBox
            options={[
              {
                value: RRule.MO.weekday.toString(),
                label: t('in-settings:maintenanceWindow.weekdays', { context: 'monday' })
              },
              {
                value: RRule.TU.weekday.toString(),
                label: t('in-settings:maintenanceWindow.weekdays', { context: 'tuesday' })
              },
              {
                value: RRule.WE.weekday.toString(),
                label: t('in-settings:maintenanceWindow.weekdays', { context: 'wednesday' })
              },
              {
                value: RRule.TH.weekday.toString(),
                label: t('in-settings:maintenanceWindow.weekdays', { context: 'thursday' })
              },
              {
                value: RRule.FR.weekday.toString(),
                label: t('in-settings:maintenanceWindow.weekdays', { context: 'friday' })
              },
              {
                value: RRule.SA.weekday.toString(),
                label: t('in-settings:maintenanceWindow.weekdays', { context: 'saturday' })
              },
              {
                value: RRule.SU.weekday.toString(),
                label: t('in-settings:maintenanceWindow.weekdays', { context: 'sunday' })
              }
            ]}
            value={weekDay}
            onChange={v => setWeekDay((v as Option)?.value)}
            isClearable={false}
            placeholder={t('in-settings:maintenanceWindow.weekday')}
            disabled={onDay}
          />
        </Stack>
      </Stack>
    </div>
  );
}
