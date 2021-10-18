/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm, Item } from 'formalistic';
import React from 'react';

// @ts-expect-error module needs to be translated to TS
import DebouncedRestrictedSlider from 'in-components/Slider/DebouncedRestrictedSlider';
// @ts-expect-error module needs to be translated to TS
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
// @ts-expect-error module needs to be translated to TS
import FormGroup from 'in-components/form/FormGroup';
import { playbackModes } from 'in-synthetics/form/createSyntheticTestForm';
import Section, { SubTitle } from 'in-synthetics/components/Section';
import Label from 'in-components/form/Label';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './SelectScheduleStep.mless';

export interface Props {
  form: MapForm;
  updateForm: (form: MapForm) => void;
}

/**
 * This is used to render marks in the freequesncy scheduler
 * It allowes a maximum selection of 120 mins, but only the specified values are possible to select
 */
const marks = Object.freeze(
  [1, 5, 10, 15, 20, 30, 60, 120].map(min => ({
    value: min,
    label: `${min} min`,
    millis: minutes.toMillis(min)
  }))
);

export default function SelectScheduleStep({ form, updateForm }: Props) {
  const playbackModeField = form.get('playbackMode') as Field<string>;
  const frequencyField = form.get('testFrequency') as Field<number>;

  return (
    <Section headingText={t('in-synthetics:dialog.createTest.scheduling.title')}>
      <div>
        <SubTitle>{t('in-synthetics:dialog.createTest.scheduling.playbackMode')}</SubTitle>
        {playbackModeField.map(field => (
          <FormGroup>
            <Label htmlFor="response" hasError={!field.valid && field.touched}>
              {t('in-synthetics:dialog.createTest.scheduling.labelPlaybackMode')}
            </Label>
            <div className={locals.radioGroup}>
              <CheckboxFancy
                label={playbackModes[0].label}
                checked={field.value === playbackModes[0].value}
                onChange={() => {
                  updateForm(
                    form.updateIn(['playbackMode'], (field: Item) =>
                      (field as Field<string>).setValue(playbackModes[0].value).setTouched(true)
                    )
                  );
                }}
                asRadioButton
              />
              <p>{t('in-synthetics:dialog.createTest.scheduling.simultaneousDescription')}</p>
            </div>
            <div className={locals.radioGroup}>
              <CheckboxFancy
                label={playbackModes[1].label}
                checked={field.value === playbackModes[1].value}
                onChange={() => {
                  updateForm(
                    form.updateIn(['playbackMode'], (field: Item) =>
                      (field as Field<string>).setValue(playbackModes[1].value).setTouched(true)
                    )
                  );
                }}
                asRadioButton
              />
              <p>{t('in-synthetics:dialog.createTest.scheduling.staggeredDescription')}</p>
            </div>
          </FormGroup>
        ))}
      </div>

      <FormGroup>
        <SubTitle>{t('in-synthetics:dialog.createTest.basicDetails.labelFreequency')}</SubTitle>
        <DebouncedRestrictedSlider
          marks={marks}
          max={marks[marks.length - 1].value}
          min={0}
          value={frequencyField.value}
          onChange={(value: number) => {
            updateForm(
              form.updateIn(['testFrequency'], (field: Item) =>
                (field as Field<number>).setValue(value).setTouched(true)
              )
            );
          }}
        />
      </FormGroup>
    </Section>
  );
}
