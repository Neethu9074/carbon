/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm, Item } from 'formalistic';
import React from 'react';

//@ts-expect-error will convert DebouncedDistinctSlider to typescript
import DebouncedDistinctSlider from 'in-components/Slider/DebouncedDistinctSlider';
import Section, { ActionTitle, Description, SubTitle } from 'in-synthetics/components/Section';
import { Shape } from 'in-components/Slider/proptypes';
import FormGroup from 'in-components/form/FormGroup';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-synthetics/components/steps/SelectScheduleStep.mless';

export interface Props {
  form: MapForm;
  updateForm: (form: MapForm) => void;
  simpleMode: boolean;
}

/**
 * This is used to render marks in the freequesncy scheduler
 * It allowes users to select any whole number between 1 and 120 inclusive.
 */
const marks: Shape[] = [1, 15, 30, 45, 60, 75, 90, 105, 120].map(min => ({
  value: min,
  label: getDisplayLabel(min),
  millis: minutes.toMillis(min)
}));

export default function SelectScheduleStep({ form, updateForm, simpleMode }: Props) {
  const frequencyField = form.get('testFrequency') as Field<number>;

  if (simpleMode) {
    return (
      <Section headingText={t('in-synthetics:dialog.createTest.scheduling.title')}>
        <FormGroup>
          <SubTitle>{t('in-synthetics:dialog.createTest.basicDetails.labelFrequency')}</SubTitle>
          {displaySlider(frequencyField, marks, form, updateForm)}
        </FormGroup>
      </Section>
    );
  } else {
    //Advanced Mode
    return (
      <Section>
        <FormGroup className={locals.outerBox}>
          <ActionTitle>{t('in-synthetics:dialog.createTest.advancedMode.simultaneous')}</ActionTitle>
          <Description>{t('in-synthetics:dialog.createTest.advancedMode.simultaneousDescription')}</Description>
        </FormGroup>
        <FormGroup className={locals.outerBox}>
          <ActionTitle>{t('in-synthetics:dialog.createTest.basicDetails.labelFrequency')}</ActionTitle>
          <Description>
            {t('in-synthetics:dialog.createTest.advancedMode.frequency', { frequencyValue: frequencyField.value })}
          </Description>
          {displaySlider(frequencyField, marks, form, updateForm)}
        </FormGroup>
      </Section>
    );
  }
}

function getDisplayLabel(value: number) {
  if (value == 1) {
    return '1';
  } else if (value % 30 == 0) {
    return `${value}`;
  } else {
    return '';
  }
}

function displaySlider(
  frequencyField: Field<Number>,
  marks: Shape[],
  form: MapForm,
  updateForm: (form: MapForm) => void
) {
  return (
    <DebouncedDistinctSlider
      marks={marks}
      max={marks[marks.length - 1].value}
      min={1}
      step={1}
      value={frequencyField.value}
      valueLabelDisplay="auto"
      onChange={(value: number) => {
        updateForm(
          form.updateIn(['testFrequency'], (field: Item) => (field as Field<number>).setValue(value).setTouched(true))
        );
      }}
    />
  );
}
