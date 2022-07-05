/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode, useEffect } from 'react';
import { Field, MapForm } from 'formalistic';

import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingFieldValidationMessage';
import useSliConfigurations from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfigurations';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { sliConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import { compareIgnoreCase } from 'in-services/util/string';
import { SliConfigurationWithLastUpdated } from 'in-types';
import Sections from 'in-components/workspace/Sections';
import { FetchStatus } from 'in-hooks/utils/types';
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

  useEffect(() => {
    if (isSliConfigDeselected(sliField, sliConfigurations, status)) {
      updateForm(
        form.updateIn([sliConfigId], field =>
          (field as Field<SliConfigIdFieldValue>).setValue(undefined).setTouched(true)
        )
      );
    }

    // ignoring form and updateForm in the watcher params here, because including them would cause unnecessary evaluations
    // of the effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliField, sliConfigurations, status]);

  return (
    <Sections>
      <SelectInSection
        label={t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.srvLevelIndicator')}
        id="sli-selection"
        disabled={!entityId}
        value={sliField.value}
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
        {(status !== 'resolved' || sliConfigurations!.length !== 0) && (
          <option>{t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.pleaseSelect')}</option>
        )}
        {status === 'resolved' && sliConfigurations!.length === 0 && (
          <option>{t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.noneAvailCreateOne')}</option>
        )}
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

const isSliConfigDeselected = (
  sliField: Field<SliConfigIdFieldValue>,
  sliConfigurations: SliConfigurationWithLastUpdated[] | undefined,
  status: FetchStatus
): boolean => {
  return !!sliField.value && status === 'resolved' && !sliConfigurations?.some(({ id }) => sliField.value === id);
};
