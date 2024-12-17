/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import { isValid, parse } from 'date-fns';
import React, { useState } from 'react';
import classNames from 'classnames';

import { Message, Stack, StackItem, SvgIcon, DateInput as CarbonDateInput } from '@instana/components';
import { Duration, TimeUnitType } from '@instana/types';
import { Link, Toggle } from '@instana/components';
import { useObservable } from '@instana/hooks';

//import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import formatInputTime from 'in-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { dateFormat, dateTimeFormat, formatDate } from 'in-services/formatters/date';
import { getEntityIdView, userSettingsGeneral } from 'in-settings/navigation/paths';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import ComboBox, { Option } from 'in-components/ComboBox';
import ErrorBoundary from 'in-components/ErrorBoundary';
import FormGroup from 'in-components/form/FormGroup';
import { getSetting$ } from 'in-services/settings';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm.mless';

interface TimingProps {
  setValue: Function;
  form: MapForm<any>;
  label: string;
  allDayToggle: boolean;
  setForm: Function;
  setAllDayToggle: Function;
  isRecurring: boolean;
}

const DurationUnit = {
  minutes: 'MINUTES' as TimeUnitType,
  hours: 'HOURS' as TimeUnitType,
  days: 'DAYS' as TimeUnitType
};

export default function Timing({
  setValue,
  form,
  label,
  allDayToggle,
  setForm,
  setAllDayToggle,
  isRecurring = false
}: TimingProps) {
  const windowForm = form.get('window') as MapForm<any>;
  const dateField = windowForm.getIn(['start', 'date']) as Field<string>;
  const timeField = windowForm.getIn(['start', 'time']) as Field<string>;
  const duration = (windowForm.get('duration') as Field<Duration>).value;

  // necessary for carbon date picker as it does not accept strings for dates
  const [dateDisplayed, setDateDisplayed] = useState<Date | undefined>(undefined);

  const asUtc = useObservable(getSetting$('formatTimestampsAsUtc'), ['formatTimestampsAsUtc']);

  const message = !asUtc && getTimeZoneInfoMessage(dateField.value, timeField.value, label);
  return (
    <div className={locals.processContainer}>
      <h2 className={locals.stepTitle}>{t('in-settings:tabs.timing')}</h2>
      <FormGroup withoutBottomMargin>
        <Stack direction="horizontal" gap="medium">
          <Stack direction="horizontal" gap="xsmall">
            <StackItem>
              <Toggle
                id="allDay"
                checked={allDayToggle}
                onToggle={() => {
                  if (!allDayToggle) {
                    let updatedForm = form.updateIn(['window', 'duration'], (field: Item) =>
                      (field as Field<Duration>).setValue({ amount: 1, unit: DurationUnit.days }).setTouched(true)
                    );
                    //@ts-expect-error-next-line
                    updatedForm = updatedForm.updateIn(['window', 'start', 'time'], field =>
                      //@ts-expect-error-next-line
                      (field as Field<string>).setValue('00:00:00').setTouched(true)
                    );
                    setForm(updatedForm);
                  } else {
                    let updatedForm = form.updateIn(['window', 'duration'], (field: Item) =>
                      (field as Field<Duration>).setValue({ amount: 0, unit: DurationUnit.hours }).setTouched(false)
                    );
                    //@ts-expect-error-next-line
                    updatedForm = updatedForm.updateIn(['window', 'start', 'time'], field =>
                      //@ts-expect-error-next-line
                      (field as Field<string>).setValue('').setTouched(false)
                    );
                    setForm(updatedForm);
                  }

                  setAllDayToggle(!allDayToggle);
                }}
              />
            </StackItem>
            <Label htmlFor="allDay">{t('in-settings:tabs.allDay')}</Label>
          </Stack>
          <StackItem>
            <Stack direction="vertical" gap="medium">
              <StackItem>
                <HorizontalFlexWrapper className={classNames(locals.labelWithTooltip, locals.bottomSpace)}>
                  <Label htmlFor={`maintenance-start-startTime`} hasError={!windowForm.valid && windowForm.touched}>
                    {t('in-settings:tabs.startTime')}
                  </Label>
                  <Tooltip content={<DescriptionTextWithCurrentTimeZone />} align="rightTop">
                    <SvgIcon size="xs" type="lib_help_error_info_outline" color="#2D4048" />
                  </Tooltip>
                </HorizontalFlexWrapper>
                <Input
                  type="text"
                  id={`maintenance-start-time`}
                  value={timeField.value}
                  placeholder="00:00:00"
                  onChange={e => setValue(form, ['window', 'start', 'time'], e.target.value)}
                  onBlur={e => setValue(form, ['window', 'start', 'time'], formatInputTime(e.target.value, 'HH:mm:ss'))}
                  hasError={!timeField.valid && timeField.touched}
                  className={locals.input}
                  disabled={allDayToggle}
                />
              </StackItem>
              {!isRecurring && (
                <StackItem>
                  <HorizontalFlexWrapper>
                    <Label htmlFor={`maintenance-start-date`} hasError={!windowForm.valid && windowForm.touched}>
                      {t('in-settings:maintenanceWindow.startDate')}
                    </Label>
                  </HorizontalFlexWrapper>
                  <ErrorBoundary name="dateInput-timing-RMW">
                    <CarbonDateInput
                      id={`maintenance-start-date`}
                      placeholder="YYYY-MM-DD"
                      value={dateDisplayed}
                      //@ts-expect-error
                      onChange={(dateArray: Date[] | undefined) => {
                        if (dateArray && dateArray.length > 0) {
                          const date = dateArray[0];
                          setDateDisplayed(dateDisplayed);

                          const dateString = formatDate(date);

                          setValue(form, ['window', 'start', 'date'], dateString);
                        }
                      }}
                      hasError={!dateField.valid && dateField.touched}
                    />
                  </ErrorBoundary>
                </StackItem>
              )}
            </Stack>
          </StackItem>
          <StackItem>
            <HorizontalFlexWrapper className={classNames(locals.labelWithTooltip, locals.bottomSpace)}>
              <Label htmlFor={`maintenance-duration`}>{t('in-settings:tabs.duration')}</Label>
              <Tooltip content={t('in-settings:maintenanceWindow.durationTooltipText')} align="rightTop">
                <SvgIcon size="xs" type="lib_help_error_info_outline" color="#2D4048" />
              </Tooltip>
            </HorizontalFlexWrapper>
            <HorizontalFlexWrapper className={locals.gap}>
              <Input
                type="number"
                id="maintenance-duration"
                placeholder="#"
                onChange={v => {
                  setValue(form, ['window', 'duration'], { ...duration, amount: v.target.valueAsNumber });
                }}
                value={duration.amount || ''}
                size={3}
                className={classNames(locals.doubleInput, locals.smallInput)}
                disabled={allDayToggle}
                min="1"
                max={getMaxDuration(duration.unit)}
              />
              <ComboBox
                options={[
                  { value: DurationUnit.minutes, label: t('in-settings:tabs.minutes') },
                  { value: DurationUnit.hours, label: t('in-settings:tabs.hours') },
                  { value: DurationUnit.days, label: t('in-settings:tabs.days') }
                ]}
                onChange={v => setValue(form, ['window', 'duration'], { ...duration, unit: (v as Option).value })}
                value={duration.unit}
                isDisabled={allDayToggle}
                isClearable={false}
              />
            </HorizontalFlexWrapper>
          </StackItem>
        </Stack>

        {message && (
          <Message className={locals.submessageWrapper} withIcon small>
            <div>{message}</div>
          </Message>
        )}
      </FormGroup>
      <TouchedMessages field={form.getIn(['window', 'recurrence'])} />
    </div>
  );
}

