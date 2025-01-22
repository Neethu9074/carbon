/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';
import classNames from 'classnames';

import { Stack, Typography, RadioButton } from '@instana/components';

import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { t } from 'in-i18n';

import locals from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorTypeSelector.mless';

export default function SloIndicatorTypeSelectorFormSection() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const entityTypeField = form.getIn(['entity', 'type']);
  const typeField = form.getIn(['indicator', 'type']);
  const blueprintField = form.getIn(['indicator', 'blueprint']);

  const isIndicatorTimeBased = typeField.value === 'timeBased';
  const isIndicatorEventBased = typeField.value === 'eventBased';

  const isIndicatorCustomBased = blueprintField.value === 'custom';
  const isFormInEditMode = mode === 'EDIT';

  return (
    <Stack gap="xsmall">
      <Typography variant="body-bold" component="p" noMargin>
        {t('in-service-levels:general.type')}
      </Typography>
      <div
        className={classNames(locals.containerGrid, {
          [locals.oneColumnGrid]: isIndicatorCustomBased,
          [locals.twoColumnGrid]: !isIndicatorCustomBased
        })}
      >
        {!isIndicatorCustomBased && (
          <RadioButton
            checked={isIndicatorTimeBased}
            disabled={isFormInEditMode}
            explanation={t('in-service-levels:createSloDialog.indicatorSection.timeTypeExplanation', {
              context: entityTypeField.value
            })}
            label={t('in-service-levels:general.time')}
            onChange={() => onChange(['indicator', 'type'], () => typeField.setValue('timeBased').setTouched(true))}
            size="large"
            verticalLabel
            wrapperClassName={locals.checkboxWrapper}
          />
        )}
        <RadioButton
          checked={isIndicatorEventBased}
          disabled={isFormInEditMode}
          explanation={t('in-service-levels:createSloDialog.indicatorSection.eventTypeExplanation', {
            context: entityTypeField.value
          })}
          label={t('in-service-levels:createSloDialog.indicatorSection.eventCount')}
          onChange={() => onChange(['indicator', 'type'], () => typeField.setValue('eventBased').setTouched(true))}
          size="large"
          verticalLabel
          wrapperClassName={locals.checkboxWrapper}
        />
      </div>
    </Stack>
  );
}
