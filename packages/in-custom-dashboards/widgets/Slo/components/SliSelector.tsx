/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import React, { ReactNode } from 'react';

import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingFieldValidationMessage';
import useSliConfigurations from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfigurations';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { sliConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import { compareIgnoreCase } from 'in-services/util/string';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface SliSelectorProps {
  form: MapForm;
  updateForm: (updatedForm: MapForm) => void;
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

  const disabled = !entityId;

  if (!disabled && status === 'resolved' && !sliConfigurations!.length) {
    return (
      <Sections>
        <Section
          title={t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.srvLevelIndicator')}
          actions={openManageSLIComponent}
        >
          {t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.noneAvailCreateOne')}
        </Section>
      </Sections>
    );
  }

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
        hasError={!sliField.valid && sliField.touched}
        additionalContent={
          <OverridingFieldValidationMessage
            field={sliField}
            message={t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.selectASli')}
          />
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
