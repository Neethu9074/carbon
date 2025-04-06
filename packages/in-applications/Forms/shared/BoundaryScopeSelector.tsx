/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field } from 'formalistic';
import React from 'react';

import {
  CarbonRadioButton as RadioButton,
  CarbonRadioButtonGroup as RadioButtonGroup,
  CarbonStack as Stack,
  SvgIcon,
  Typography
} from '@instana/components';
import { ApplicationBoundaryScope } from '@instana/types';

import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { boundaryScopes } from 'in-applications/constants';
import { t } from 'in-i18n';

import locals from './BoundaryScopeSelector.mless';

interface BoundaryScopeSelectorProps {
  formField: Field<ApplicationBoundaryScope>;
  onChange: (value: ApplicationBoundaryScope) => void;
}

export const BoundaryScopeSelector = ({ formField, onChange }: BoundaryScopeSelectorProps): JSX.Element => {
  const boundaryScope = formField.value ?? 'ALL';
  const { all, inbound, info } = boundaryScopes;
  const { trackApplicationCreationScopeSelected } = useApplicationTracker();

  const handleSelectOption = (boundaryScope: ApplicationBoundaryScope) => {
    trackApplicationCreationScopeSelected({ boundaryScope });
    onChange(boundaryScope);
  };

  return (
    <RadioButtonGroup
      name="boundary-scope-radio-button-group"
      legendText={t('in-applications:inboundOutboundCalls.config.selectBoundaryScope')}
      orientation="vertical"
      defaultSelected={boundaryScope}
      valueSelected={boundaryScope}
      onChange={value => handleSelectOption(value as ApplicationBoundaryScope)}
    >
      <RadioButton labelText={<RadioButtonLabel boundaryScope={info.INBOUND} />} value={inbound} />
      <RadioButton labelText={<RadioButtonLabel boundaryScope={info.ALL} />} value={all} />
    </RadioButtonGroup>
  );
};

// FIXME: refactor boundaryScopes to be typed.
type BoundaryScopeInfo = typeof boundaryScopes.info.INBOUND | typeof boundaryScopes.info.ALL;

const RadioButtonLabel = ({ boundaryScope }: { boundaryScope: BoundaryScopeInfo }) => {
  const { icon, text, dashboard } = boundaryScope;
  return (
    <Stack gap={2}>
      <Stack orientation="horizontal" gap={4} className={locals.boundaryScopeLabel}>
        <SvgIcon type={icon} />
        <span>{text}</span>
      </Stack>
      <Typography variant="label-01">{dashboard}</Typography>
    </Stack>
  );
};
