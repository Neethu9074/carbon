import { createField, createMapForm, notBlankValidator, composeValidators } from 'formalistic';
import { compose } from 'recompose';
import React from 'react';

import DateTimeInput from 'in-new-components/time/TimeSelectionDialogPresenter/DateTimeInput';
import { formatTime, formatDate, parseDateTime } from 'in-services/formatters/date';
import Header from 'in-new-components/time/TimeSelectionDialogPresenter/Header';
import { timeValidator, dateValidator } from 'in-services/validators/date';
import withPropDependingState from 'in-hoc/withPropDependingState';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Button from 'in-new-components/Button';

import locals from './CustomTime.mless';

const maximumWindow = 1000 * 60 * 60 * 24 * 31;

export default compose(
  withPropDependingState({
    getInitialState,

    resets: [
      {
        getResettingProps: () => ['timeframe'],
        onReset: getInitialState
      }
    ],

    reducerName: 'setForm',
    reducer: (prevState, newForm) => ({ form: newForm })
  })
)(CustomTime);

function getInitialState({ timeframe }) {
  return {
    form: createForm(timeframe)
  };
}

function CustomTime({ form, onChange, setForm }) {
  return (
    <form className={locals.wrapper} onSubmit={onSubmit}>
      <Header>Custom Time Range</Header>

      <DateTimeInput title="From" form={form} path="from" setValue={setValue} className={locals.from} />
      <DateTimeInput title="To" form={form} path="to" setValue={setValue} className={locals.to} />

      {form.touched &&
        form.messages.length > 0 && (
          <div className={locals.errors}>
            <TouchedMessages field={form} />
          </div>
        )}

      <div className={locals.buttons}>
        <Button type="submit" size="compact" kind="primary">
          Set Time
        </Button>
      </div>
    </form>
  );

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

function createForm(timeframe) {
  const to = timeframe.to || Date.now();
  const from = to - timeframe.windowSize;
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
        message: `The from date cannot be greather than the to date.`
      }
    ];
  } else if (to - from > maximumWindow) {
    return [
      {
        severity: 'error',
        message: `The largest selectable timespan is one month.`
      }
    ];
  }

  return null;
}

function getTime(form) {
  return parseDateTime(`${form.get('date').value} ${form.get('time').value}`).getTime();
}
