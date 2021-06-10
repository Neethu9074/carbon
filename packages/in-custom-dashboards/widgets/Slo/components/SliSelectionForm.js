/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import { trackSliChanged } from 'in-custom-dashboards/widgets/Slo/tracker';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { sliConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import { compareIgnoreCase } from 'in-services/util/string';
import Sections from 'in-components/workspace/Sections';
import { t } from 'in-i18n';

export default function SliSelectionForm({ form, onChange, applicationId, openManageSLIComponent }) {
  const { data: sliConfigurations, progress } = useObservable(getSliConfigurations, []) ?? {};
  const filteredSLIs = sliConfigurations?.filter(sli => sli?.sliEntity?.applicationId === applicationId) ?? [];
  const sliField = form.get(sliConfigId);

  useEffect(() => {
    if (isSliConfigDeleted(sliField, filteredSLIs, progress)) {
      onChange([], form => form.updateIn([sliConfigId], field => field.setValue(undefined).setTouched(true)));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliField, filteredSLIs, progress]);

  return (
    <Sections>
      <SelectInSection
        label={t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.srvLevelIndicator')}
        id="sli-selection"
        disabled={!applicationId}
        value={sliField.value}
        onChange={e => {
          onChange([], form => form.updateIn([sliConfigId], field => field.setValue(e.target.value).setTouched(true)));
          trackSliChanged({ sliConfigId: e.target.value });
        }}
        hasError={!sliField.valid && sliField.touched}
        additionalContent={
          <OverridingTextTouchedMessage
            field={sliField}
            message={t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.selectASli')}
          />
        }
        actions={openManageSLIComponent}
      >
        {filteredSLIs.length === 0 && (
          <option value="">{t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.noneAvailCreateOne')}</option>
        )}
        {filteredSLIs.length !== 0 && (
          <option value="">{t('in-custom-dashboards:widgets.slo.sliSelectionFormComp.pleaseSelect')}</option>
        )}
        {filteredSLIs
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

const isSliConfigDeleted = (sliField, filteredSLIs, progress) => {
  return sliField.value && progress?.loading === false && !filteredSLIs.some(({ id }) => sliField.value === id);
};
