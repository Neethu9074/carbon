/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field } from 'formalistic';
import React from 'react';

import { Button } from '@instana/components';

import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingFieldValidationMessage';
import useApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { compareIgnoreCase } from 'in-services/util/string';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface ConfigurationSelectorProps {
  field?: Field<string>;
  entityId: string;
  entityType: ApdexEntityTypes;
  onChange: (value: string) => void;
  onOpenConfigurationManager: () => void;
}

export default function ConfigurationSelector({
  field,
  entityId,
  entityType,
  onChange,
  onOpenConfigurationManager
}: ConfigurationSelectorProps) {
  const [apdexConfigurations, status] = useApdexConfigurations(entityType, entityId);

  const isFieldValid = field?.valid;
  const isFieldTouched = field?.touched;
  const hasError = !isFieldValid && isFieldTouched;
  const isResolved = status === 'resolved';
  const hasSomeConfig = apdexConfigurations?.length !== 0;
  const configId = field?.value;
  const disabled = !entityId;

  const actions = (
    <Button disabled={!entityId} kind="primary" onClick={onOpenConfigurationManager}>
      {t('in-custom-dashboards:widgets.apdex.configurationSelector.manageConfig')}
    </Button>
  );

  if (!disabled && isResolved && !hasSomeConfig) {
    return (
      <Section title={t('in-custom-dashboards:widgets.apdex.configurationSelector.label')} actions={actions}>
        {t('in-custom-dashboards:widgets.apdex.configurationSelector.noneAvailCreateOne')}
      </Section>
    );
  }

  return (
    <SelectInSection
      label={t('in-custom-dashboards:widgets.apdex.configurationSelector.label')}
      disabled={disabled}
      value={configId ?? ''}
      onChange={e => onChange(e.target.value)}
      hasError={hasError}
      additionalContent={
        <OverridingFieldValidationMessage
          field={field}
          message={t('in-custom-dashboards:widgets.apdex.configurationSelector.selectConfig')}
        />
      }
      actions={actions}
    >
      <option value="" disabled hidden>
        {t('in-custom-dashboards:widgets.apdex.configurationSelector.pleaseSelect')}
      </option>

      {isResolved &&
        [...apdexConfigurations!]
          .sort((a, b) => compareIgnoreCase(a.apdexName, b.apdexName))
          .map(({ id, apdexName }) => (
            <option key={id} value={id}>
              {apdexName}
            </option>
          ))}
    </SelectInSection>
  );
}
