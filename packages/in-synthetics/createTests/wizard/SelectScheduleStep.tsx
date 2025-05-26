/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm, Item } from 'formalistic';
import React from 'react';

import { Label } from '@instana/components';

//@ts-expect-error will convert DebouncedDistinctSlider to typescript
import DebouncedDistinctSlider from 'in-components/Slider/DebouncedDistinctSlider';
import {
  convertHoursToMinutes,
  convertMinutesToHours,
  testFrequencyDescription
} from 'in-synthetics/utils/testFrequencyUtil';
import Section, { ActionTitle, SubTitle } from 'in-synthetics/createTests/wizard/Section';
import { Shape } from 'in-components/Slider/proptypes';
import FormGroup from 'in-components/form/FormGroup';
import { hours, minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/wizard/SelectScheduleStep.mless';

export interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  simpleMode: boolean;
}

/**
 * This is used to render marks in the frequency scheduler
 * It allowes users to select any whole number between 1 and 120 minutes inclusive
 * for a non-SSLCertificate type.
 */
const marksToRender: Shape[] = [1, 15, 30, 45, 60, 75, 90, 105, 120].map(min => ({
  value: min,
  label: getDisplayLabel(min),
  millis: minutes.toMillis(min)
}));

/**
 * This is used to render marks in the frequency scheduler
 * It allowes users to select any whole number between 1 and 24 hours inclusive
 * for an SSLCertificate type.
 */
const marksToRenderHourly: Shape[] = [1, 4, 8, 12, 16, 20, 24].map(min => ({
  value: min,
  label: `${min}`,
  millis: hours.toMillis(min)
}));

interface SliderProps {
  syntheticType: Field<string>;
  frequencyField: Field<number>;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

const slider = ({ syntheticType, frequencyField, form, updateForm }: SliderProps) => {
  return syntheticType.value != 'SSLCertificate'
    ? displaySlider(frequencyField, marksToRender, form, updateForm, '')
    : displaySlider(frequencyField, marksToRenderHourly, form, updateForm, syntheticType.value);
};

const testFrequencyTitle = (syntheticType: string) => {
  return syntheticType != 'SSLCertificate'
    ? t('in-synthetics:dialog.createTest.basicDetails.labelFrequency')
    : t('in-synthetics:dialog.createTest.basicDetails.labelFrequencyHour');
};

export default function SelectScheduleStep({ form, updateForm, simpleMode }: Props) {
  const configForm = form.get('configuration') as MapForm<any>;
  const syntheticType = configForm.get('syntheticType') as Field<string>;
  const frequencyField = form.get('testFrequency') as Field<number>;

  if (simpleMode) {
    return (
      <Section headingText={t('in-synthetics:dialog.createTest.scheduling.title')}>
        <FormGroup>
          <SubTitle>{t('in-synthetics:dialog.createTest.basicDetails.labelFrequency')}</SubTitle>
          {displaySlider(frequencyField, marksToRender, form, updateForm, '')}
        </FormGroup>
      </Section>
    );
  } else {
    //Advanced Mode
    return (
      <div className={locals.outerBox}>
        <Label>{testFrequencyTitle(syntheticType.value)}</Label>
        {slider({ syntheticType, frequencyField, form, updateForm })}
        <ActionTitle>{testFrequencyDescription(syntheticType.value, frequencyField.value)}</ActionTitle>
      </div>
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
  frequencyField: Field<number>,
  marks: Shape[],
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void,
  syntheticType: string
) {
  return (
    <DebouncedDistinctSlider
      marks={marks}
      max={marks[marks.length - 1].value}
      min={1}
      step={1}
      value={
        syntheticType == 'SSLCertificate'
          ? convertMinutesToHours(frequencyField.value).toFixed(2)
          : frequencyField.value
      }
      valueLabelDisplay="auto"
      onChange={(value: number) => {
        updateForm(
          form.updateIn(['testFrequency'], (field: Item) =>
            (field as Field<number>).setValue(convertHoursToMinutes(syntheticType, value)).setTouched(true)
          )
        );
      }}
    />
  );
}
