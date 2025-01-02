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
  setRRuleByMonth,
  setRRuleFirstToLastAndWeekday
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import ComboBox, { Option } from 'in-components/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm.mless';

interface YearlyFrequencyProps {
  form: MapForm<any>;
  setFormRRule: Function;
  rrule: RRule;
}

export default function YearlyFrequency({ form, setFormRRule, rrule }: YearlyFrequencyProps) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const dayMonth = rrule.options.bymonth ? rrule.options.bymonth[0] : undefined;
  const nweekday = rrule.options.bynweekday ? rrule.options.bynweekday[0] : undefined;

  const dayNum = rrule.options.bymonthday ? rrule.options.bymonthday[0] : undefined;
  const [onMonth, setOnMonth] = useState(dayNum !== 0 && !nweekday);

  const [posDay, setPosDay] = useState<string | undefined>(nweekday?.length === 2 ? nweekday[1].toString() : undefined);
  const [weekDay, setWeekDay] = useState<string | undefined>(
    nweekday?.length === 2 ? nweekday[0].toString() : undefined
  );

  const setSpecificMonth = (val: number) => {
    setFormRRule(form, setRRuleByMonth(rrule, val));
  };

  const setDayNum = (val: number) => {
    setFormRRule(form, setRRuleByMonthDay(rrule, val, true));
  };
  useEffect(() => {
    if (weekDay && posDay) {
      let givenWeekDay = new Weekday(parseInt(weekDay));
      const givenPosDay = parseInt(posDay);

      givenWeekDay = givenWeekDay.nth(givenPosDay);
      setRRuleFirstToLastAndWeekday(rrule, givenWeekDay, true);
    }
  }, [posDay, rrule, weekDay]);

  return (
    <div>
      <Label>{t('in-settings:maintenanceWindow.on')}</Label>
      <Stack direction="vertical" gap="xsmall">
        <Stack direction="horizontal" gap="xsmall">
          <RadioButton
            onChange={() => {
              setPosDay(undefined);
              setWeekDay(undefined);
              setSpecificMonth(-1);
              setOnMonth(true);
            }}
            checked={onMonth}
          />
          <ComboBox
            options={months.map((month, idx) => ({
              value: (idx + 1).toString(),
              label: t('in-settings:maintenanceWindow.months', { context: month })
            }))}
            value={dayMonth?.toString() || null}
            onChange={v => setSpecificMonth(parseInt((v as Option).value))}
            isDisabled={!onMonth}
            placeholder={t('in-settings:maintenanceWindow.month')}
          />
          <Input
            type="number"
            id="monthly-recurrence-day"
            placeholder={t('in-settings:maintenanceWindow.dayNum')}
            disabled={!onMonth}
            value={dayNum || undefined}
            onChange={v => setDayNum(v.target.valueAsNumber)}
            className={locals.medInput}
            min="1"
            max="31"
          />
        </Stack>
        <Stack direction="horizontal" gap="xsmall" align="center">
          <RadioButton
            onChange={() => {
              setDayNum(0);
              setOnMonth(false);
            }}
            label={t('in-settings:maintenanceWindow.the')}
            checked={!onMonth}
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
            onChange={v => setPosDay((v as Option).value)}
            isDisabled={onMonth}
            isClearable={false}
            placeholder={t('in-settings:maintenanceWindow.number')}
          />
          <ComboBox
            options={[
              { value: RRule.MO.weekday.toString(), label: t('in-settings:maintenanceWindow.weekdays_monday') },
              { value: RRule.TU.weekday.toString(), label: t('in-settings:maintenanceWindow.weekdays_tuesday') },
              { value: RRule.WE.weekday.toString(), label: t('in-settings:maintenanceWindow.weekdays_wednesday') },
              { value: RRule.TH.weekday.toString(), label: t('in-settings:maintenanceWindow.weekdays_thursday') },
              { value: RRule.FR.weekday.toString(), label: t('in-settings:maintenanceWindow.weekdays_friday') },
              { value: RRule.SA.weekday.toString(), label: t('in-settings:maintenanceWindow.weekdays_saturday') },
              { value: RRule.SU.weekday.toString(), label: t('in-settings:maintenanceWindow.weekdays_sunday') }
            ]}
            value={weekDay}
            onChange={v => setWeekDay((v as Option).value)}
            isDisabled={onMonth}
            isClearable={false}
            placeholder={t('in-settings:maintenanceWindow.weekday')}
          />
          <Label> of </Label>
          <ComboBox
            options={months.map((month, idx) => ({
              value: (idx + 1).toString(),
              label: t('in-settings:maintenanceWindow.months', { context: month })
            }))}
            value={dayMonth?.toString() || null}
            onChange={v => setSpecificMonth(parseInt((v as Option).value))}
            isClearable={false}
            isDisabled={onMonth}
            placeholder={t('in-settings:maintenanceWindow.month')}
          />
        </Stack>
      </Stack>
    </div>
  );
}
