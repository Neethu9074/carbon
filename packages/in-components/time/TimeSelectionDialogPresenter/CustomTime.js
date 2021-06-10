/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, composeValidators } from 'formalistic';
import React, { useMemo, useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import {
  formatTime,
  formatDate,
  formatDateShort,
  parseDateTime,
  formatTimeWithoutSeconds
} from 'in-services/formatters/date';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { getHistoricOrLargeDataResult } from 'in-components/time/TimeSelection/TimeSelection';
import DateTimeInput from 'in-components/time/TimeSelectionDialogPresenter/DateTimeInput';
import Section from 'in-components/time/TimeSelectionDialogPresenter/Section';
import { timeValidator, dateValidator } from 'in-services/validators/date';
import DistinctSlider from 'in-components/Slider/DebouncedDistinctSlider';
import { notBlankValidator } from 'in-services/validators/string';
import { LARGE_DATA_MESSAGE } from 'in-components/time/TimeIcon';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { days, hours, minutes } from 'in-services/time';
import { emptyObject } from 'in-services/fixedObjects';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './CustomTime.mless';

const oneHour = hours.toMillis(1);
const maximumWindow = days.toMillis(32);

const historicDataMessage = retention =>
  t('in-components:time.customTimeHistoricDataMessage', { retention: retention });

export default function CustomTime({ timeConfig, onChange }) {
  const [form, setForm] = useState(createForm(timeConfig));
  useEffect(() => setForm(createForm(timeConfig)), [timeConfig]);

  const StyledTooltip = withStyles({
    tooltip: {
      color: 'white',
      backgroundColor: theme.lib.colors.N500,
      fontSize: '0.75rem',
      textAlign: 'center'
    }
  })(Tooltip);

  const from = getTime(form.get('from'));
  const to = getTime(form.get('to'));
  const updatedTimeConfig = { to, windowSize: to - from, focusedMoment: to };

  const historicOrLargeDataResult = useObservable(getHistoricOrLargeDataResult(updatedTimeConfig), [form]);
  const { containsHistoricData, retention } = historicOrLargeDataResult || emptyObject;

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
          <Button className={locals.button} type="submit">
            {t('in-components:time.customTimeButtonSetTime')}
          </Button>
        </div>

        <div className={locals.notes}>
          {form.touched && form.messages.length > 0 ? (
            <TouchedMessages className={locals.error} field={form} />
          ) : (
            <HistoricOrLargeDataMessage containsHistoricData={containsHistoricData} retention={retention} />
          )}
        </div>
      </form>
    </Section>
  );

  function TimeSlider({ form, setForm, from, to }) {
    const [now] = useState(Date.now());
    const tickPositions = useMemo(() => getTickPositions(now), [now]);

    return (
      <DistinctSlider
        valueLabelDisplay="auto"
        ValueLabelComponent={TimeSliderTooltip}
        marks={tickPositions}
        min={tickPositions[0].value}
        max={tickPositions[tickPositions.length - 1].value}
        debounceMaxWait={minutes.toMillis(1)}
        step={oneHour}
        value={[from, to]}
        onChange={([_from, _to]) => {
          let updateForm = form.updateIn(['from', 'date'], item => item.setValue(formatDate(_from)).setTouched(true));
          updateForm = updateForm.updateIn(['from', 'time'], item => item.setValue(formatTime(_from)).setTouched(true));
          updateForm = updateForm.updateIn(['to', 'date'], item => item.setValue(formatDate(_to)).setTouched(true));
          updateForm = updateForm.updateIn(['to', 'time'], item => item.setValue(formatTime(_to)).setTouched(true));
          setForm(updateForm);
        }}
      />
    );
  }

  function TimeSliderTooltip({ value, children, open }) {
    return (
      <StyledTooltip
        open={open}
        placement="top"
        title={
          <span>
            {formatDateShort(value)}
            <br />
            {formatTimeWithoutSeconds(value)}
          </span>
        }
      >
        {children}
      </StyledTooltip>
    );
  }

  function getTickPositions(now) {
    const getTimeMinusDays = days =>
      moment()
        .startOf('day')
        .subtract(days, 'days')
        .toDate()
        .getTime();

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

  function getMark(value) {
    const months = moment.monthsShort();
    const date = new Date(value);
    const days = moment.weekdaysShort();
    return (
      <div className={locals.mark}>
        <span>{days[date.getDay()]}</span>
        <span>
          {months[date.getMonth()]} {date.getDate()}
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

function HistoricOrLargeDataMessage(props) {
  if (props.containsHistoricData) {
    return (
      <HorizontalFlexWrapper>
        <SvgIcon className={locals.icon} type="lib_help_error_info_circle" size="xs" />
        <span className={locals.help}>{historicDataMessage(props.retention)}</span>
      </HorizontalFlexWrapper>
    );
  }

  if (props.largeData) {
    return (
      <HorizontalFlexWrapper>
        <SvgIcon className={locals.icon} type="lib_help_error_info_circle" size="xs" />
        <span className={locals.help}>{LARGE_DATA_MESSAGE}</span>
      </HorizontalFlexWrapper>
    );
  }

  return null;
}
