/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import React from 'react';

import {
  refresh,
  deleteSessionSettings,
  setSessionSettings
} from 'in-settings/tabs/SecurityAndAccess/api/sessionSettings';
import { getSessionSettingsAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/sessionSettings';
import ApiItemView from 'in-settings/components/ApiItemView';
import DebouncedDistinctSlider from 'in-components/Slider/DebouncedDistinctSlider';
import { SETTINGS_SESSION_TIMEOUT_UPDATE } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { formatDurationAccurately } from 'in-services/formatters/date';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import { days, minutes, hours } from 'in-services/time';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './SessionSettings.mless';

const minTokenLifeTime = minutes.toMillis(10);
const maxTokenLifeTime = days.toMillis(7);
const tokenLifeTimeDomain = maxTokenLifeTime - minTokenLifeTime;
const idleTimeInMillisDefault = hours.toMillis(8);
const tokenLifeTimeInMillisDefault = 1;

export default function SessionSettings() {
  const { unstable_trackEvent } = useSegmentTracking();
  return (
    <ApiItemView
      getObservables={() => ({
        config: getSessionSettingsAsResultObservable()
      })}
      onCancelClick={refresh}
      enrichForm={enrichForm}
      deleteItem={data => deleteItem({ ...data, unstable_trackEvent })}
      deleteLabel={t('in-settings:tabs.reset')}
      saveItem={data => saveItem({ ...data, unstable_trackEvent })}
      render={render}
    />
  );
}

function render({ form, setForm }) {
  return (
    <>
      <Title title={t('in-settings:tabs.configureSessionSettings')} />
      <SubViewHeader>{t('in-settings:tabs.sessionSettings')}</SubViewHeader>

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
      description={t('in-settings:tabs.setsTheTimeAfterWhichTheUserNeedsToLoginAgain')}
      label={t('in-settings:tabs.tokenLifeTime')}
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
  const min = minutes.toMillis(10);
  const max = hours.toMillis(8);
  const formatTime = formatDurationAccurately;
  const labeledTicks = [min, hours.toMillis(1), max].map(value => ({
    value,
    label: formatTime(value)
  }));

  return (
    <FormInput
      form={form}
      description={t(
        'in-settings:tabs.ifTheInstanaUiBrowserTabHasBeenHiddenForTheSpecifiedAmountOfTimeTheTokenWillBeInvalidated'
      )}
      label={t('in-settings:tabs.idleTime')}
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
        <DebouncedDistinctSlider
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

function deleteItem({ setMessage, unstable_trackEvent }) {
  setMessage({ message: t('in-settings:tabs.deletingTimeouts'), type: 'neutral', isSaving: true });
  const deleteConfigResult$ = deleteSessionSettings();
  deleteConfigResult$.once(
    () => {
      setMessage({
        text: t('in-settings:tabs.timeoutsSuccessfullyDeleted'),
        type: 'success'
      });
      unstable_trackEvent(
        UPDATED_OBJECT,
        { objectType: SETTINGS_SESSION_TIMEOUT_UPDATE },
        { idleTimeInMillis: idleTimeInMillisDefault, tokenLifeTimeInMillis: tokenLifeTimeInMillisDefault }
      );
    },
    error =>
      setMessage({
        text: t('in-settings:tabs.failedToDeleteTimeouts', { err: error.message }),
        type: 'error'
      })
  );
}

function saveItem({ form, setMessage, unstable_trackEvent }) {
  const configToSave = {
    idleTimeInMillis: form.get('idleTimeInMillis').value,
    tokenLifeTimeInMillis:
      minTokenLifeTime +
      denormalizeValue(form.get('tokenLifeTimeInMillis').value) * (maxTokenLifeTime - minTokenLifeTime)
  };
  if (configToSave.tokenLifeTimeInMillis < configToSave.idleTimeInMillis) {
    return setMessage({
      text: t('in-settings:tabs.tokenLifeTimeCan', "Token life time can't be smaller than the idle timeout"),
      type: 'error'
    });
  }

  setMessage({ message: t('in-settings:tabs.savingTimeouts'), type: 'neutral', isSaving: true });

  const setConfigResult$ = setSessionSettings(configToSave);
  setConfigResult$.once(
    () => {
      setMessage({
        text: t('in-settings:tabs.timeoutsSuccessfullySaved'),
        type: 'success'
      });
      unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_SESSION_TIMEOUT_UPDATE }, configToSave);
    },
    error => setMessage({ text: t('in-settings:tabs.failedToSaveTimeouts', { err: error.message }), type: 'error' })
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
        value: config ? getNormalizedTokenValue(config.tokenLifeTimeInMillis) : tokenLifeTimeInMillisDefault
      })
    )
    .put('idleTimeInMillis', createField({ value: config ? config.idleTimeInMillis : idleTimeInMillisDefault }));
}

function getNormalizedTokenValue(timespan) {
  return Math.pow((timespan - minTokenLifeTime) / tokenLifeTimeDomain, 0.25);
}

function denormalizeValue(normalizedValue) {
  return Math.pow(normalizedValue, 4);
}
