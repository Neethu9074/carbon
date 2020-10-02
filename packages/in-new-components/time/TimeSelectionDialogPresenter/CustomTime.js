import { createField, createMapForm, notBlankValidator, composeValidators } from 'formalistic';
import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';

import { formatTime, formatDate, formatDateTime, parseDateTime } from 'in-services/formatters/date';
import DateTimeInput from 'in-new-components/time/TimeSelectionDialogPresenter/DateTimeInput';
import HorizontalFlexWrapper from '../../layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import Secion from 'in-new-components/time/TimeSelectionDialogPresenter/Section';
import DistinctSlider from 'in-new-components/Slider/DebouncedDistinctSlider';
import { timeValidator, dateValidator } from 'in-services/validators/date';
import { LARGE_DATA_MESSAGE } from 'in-new-components/time/TimeIcon';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { days, hours, minutes } from 'in-services/time';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './CustomTime.mless';

const oneHour = hours.toMillis(1);
const maximumWindow = days.toMillis(32);

export default function CustomTime({ timeConfig, containsHistoricData, onChange }) {
  const [form, setForm] = useState(createForm(timeConfig));
  useEffect(() => setForm(createForm(timeConfig)), [timeConfig]);

  const from = getTime(form.get('from'));
  const to = getTime(form.get('to'));

  return (
    <Secion title="Time Range" light>
      <form onSubmit={onSubmit}>
        <TimeSlider form={form} setForm={setForm} from={from} to={to} />

        <div className={locals.controls}>
          <div className={locals.inputs}>
            <DateTimeInput form={form} path="from" setValue={setValue} />
            <span className={locals.to}>to</span>
            <DateTimeInput form={form} path="to" setValue={setValue} />
          </div>
          <Button className={locals.button} type="submit">
            Set Time
          </Button>
        </div>

        <div className={locals.notes}>
          {form.touched && form.messages.length > 0 ? (
            <TouchedMessages className={locals.error} field={form} />
          ) : (
            containsHistoricData && <GranularityHint />
          )}
        </div>
      </form>
    </Secion>
  );

  function TimeSlider({ form, setForm, from, to }) {
    const [now] = useState(Date.now());
    const tickPositions = useMemo(() => getTickPositions(now), [now]);

    return (
      <DistinctSlider
        valueLabelDisplay="auto"
        valueLabelFormat={formatDateTime}
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
        label: 'Yesterday'
      },
      // 9 hours is the gap the label will need space. So there is no mark for today 00:00 before 9am
      now - today > oneHour * 9 && {
        value: getTimeMinusDays(0),
        label: 'Today'
      },
      {
        value: now,
        label: 'Now'
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
        message: 'The from date cannot be greater than the to date.'
      }
    ];
  } else if (to - from > maximumWindow) {
    return [
      {
        severity: 'error',
        message: 'The largest selectable timespan is one month.'
      }
    ];
  }

  return null;
}

function getTime(form) {
  return parseDateTime(`${form.get('date').value} ${form.get('time').value}`).getTime();
}

function GranularityHint() {
  return (
    <HorizontalFlexWrapper>
      <SvgIcon className={locals.icon} type="lib_help_error_info_circle" size="xs" />
      <span className={locals.help}>{LARGE_DATA_MESSAGE}</span>
    </HorizontalFlexWrapper>
  );
}
