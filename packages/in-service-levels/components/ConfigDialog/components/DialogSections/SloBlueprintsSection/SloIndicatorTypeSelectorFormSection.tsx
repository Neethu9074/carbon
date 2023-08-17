/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';
import classNames from 'classnames';

import { Stack, Typography } from '@instana/components';

import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { t } from 'in-i18n';

import locals from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorTypeSelector.mless';

export default function SloIndicatorTypeSelectorFormSection() {
  const { form, onChange } = useContext(SloFormContext);

  const typeField = form.getIn(['indicator', 'type']);
  const blueprintField = form.getIn(['indicator', 'blueprint']);

  const isIndicatorTimeBased = typeField.value === 'timeBased';
  const isIndicatorEventBased = typeField.value === 'eventBased';
  const isIndicatorCustomEventBased = typeField.value === 'customEventBased';

  const isIndicatorCustomBased = blueprintField.value === 'custom';

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
          <CheckboxFancy
            asRadioButton
            checked={isIndicatorTimeBased}
            explanation={t('in-service-levels:createSloDialog.indicatorSection.timeTypeExplanation')}
            label={t('in-service-levels:general.time')}
            onChange={() => onChange(['indicator', 'type'], () => typeField.setValue('timeBased').setTouched(true))}
            size="large"
            verticalLabel
          />
        )}
        {!isIndicatorCustomBased && (
          <CheckboxFancy
            asRadioButton
            checked={isIndicatorEventBased}
            explanation={t('in-service-levels:createSloDialog.indicatorSection.eventTypeExplanation')}
            label={t('in-service-levels:createSloDialog.indicatorSection.eventCount')}
            onChange={() => onChange(['indicator', 'type'], () => typeField.setValue('eventBased').setTouched(true))}
            size="large"
            verticalLabel
          />
        )}
        {isIndicatorCustomBased && (
          <CheckboxFancy
            asRadioButton
            checked={isIndicatorCustomEventBased}
            explanation={t('in-service-levels:createSloDialog.indicatorSection.eventTypeExplanation')}
            label={t('in-service-levels:createSloDialog.indicatorSection.eventCount')}
            onChange={() =>
              onChange(['indicator', 'type'], () => typeField.setValue('customEventBased').setTouched(true))
            }
            size="large"
            verticalLabel
          />
        )}
      </div>
    </Stack>
  );
}
