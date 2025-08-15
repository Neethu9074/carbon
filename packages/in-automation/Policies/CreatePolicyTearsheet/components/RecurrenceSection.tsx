/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Repeat } from '@carbon/icons-react';
import React from 'react';

import { Column, Grid, NumberInput, RadioButton, RadioButtonGroup } from '@instana/carbon';
import { FormGroup, Label, Spacer, Stack, Typography } from '@instana/components';

import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import { RepeatUntil } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/types';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { getValidationMessage, isFieldValid } from 'in-automation/utils/form';
import DateInput from 'in-components/form/DateInput/DateInput';
import { t } from 'in-i18n';

import locals from 'in-automation/Policies/CreatePolicyTearsheet/CreatePolicyTearsheet.mless';

export default function RecurrenceSection() {
  const { form } = usePolicyFormContext();
  const repeatUntilField = form.getIn(['schedule', 'recurrence', 'repeatUntil']);

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="752" height="2" viewBox="0 0 752 2" fill="none">
        <path d="M0.5 1H751.5" stroke="black" />
      </svg>
      <Spacer vertical="small" />
      <Stack direction="horizontal">
        <Repeat />
        <Typography variant="heading-01">{t('in-automation:policyCreateTearsheet.recurrenceOptions')}</Typography>
      </Stack>
      <Grid className={locals['policy-tearsheet-step-grid']}>
        <Column lg={16}>
          <RepeatUntilSection />
        </Column>
        {repeatUntilField.value === 'date' && (
          <Column lg={4}>
            <EndDateSection />
          </Column>
        )}
        {repeatUntilField.value === 'occurrences' && (
          <Column lg={5}>
            <OccurrencesSection />
          </Column>
        )}
      </Grid>
    </>
  );
}

function EndDateSection() {
  const { form, onChange } = usePolicyFormContext();
  const endDateField = form.getIn(['schedule', 'recurrence', 'endDate']);

  const isEndDateFieldValid = isFieldValid(endDateField);

  return (
    <FormGroup>
      <Label htmlFor="correction-window-end-date">{t('in-automation:policyCreateTearsheet.endDate')}</Label>
      <DateInput
        id="policy-scheduling-end-date"
        placeholder="YYYY-MM-DD"
        hasError={!isEndDateFieldValid}
        value={endDateField.value}
        onChange={e => {
          if (e) onChange(['schedule', 'recurrence', 'endDate'], () => endDateField.setValue(e).setTouched(true));
        }}
      />
      <TouchedMessages field={endDateField} />
    </FormGroup>
  );
}

function OccurrencesSection() {
  const { form, onChange } = usePolicyFormContext();
  const occurrencesField = form.getIn(['schedule', 'recurrence', 'occurrences']);

  const isOccurrencesFieldValid = isFieldValid(occurrencesField);

  return (
    <NumberInput
      id="policy-scheduling-number-occurrences"
      label={t('in-automation:policyCreateTearsheet.occurrences')}
      min={0}
      invalid={!isOccurrencesFieldValid}
      invalidText={getValidationMessage(occurrencesField)}
      value={occurrencesField.value}
      onChange={(_, { value }) =>
        onChange(['schedule', 'recurrence', 'occurrences'], () =>
          occurrencesField.setValue(Number(value)).setTouched(true)
        )
      }
    />
  );
}

function RepeatUntilSection() {
  const { form, onChange } = usePolicyFormContext();
  const repeatUntilField = form.getIn(['schedule', 'recurrence', 'repeatUntil']);

  return (
    <RadioButtonGroup
      legendText={t('in-automation:policyCreateTearsheet.repeatUntil')}
      name="radio-button-vertical-group"
      orientation="vertical"
      value={repeatUntilField.value}
      defaultSelected={repeatUntilField.value}
      onChange={value =>
        onChange(['schedule', 'recurrence', 'repeatUntil'], () =>
          repeatUntilField.setValue(value as RepeatUntil).setTouched(true)
        )
      }
    >
      <RadioButton labelText={t('in-automation:policyCreateTearsheet.endDate')} value={'date' as RepeatUntil} />
      <RadioButton
        labelText={t('in-automation:policyCreateTearsheet.numberOfOccurrences')}
        value={'occurrences' as RepeatUntil}
      />
      <RadioButton labelText={t('in-automation:policyCreateTearsheet.forever')} value={'forever' as RepeatUntil} />
    </RadioButtonGroup>
  );
}
