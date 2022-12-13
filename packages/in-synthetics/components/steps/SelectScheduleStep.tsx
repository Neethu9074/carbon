/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm, Item } from 'formalistic';
import React from 'react';

// @ts-expect-error module needs to be translated to TS
import DebouncedRestrictedSlider from 'in-components/Slider/DebouncedRestrictedSlider';
import Section, { SubTitle } from 'in-synthetics/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

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
  const frequencyField = form.get('testFrequency') as Field<number>;

  return (
    <Section headingText={t('in-synthetics:dialog.createTest.scheduling.title')}>
      <FormGroup>
        <SubTitle>{t('in-synthetics:dialog.createTest.basicDetails.labelFrequency')}</SubTitle>
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
