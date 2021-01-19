/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField } from 'formalistic';
import React from 'react';

import { refresh, deleteSessionSettings, setSessionSettings } from 'in-settings/tabs/AuthSettings/api/sessionSettings';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import { getSessionSettingsAsResultObservable } from '../../api/sessionSettings';
import { formatDurationAccurately } from 'in-services/formatters/date';
import DistinctSlider from 'in-new-components/Slider/DistinctSlider';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import { days, minutes, hours } from 'in-services/time';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';

import locals from './SessionSettings.mless';

const minTokenLifeTime = minutes.toMillis(15);
const maxTokenLifeTime = days.toMillis(7);
const tokenLifeTimeDomain = maxTokenLifeTime - minTokenLifeTime;

export default function SessionSettings() {
  return (
    <ApiItemView
      getObservables={() => ({
        config: getSessionSettingsAsResultObservable()
      })}
      onCancelClick={refresh}
      enrichForm={enrichForm}
      deleteItem={deleteItem}
      deleteLabel="Reset"
      saveItem={saveItem}
      render={render}
    />
  );
}

function render({ form, setForm }) {
  return (
    <>
      <Title title="Configure Session Settings" />
      <SubViewHeader>Session Settings</SubViewHeader>

      <form>
        <TokenLifeTimeSlider form={form} setForm={setForm} />
        <IdleTimeSlider form={form} setForm={setForm} />
      </form>
    </>
  );
}

function TokenLifeTimeSlider({ form, setForm }) {
  const formatTime = normalizedValue =>
    formatDurationAccurately(minTokenLifeTime + normalizedValue * tokenLifeTimeDomain);

  const labeledTicks = [
    {
      value: 0,
      label: formatDurationAccurately(minTokenLifeTime)
    },
    ...[hours.toMillis(1), hours.toMillis(6), hours.toMillis(12), days.toMillis(1)].map(timespan => ({
      value: getNormalizedTokenValue(timespan),
      label: formatDurationAccurately(timespan)
    })),
    {
      value: 1,
      label: formatDurationAccurately(maxTokenLifeTime)
    }
  ];

  return (
    <FormInput
      form={form}
      description="Sets the time after which the user needs to login again."
      label="Token life time"
      fieldName="tokenLifeTimeInMillis"
      labeledTicks={labeledTicks}
      min={0}
      max={1}
      step={0.001}
      valueLabelFormat={normalizedValue => formatTime(denormalizeValue(normalizedValue))}
      onChange={sliderValue =>
        setForm(form.updateIn(['tokenLifeTimeInMillis'], f => f.setValue(sliderValue).setTouched(true)))
      }
    />
  );
}

function IdleTimeSlider({ form, setForm }) {
  const min = minutes.toMillis(1);
  const max = hours.toMillis(8);
  const formatTime = formatDurationAccurately;
  const labeledTicks = [min, hours.toMillis(1), max].map(value => ({
    value,
    label: formatTime(value)
  }));

  return (
    <FormInput
      form={form}
      description="If the Instana UI browser tab has been hidden for the specified amount of time, the token will be invalidated."
      label="Idle time"
      fieldName="idleTimeInMillis"
      labeledTicks={labeledTicks}
      min={min}
      max={max}
      step={min}
      valueLabelFormat={value => formatTime(value)}
      onChange={sliderValue =>
        setForm(form.updateIn(['idleTimeInMillis'], f => f.setValue(sliderValue).setTouched(true)))
      }
    />
  );
}

function FormInput({ form, fieldName, labeledTicks, label, description, onChange, min, max, step, valueLabelFormat }) {
  return form.get(fieldName).map(field => (
    <FormGroup className={locals.formGroup}>
      <Label className={locals.label} htmlFor={`sessionSettings_${fieldName}`} hasError={!field.valid && field.touched}>
        {label}
      </Label>
      <Label>{description}</Label>

      <div className={locals.slider}>
        <DistinctSlider
          valueLabelDisplay="auto"
          valueLabelFormat={valueLabelFormat}
          marks={labeledTicks}
          min={min}
          max={max}
          step={step}
          value={form.get(fieldName).value}
          onChange={onChange}
        />
      </div>
    </FormGroup>
  ));
}

function deleteItem({ setMessage }) {
  setMessage({ message: 'Deleting timeouts', type: neutral, isSaving: true });
  const deleteConfigResult$ = deleteSessionSettings();
  deleteConfigResult$.once(
    () => setMessage({ text: 'Timeouts successfully deleted.', type: success }),
    error => setMessage({ text: `Failed to delete timeouts: ${error.message}`, type: errorType })
  );
}

function saveItem({ form, setMessage }) {
  const configToSave = {
    idleTimeInMillis: form.get('idleTimeInMillis').value,
    tokenLifeTimeInMillis:
      minTokenLifeTime +
      denormalizeValue(form.get('tokenLifeTimeInMillis').value) * (maxTokenLifeTime - minTokenLifeTime)
  };
  if (configToSave.tokenLifeTimeInMillis < configToSave.idleTimeInMillis) {
    return setMessage({ text: "Token life time can't be smaller than the idle timeout", type: errorType });
  }

  setMessage({ message: 'Saving timeouts', type: neutral, isSaving: true });

  const setConfigResult$ = setSessionSettings(configToSave);
  setConfigResult$.once(
    () => setMessage({ text: 'Timeouts successfully saved.', type: success }),
    error => setMessage({ text: `Failed to save timeouts: ${error.message}`, type: errorType })
  );
}

function enrichForm(form, { setCanDeleteItem, result: { config } }) {
  if (config) {
    setCanDeleteItem(true);
  }
  return form
    .put(
      'tokenLifeTimeInMillis',
      createField({
        value: config ? getNormalizedTokenValue(config.tokenLifeTimeInMillis) : 1
      })
    )
    .put('idleTimeInMillis', createField({ value: config ? config.idleTimeInMillis : hours.toMillis(8) }));
}

function getNormalizedTokenValue(timespan) {
  return Math.pow((timespan - minTokenLifeTime) / tokenLifeTimeDomain, 0.25);
}

function denormalizeValue(normalizedValue) {
  return Math.pow(normalizedValue, 4);
}
