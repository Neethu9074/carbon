/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography, ValidationBlock } from '@instana/components';

import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { SLO_TARGET_DECIMAL_PRECISION, titleWidth } from 'in-service-levels/constants';
import PercentageInput from 'in-service-levels/components/PercentageInput';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

import locals from './SloObjectiveSection.mless';

export default function TargetSection() {
  const { form, onChange } = useContext(SloFormContext);
  const sloTargetField = form.getIn(['objective', 'target']);
  const isTargetFieldValid = isFieldValid(sloTargetField);

  return (
    <Section title={t('in-service-levels:createSloDialog.sloTarget')} titleWidth={titleWidth}>
      <PercentageInput
        className={locals.percentageInput}
        id={'target'}
        value={sloTargetField.value}
        onChange={target => {
          onChange(['objective', 'target'], () => sloTargetField.setValue(target).setTouched(true));
        }}
        hasError={!sloTargetField.valid && sloTargetField.touched}
        decimalPrecision={SLO_TARGET_DECIMAL_PRECISION}
      />
      <Typography variant="body-regular"> %</Typography>
      {!isTargetFieldValid &&
        sloTargetField.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
    </Section>
  );
}
