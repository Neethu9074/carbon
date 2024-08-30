/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect } from 'react';
import { Field } from 'formalistic';

import { Button } from '@instana/components';

import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/SloLegacy/components/OverridingFieldValidationMessage';
import useApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexConfigurations';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { compareIgnoreCase } from 'in-services/util/string';
import HelpText from 'in-components/form/HelpText';
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
  const hasError = Boolean(!isFieldValid && isFieldTouched);
  const isResolved = status === 'resolved';
  const hasSomeConfig = apdexConfigurations?.length !== 0;
  const configId = field?.value;
  const disabled = !entityId || !hasSomeConfig;

  // clear the field when the selected configuration is deleted
  useEffect(() => {
    if (isResolved && configId && !apdexConfigurations?.some(config => config.id === configId)) {
      onChange('');
    }
  }, [apdexConfigurations, configId, isResolved, onChange]);

  return (
    <SelectInSection
      label={t('in-custom-dashboards:widgets.apdex.configurationSelector.label')}
      disabled={disabled}
      value={configId ?? ''}
      onChange={e => onChange(e.target.value)}
      hasError={hasError}
      additionalContent={<AdditionalSectionContent hasSomeConfig={hasSomeConfig} hasError={hasError} field={field} />}
      actions={
        <Button disabled={!entityId} kind="primary" onClick={onOpenConfigurationManager}>
          {t('in-custom-dashboards:widgets.apdex.configurationSelector.manageConfig')}
        </Button>
      }
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

interface AdditionalSectionContentProps {
  hasSomeConfig: boolean;
  hasError: boolean;
  field?: Field<string>;
}

function AdditionalSectionContent({ hasSomeConfig, hasError, field }: AdditionalSectionContentProps) {
  if (hasSomeConfig) {
    return (
      <OverridingFieldValidationMessage
        field={field}
        message={t('in-custom-dashboards:widgets.apdex.configurationSelector.selectConfig')}
      />
    );
  }

  if (hasError) {
    return (
      <OverridingFieldValidationMessage
        field={field}
        message={t('in-custom-dashboards:widgets.apdex.configurationSelector.noneAvailCreateOne')}
      />
    );
  }

  return <HelpText>{t('in-custom-dashboards:widgets.apdex.configurationSelector.noneAvailCreateOne')}</HelpText>;
}