const getTimezone = () => new Intl.DateTimeFormat().resolvedOptions().timeZone;
const getUtcOffset = (date: number | Date) => formatDateWithActiveLanguage(date, 'xx');

const stdTimezoneOffset = (date: Date) => {
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);

  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

// This code uses the fact that getTimezoneOffset returns a greater value during Standard Time versus Daylight Saving Time (DST).
// Thus it determines the expected output during Standard Time, and it compares whether the output of the given date the same (Standard) or less (DST).
// Ref: https://stackoverflow.com/a/11888430
const isDstObserved = (date: Date) => {
  return date.getTimezoneOffset() < stdTimezoneOffset(date);
};

export function DescriptionTextWithCurrentTimeZone() {
  const asUtc = useObservable(getSetting$('formatTimestampsAsUtc'), ['formatTimestampsAsUtc']);
  const href = useObservable(getEntityIdView(userSettingsGeneral, ''), []);
  const texts = {
    timezone: t('in-settings:tabs.yourCurrentTimezoneIs', { tz: getTimezone() }),
    utcTimezone: t('in-settings:tabs.allDatesAndTimesAreInUtc'),
    utcOffset: t('in-settings:tabs.utcOffset', {
      utcOffSet: getUtcOffset(new Date()),
      isDST: isDstObserved(new Date()) ? t('in-settings:tabs.dstIsInEffect') : ''
    }),
    changeToUtc: t('in-settings:tabs.youCanChangeThisToUtc'),
    changeToLocalTime: t('in-settings:tabs.youCanChangeThisToLocalTime')
  };

  const message =
    (asUtc
      ? texts.utcTimezone + ' ' + texts.changeToLocalTime
      : texts.timezone + ' ' + texts.utcOffset + ' ' + texts.changeToUtc) + ' ';

  return (
    <div>
      {message}
      {href && <Link>{t('in-settings:tabs.userSettingsGeneralUserInterfaceSettings')}</Link>}
    </div>
  );
}
const getTimeZoneInfoMessage = (dateFieldValue: string, timeFieldValue: string, label: string) => {
  const toDate = (dateFieldValue: string, timeFieldValue: string) =>
    dateFieldValue && timeFieldValue
      ? parse(dateFieldValue + ' ' + formatInputTime(timeFieldValue, 'HH:mm:ss'), dateTimeFormat, new Date())
      : parse(dateFieldValue, dateFormat, new Date());
  if (dateFieldValue) {
    const currentTimeZone = getTimezone();
    const currentDateIsDst = isDstObserved(new Date());
    const selectedDate = toDate(dateFieldValue, timeFieldValue);
    const isSelectedDateValid = isValid(selectedDate);
    const selectedDateIsDst = isSelectedDateValid && isDstObserved(selectedDate);
    const selectedUtcOffset = isSelectedDateValid && getUtcOffset(selectedDate);

    let dstMsg = '';
    if (currentDateIsDst && !selectedDateIsDst) {
      dstMsg = t('in-settings:tabs.dstNotInEffect');
    }
    if (!currentDateIsDst && selectedDateIsDst) {
      dstMsg = t('in-settings:tabs.dstInEffect');
    }

    return (
      isSelectedDateValid &&
      dstMsg &&
      t('in-settings:tabs.dstMsg', {
        dstMsg: dstMsg,
        label: label,
        currentTimeZone: currentTimeZone,
        selectedUtcOffset: selectedUtcOffset
      })
    );
  } else {
    return null;
  }
};

function getMaxDuration(duration: TimeUnitType): string {
  if (duration === DurationUnit.minutes) return '527040';
  if (duration === DurationUnit.hours) return '8784';
  if (duration === DurationUnit.days) return '365';
  return '';
}
