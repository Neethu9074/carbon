/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode, useEffect } from 'react';
import { Field, MapForm } from 'formalistic';

import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/SloLegacy/components/OverridingFieldValidationMessage';
import useSliConfigurations from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfigurations';
import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { sliConfigId } from 'in-custom-dashboards/widgets/SloLegacy/form';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { compareIgnoreCase } from 'in-services/util/string';
import Sections from 'in-components/workspace/Sections';
import HelpText from 'in-components/form/HelpText';
import { t } from 'in-i18n';

interface SliSelectorProps {
  form: MapForm<any>;
  updateForm: (updatedForm: MapForm<any>) => void;
  entityType: MonitoringSource;
  entityId: string;
  openManageSLIComponent: ReactNode;
}

type SliConfigIdFieldValue = string | undefined;

export default function SliSelector({
  form,
  updateForm,
  entityType,
  entityId,
  openManageSLIComponent
}: SliSelectorProps) {
  const [sliConfigurations, status] = useSliConfigurations(entityType, entityId);

  const sliField = form.get(sliConfigId) as Field<SliConfigIdFieldValue>;

  const hasSomeConfig = sliConfigurations?.length !== 0;
  const isResolved = status === 'resolved';
  const disabled = !entityId || !hasSomeConfig;
  const hasError = !sliField.valid && sliField.touched;
  const selectedSliId = sliField?.value;

  // clear the field when the selected configuration is deleted
  useEffect(() => {
    if (isResolved && selectedSliId && !sliConfigurations?.some(config => config.id === selectedSliId)) {
      updateForm(
        form.updateIn([sliConfigId], field => (field as Field<SliConfigIdFieldValue>).setValue('').setTouched(true))
      );
    }
  }, [sliConfigurations, isResolved, selectedSliId, form, updateForm]);

  return (
    <Sections>
      <SelectInSection
        label={t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.srvLevelIndicator')}
        id="sli-selection"
        disabled={disabled}
        value={sliField.value ?? ''}
        onChange={e => {
          updateForm(
            form.updateIn([sliConfigId], field =>
              (field as Field<SliConfigIdFieldValue>).setValue(e.target.value).setTouched(true)
            )
          );
        }}
        hasError={hasError}
        additionalContent={
          <AdditionalSectionContent hasSomeConfig={hasSomeConfig} hasError={hasError} field={sliField} />
        }
        actions={openManageSLIComponent}
      >
        <option value="" disabled hidden>
          {t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.pleaseSelect')}
        </option>

        {status === 'resolved' &&
          [...sliConfigurations!]
            .sort((a, b) => compareIgnoreCase(a.sliName, b.sliName))
            .map(({ id, sliName }) => (
              <option key={id} value={id}>
                {sliName}
              </option>
            ))}
      </SelectInSection>
    </Sections>
  );
}

interface AdditionalSectionContentProps {
  hasSomeConfig: boolean;
  hasError: boolean;
  field?: Field<SliConfigIdFieldValue>;
}

function AdditionalSectionContent({ hasSomeConfig, hasError, field }: AdditionalSectionContentProps) {
  if (hasSomeConfig) {
    return (
      <OverridingFieldValidationMessage
        field={field}
        message={t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.selectASli')}
      />
    );
  }

  if (hasError) {
    return (
      <OverridingFieldValidationMessage
        field={field}
        message={t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.noneAvailCreateOne')}
      />
    );
  }

  return <HelpText>{t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.noneAvailCreateOne')}</HelpText>;
}
