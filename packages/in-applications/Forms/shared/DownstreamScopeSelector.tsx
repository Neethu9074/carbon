/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field } from 'formalistic';
import React from 'react';

import { CarbonRadioButton as RadioButton, CarbonRadioButtonGroup as RadioButtonGroup } from '@instana/components';
import { ApplicationConfigScope } from '@instana/types';

import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { t } from 'in-i18n';

interface DownstreamScopeSelectorProps {
  formField: Field<ApplicationConfigScope>;
  onChange: (value: ApplicationConfigScope) => void;
  maxScope: ApplicationConfigScope;
}

export const DownstreamScopeSelector = ({
  formField,
  onChange,
  maxScope = 'INCLUDE_ALL_DOWNSTREAM'
}: DownstreamScopeSelectorProps): JSX.Element => {
  const downstreamScope = formField.value ?? maxScope;
  const { trackApplicationCreationScopeSelected } = useApplicationTracker();

  const handleSelectOption = (scope: ApplicationConfigScope) => {
    trackApplicationCreationScopeSelected({ scope });
    onChange(scope);
  };

  return (
    <RadioButtonGroup
      name="downstream-scope-radio-button-group"
      legendText={t('in-applications:creation.scope.selectDownstreamServices')}
      orientation="vertical"
      defaultSelected={downstreamScope}
      valueSelected={downstreamScope}
      onChange={value => handleSelectOption(value as ApplicationConfigScope)}
    >
      <RadioButton
        labelText={t('in-applications:creation.scope.optionNoDownStreamServices')}
        value="INCLUDE_NO_DOWNSTREAM"
      />
      {maxScope !== 'INCLUDE_NO_DOWNSTREAM' && (
        <RadioButton
          labelText={t('in-applications:creation.scope.optionImmediateDownstreamServices')}
          value="INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING"
        />
      )}
      {maxScope === 'INCLUDE_ALL_DOWNSTREAM' && (
        <RadioButton
          labelText={t('in-applications:creation.scope.optionAllDownstreamServices')}
          value="INCLUDE_ALL_DOWNSTREAM"
        />
      )}
    </RadioButtonGroup>
  );
};
