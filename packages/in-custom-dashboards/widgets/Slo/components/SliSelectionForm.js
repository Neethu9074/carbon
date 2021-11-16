/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingFieldValidationMessage';
import useSliConfigurations from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfigurations';
import { trackSliChanged } from 'in-custom-dashboards/widgets/Slo/tracker';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { sliConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import { compareIgnoreCase } from 'in-services/util/string';
import Sections from 'in-components/workspace/Sections';
import { t } from 'in-i18n';

export default function SliSelectionForm({ form, updateForm, entityType, entityId, openManageSLIComponent }) {
  const { sliConfigurations, status } = useSliConfigurations(entityType, entityId);
  const sliField = form.get(sliConfigId);

  useEffect(() => {
    if (isSliConfigDeselected(sliField, sliConfigurations, status)) {
      updateForm(form.updateIn([sliConfigId], field => field.setValue(undefined).setTouched(true)));
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
          updateForm(form.updateIn([sliConfigId], field => field.setValue(e.target.value).setTouched(true)));
          trackSliChanged({ sliConfigId: e.target.value });
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
        {(status !== 'resolved' || sliConfigurations.length !== 0) && (
          <option>{t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.pleaseSelect')}</option>
        )}
        {status === 'resolved' && sliConfigurations.length === 0 && (
          <option>{t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.noneAvailCreateOne')}</option>
        )}
        {status === 'resolved' &&
          [...sliConfigurations]
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

const isSliConfigDeselected = (sliField, sliConfigurations, status) => {
  return sliField.value && status === 'resolved' && !sliConfigurations.some(({ id }) => sliField.value === id);
};
