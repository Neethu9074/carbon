/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';
import { Field, Item, MapForm } from 'formalistic';
import { getTimezoneOffset } from 'date-fns-tz';
import { RRule } from 'rrule';

import { CarbonCheckbox, CarbonCheckboxGroup, Link, Message, Stack } from '@instana/components';
import { Duration, MaintenanceConfigV2 } from '@instana/types';
import { ButtonGroup } from '@instana/components';
import { useObservable } from '@instana/hooks';

import ScheduleRange from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/scheduling/ScheduleRange';
import {
  createRRuleFreq,
  setRRuleDtstart
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import Recurring from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/scheduling/Recurring';
import Timing from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/steps/scheduling/Timing';
import { getEntityIdView, userSettingsGeneral } from 'in-settings/navigation/paths';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { retriggerOpenAlertsEnabled } from 'in-services/featureFlags';
import { SetFormFunction } from 'in-settings/hooks/useEntityForm';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { parseDateTime } from 'in-services/formatters/date';
import { getSingle } from 'in-services/settings/settings';
import FormGroup from 'in-components/form/FormGroup';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm.mless';

export interface MaintenanceScheduleStepProps {
  form: MapForm<any>;
  setForm: SetFormFunction;
  entity: MaintenanceConfigV2;
}

export default function MaintenanceScheduleStep(props: MaintenanceScheduleStepProps) {
  const { form, setForm, entity } = props;
  // I expect the Typescript police to get me for using any but in this case the setValue property can be any value used in the form
  const setValue = (form: MapForm<any>, path: string[], value: any) => {
    //@ts-expect-error-next-line
    setForm(form.updateIn(path, item => (item as Field<any>).setValue(value).setTouched(true)));
  };
  const setFormRRule = (form: MapForm<any>, newRRule: RRule | Nullish) => {
    setValue(form, ['window', 'recurrence', 'rrule'], newRRule);
  };
  //@ts-expect-error-next-line
  const rrule = (form.getIn(['window', 'recurrence', 'rrule']) as Field<RRule>).value;
  const windowForm = form.get('window') as MapForm<any>;
  const dateStartField = (windowForm.getIn(['start', 'date']) as Field<String>).value;
  const timeField = (windowForm.getIn(['start', 'time']) as Field<String>).value;
  const duration = (windowForm.get('duration') as Field<Duration>).value;

  const TimezoneMessage = () => {
    //@ts-expect-error
    const timezoneIdFromEntity = entity.scheduling?.timezoneId;

    const currentTimezoneId = getSingle('formatTimestampsAsUtc')
      ? 'UTC'
      : new Intl.DateTimeFormat().resolvedOptions().timeZone;

    const settingsHref = useObservable(getEntityIdView(userSettingsGeneral, ''), []);

    const utcOffset = (timezoneID: string) => {
      if (timezoneID === 'UTC') return '+00:00';
      const pad = (val: number) => (val < 10 ? '0' + val : val);
      const offsetInMinutes = getTimezoneOffset(timezoneID) / 60000;
      const sign = offsetInMinutes >= 0 ? '+' : '-';
      const offset = Math.abs(offsetInMinutes);
      const hours = pad(Math.floor(offset / 60));
      const minutes = pad(offset % 60);

      return sign + hours + ':' + minutes;
    };

    const message =
      timezoneIdFromEntity && currentTimezoneId && timezoneIdFromEntity !== currentTimezoneId
        ? t('in-settings:maintenanceWindow.timezone.differenceMessage', {
            configTimezone: utcOffset(timezoneIdFromEntity),
            userTimezone: utcOffset(currentTimezoneId)
          }) + ' '
        : currentTimezoneId !== 'UTC'
        ? t('in-settings:maintenanceWindow.timezone.currentTimezoneMessage', {
            utc_offset: utcOffset(currentTimezoneId)
          }) + ' '
        : null;

    return (
      <div className={locals.timezoneMessage}>
        {message && (
          <Message withIcon small>
            <div>
              {message}
              <Link href={settingsHref || ''}>{t('in-settings:tabs.userSettings')}</Link>
            </div>
          </Message>
        )}
      </div>
    );
  };

  const [recurrentType, setRecrruentType] = useState(rrule ? rrule.options.freq : -1);

  useEffect(() => {
    let dateTimeStart: Date | null | undefined = null;
    try {
      dateTimeStart = parseDateTime(`${dateStartField} ${timeField}`);
    } catch (exception) {
      dateTimeStart = null;
    }

    if (!dateTimeStart) return;

    if (
      rrule &&
      timeField &&
      dateStartField &&
      !isNaN(dateTimeStart.getTime()) &&
      dateTimeStart.getTime() !== rrule.options.dtstart.getTime()
    ) {
      setForm(
        //@ts-expect-error-next-line
        form.updateIn(['window', 'recurrence', 'rrule'], item =>
          (item as Field<any>).setValue(setRRuleDtstart(rrule, dateTimeStart as Date)).setTouched(true)
        )
      );
    }
  }, [dateStartField, timeField, setForm, rrule, form]);

  const [allDayToggle, setAllDayToggle] = useState(duration?.amount === 1 && duration?.unit === 'DAYS');

  return (
    <FormGroup className={locals.mwWrapper}>
      <HorizontalFlexWrapper>
        <div className={locals.inputContainer}>
          <Stack direction="vertical" gap={'xsmall'}>
            <FormGroup>
              <h2 className={locals.stepTitle}>{t('in-settings:tabs.recurrence')}</h2>
              <ButtonGroup
                buttonPropsList={[
                  {
                    text: t('in-settings:maintenanceWindow.oneTime'),
                    key: -1,
                    onClick: () => {
                      resetFieldsUponFrequencySwitch(form, setForm, null);
                      setAllDayToggle(false);
                      setRecrruentType(-1);
                    }
                  },
                  {
                    text: t('in-settings:maintenanceWindow.daily'),
                    key: RRule.DAILY,
                    onClick: () => {
                      resetFieldsUponFrequencySwitch(form, setForm, RRule.DAILY);
                      setAllDayToggle(false);
                      setRecrruentType(RRule.DAILY);
                    }
                  },
                  {
                    text: t('in-settings:maintenanceWindow.weekly'),
                    key: RRule.WEEKLY,
                    onClick: () => {
                      resetFieldsUponFrequencySwitch(form, setForm, RRule.WEEKLY);
                      setAllDayToggle(false);
                      setRecrruentType(RRule.WEEKLY);
                    }
                  },
                  {
                    text: t('in-settings:maintenanceWindow.monthly'),
                    key: RRule.MONTHLY,
                    onClick: () => {
                      resetFieldsUponFrequencySwitch(form, setForm, RRule.MONTHLY);
                      setAllDayToggle(false);
                      setRecrruentType(RRule.MONTHLY);
                    }
                  },
                  {
                    text: t('in-settings:maintenanceWindow.yearly'),
                    key: RRule.YEARLY,
                    onClick: () => {
                      resetFieldsUponFrequencySwitch(form, setForm, RRule.YEARLY);
                      setAllDayToggle(false);
                      setRecrruentType(RRule.YEARLY);
                    }
                  }
                ]}
                segmented
                activeKey={recurrentType}
              />
            </FormGroup>
            {recurrentType !== -1 && (
              <Recurring
                recurrentType={recurrentType}
                setForm={setForm}
                rrule={rrule}
                setFormRRule={setFormRRule}
                form={form}
              />
            )}
            <Timing
              setValue={setValue}
              form={form}
              label={t('in-settings:tabs.startTime')}
              allDayToggle={allDayToggle}
              setAllDayToggle={setAllDayToggle}
              setForm={setForm}
              isRecurring={recurrentType !== -1}
            />
            {retriggerOpenAlertsEnabled && (
              <CarbonCheckboxGroup
                legendText={t('in-settings:tabs.notificationMWCheckboxGroup')}
                legendId="notifications"
              >
                <CarbonCheckbox
                  id="notificationsCheckEnabled"
                  checked={form.get('retriggerOpenAlertsEnabled').value || false}
                  labelText={t('in-settings:tabs.notificationMWCheckboxLabel')}
                  onChange={() => {
                    const currentVal = form.get('retriggerOpenAlertsEnabled').value;
                    setForm(form.updateIn(['retriggerOpenAlertsEnabled'], field => field.setValue(!currentVal)));
                  }}
                />
              </CarbonCheckboxGroup>
            )}
            <TimezoneMessage />
          </Stack>
        </div>
        {recurrentType !== -1 && (
          <ScheduleRange form={form} setValue={setValue} setFormRRule={setFormRRule} rrule={rrule} />
        )}
      </HorizontalFlexWrapper>

      <TouchedMessages field={form.get('window')} />
    </FormGroup>
  );
}

const resetFieldsUponFrequencySwitch = (
  form: MapForm<any>,
  setForm: SetFormFunction,
  newFreq: typeof RRule.MONTHLY | typeof RRule.DAILY | typeof RRule.WEEKLY | typeof RRule.YEARLY | Nullish
) => {
  // Resest interval
  let updatedForm = form.updateIn(
    //@ts-expect-error-next-line
    ['window', 'recurrence', 'interval'],
    (fieldItem: Item) => (fieldItem as Field<string>).setValue(newFreq !== RRule.YEARLY ? '' : '1').setTouched(false) // In the case of a yearly recurrence we need to set the interval to one so the MW recurs every year
  );
  // Reset Duration
  //@ts-expect-error-next-line
  updatedForm = updatedForm.updateIn(['window', 'duration'], (field: Item) =>
    (field as Field<Duration>).setValue({ amount: 0, unit: 'HOURS' }).setTouched(false)
  );
  // Reset Start Time
  //@ts-expect-error-next-line
  updatedForm = updatedForm.updateIn(['window', 'start', 'time'], field =>
    (field as Field<string>).setValue('').setTouched(false)
  );
  // Reset Start Date
  //@ts-expect-error-next-line
  updatedForm = updatedForm.updateIn(['window', 'start', 'date'], field =>
    (field as Field<string>).setValue('').setTouched(false)
  );
  // Reset RRule
  //@ts-expect-error-next-line
  updatedForm = updatedForm.updateIn(['window', 'recurrence', 'rrule'], field =>
    (field as Field<RRule | Nullish>).setValue(
      newFreq !== null && newFreq !== undefined ? createRRuleFreq(newFreq) : null
    )
  );

  setForm(updatedForm);
};
