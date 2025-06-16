/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Repeat } from '@carbon/icons-react';
import React, { useContext } from 'react';

import { Column, Grid, NumberInput, RadioButton, RadioButtonGroup } from '@instana/carbon';
import { FormGroup, Label, Spacer, Stack, Typography } from '@instana/components';

import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';
import { RepeatUntil } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/types';
import { isFieldValid, getValidationMessage } from 'in-service-levels/utils/form';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import DateInput from 'in-components/form/DateInput/DateInput';
import { t } from 'in-i18n';

import locals from './ConfigureCorrectionWindowDialog.mless';

export default function RecurrenceSection() {
  const { form } = useContext(CorrectionWindowFormContext);
  const repeatUntilField = form.getIn(['schedule', 'recurrence', 'repeatUntil']);

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="752" height="2" viewBox="0 0 752 2" fill="none">
        <path d="M0.5 1H751.5" stroke="black" />
      </svg>
      <Spacer vertical="small" />
      <Stack direction="horizontal">
        <Repeat />
        <Typography variant="heading-01">
          {t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.recurrenceOptions')}
        </Typography>
      </Stack>
      <Grid className={locals['schedule-step-grid']}>
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
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const endDateField = form.getIn(['schedule', 'recurrence', 'endDate']);

  const isEndDateFieldValid = isFieldValid(endDateField);

  return (
    <FormGroup>
      <Label htmlFor="correction-window-end-date" hasError={!isEndDateFieldValid}>
        {t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.endDate')}
      </Label>
      {/* TODO: error state not passed to date input in ui-foundation  */}
      <DateInput
        id="correction-window-end-date"
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
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const occurrencesField = form.getIn(['schedule', 'recurrence', 'occurrences']);

  const isOccurrencesFieldValid = isFieldValid(occurrencesField);

  return (
    <NumberInput
      id="correction-window-number-occurrences"
      label={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.occurrences')}
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
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const repeatUntilField = form.getIn(['schedule', 'recurrence', 'repeatUntil']);

  return (
    <RadioButtonGroup
      legendText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.repeatUntil')}
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
      <RadioButton
        labelText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.endDate')}
        value={'date' satisfies RepeatUntil}
      />
      <RadioButton
        labelText={t(
          'in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.numberOfOccurrences'
        )}
        value={'occurrences' satisfies RepeatUntil}
      />
      <RadioButton
        labelText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.forever')}
        value={'forever' satisfies RepeatUntil}
      />
    </RadioButtonGroup>
  );
}
