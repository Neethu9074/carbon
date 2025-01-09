/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { composeValidators, createField, createMapForm } from 'formalistic';
import { startOfDay, subDays, getTime as getTimestamp } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';

import { Button } from '@instana/components';

import {
  formatDate,
  formatDateShort,
  formatTime,
  formatTimeWithoutSeconds,
  parseDateTime
} from 'in-services/formatters/date';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import DateTimeInput from 'in-components/time/TimeSelectionDialogPresenter/DateTimeInput';
import DebouncedDistinctSlider from 'in-components/Slider/DebouncedDistinctSlider';
import Section from 'in-components/time/TimeSelectionDialogPresenter/Section';
import { dateValidator, timeValidator } from 'in-services/validators/date';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { days, hours, minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './CustomTime.mless';

const oneHour = hours.toMillis(1);
const maximumWindow = days.toMillis(31);

export default function CustomTime({ timeConfig, onChange }) {
  const [form, setForm] = useState(createForm(timeConfig));
  useEffect(() => setForm(createForm(timeConfig)), [timeConfig]);

  const from = getTime(form.get('from'));
  const to = getTime(form.get('to'));

  return (
    <Section title={t('in-components:time.customTimeTitleTimeRange')} light>
      <form onSubmit={onSubmit}>
        <TimeSlider form={form} setForm={setForm} from={from} to={to} />

        <div className={locals.controls}>
          <div className={locals.inputs}>
            <DateTimeInput form={form} path="from" setValue={setValue} />
            <span className={locals.to}>{t('in-components:time.to')}</span>
            <DateTimeInput form={form} path="to" setValue={setValue} />
          </div>
          <Button className={locals.button} type="submit" size="compact">
            {t('in-components:time.customTimeButtonSetTime')}
          </Button>
        </div>

        <div className={locals.notes}>
          {form.touched && form.messages.length > 0 && <TouchedMessages className={locals.error} field={form} />}
        </div>
      </form>
    </Section>
  );

  function TimeSlider({ form, setForm, from, to }) {
    const [now] = useState(Date.now());
    const tickPositions = useMemo(() => getTickPositions(now), [now]);

    return (
      <DebouncedDistinctSlider
        valueLabelFormat={val => `${formatDateShort(val)} ${formatTimeWithoutSeconds(val)}`}
        marks={tickPositions}
        min={tickPositions[0].value}
        max={tickPositions[tickPositions.length - 1].value}
        debounceMaxWait={minutes.toMillis(1)}
        step={oneHour}
        value={[from, to]}
        onChange={([newFrom, newTo]) => {
          let updateForm = form.updateIn(['from', 'date'], item => item.setValue(formatDate(newFrom)).setTouched(true));
          updateForm = updateForm.updateIn(['from', 'time'], item =>
            item.setValue(formatTime(newFrom)).setTouched(true)
          );
          updateForm = updateForm.updateIn(['to', 'date'], item => item.setValue(formatDate(newTo)).setTouched(true));
          updateForm = updateForm.updateIn(['to', 'time'], item => item.setValue(formatTime(newTo)).setTouched(true));
          setForm(updateForm);
        }}
      />
    );
  }

  function getTickPositions(now) {
    const getTimeMinusDays = numberOfDays => getTimestamp(subDays(startOfDay(new Date()), numberOfDays));

    const today = getTimeMinusDays(0);
    return [
      ...[
        getTimeMinusDays(7),
        getTimeMinusDays(6),
        getTimeMinusDays(5),
        getTimeMinusDays(4),
        getTimeMinusDays(3),
        getTimeMinusDays(2)
      ].map(timestamp => ({
        value: timestamp,
        label: getMark(timestamp)
      })),
      {
        value: getTimeMinusDays(1),
        label: t('in-components:time.customTimeLabelYesterday')
      },
      // 9 hours is the gap the label will need space. So there is no mark for today 00:00 before 9am
      now - today > oneHour * 9 && {
        value: getTimeMinusDays(0),
        label: t('in-components:time.customTimeLabelToday')
      },
      {
        value: now,
        label: t('in-components:time.customTimeLabelNow')
      }
    ].filter(Boolean);
  }

  function getMark(timestamp) {
    const date = new Date(timestamp);

    return (
      <div className={locals.mark}>
        <span>{formatDateWithActiveLanguage(timestamp, 'EEE')}</span>
        <span>
          {formatDateWithActiveLanguage(timestamp, 'LLL')} {date.getDate()}
        </span>
      </div>
    );
  }

  function setValue(form, path, value) {
    setForm(form.updateIn(path, item => item.setValue(value).setTouched(true)));
  }

  function onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!form.hierarchyValid) {
      setForm(form.setTouched(true, { recurse: true }));
      return;
    }

    const from = getTime(form.get('from'));
    const to = getTime(form.get('to'));
    onChange({
      windowSize: to - from,
      to
    });
  }
}

function createForm(timeConfig) {
  const to = timeConfig.to || Date.now();
  const from = to - timeConfig.windowSize;

  return (
    createMapForm({
      validator: validateForm,
      items: {
        from: getDateTimeSubForm(from),
        to: getDateTimeSubForm(to)
      }
    })
      // immediately force top-level error presentation
      .setTouched(true)
  );
}

function getDateTimeSubForm(ts) {
  return createMapForm()
    .put(
      'date',
      createField({
        value: formatDate(ts),
        validator: composeValidators(notBlankValidator, dateValidator)
      })
    )
    .put(
      'time',
      createField({
        value: formatTime(ts),
        validator: composeValidators(notBlankValidator, timeValidator)
      })
    );
}

function validateForm({ from: fromForm, to: toForm }) {
  if (!fromForm.valid || !toForm.valid) {
    return null;
  }

  const from = getTime(fromForm);
  const to = getTime(toForm);

  if (to <= from) {
    return [
      {
        severity: 'error',
        message: t('in-components:time.customTimeMessageTheStartDateCannotBeGreaterThanTheEndDate')
      }
    ];
  } else if (to - from > maximumWindow) {
    return [
      {
        severity: 'error',
        message: t('in-components:time.customTimeMessageTheLargestSelectableTimespanIsOneMonth')
      }
    ];
  }

  return null;
}

function getTime(form) {
  return parseDateTime(`${form.get('date').value} ${form.get('time').value}`).getTime();
}
