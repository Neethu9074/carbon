import React from 'react';

import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import { trackSliChanged } from 'in-custom-dashboards/widgets/Slo/tracker';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { sliConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import Sections from 'in-new-components/workspace/Sections';
import { compareIgnoreCase } from 'in-services/util/string';
import useObservable from 'in-hooks/useObservable';

export default function SliSelectionForm({ form, onChange, applicationId, openManageSLIComponent }) {
  const { data: sliConfigurations } = useObservable(getSliConfigurations, []) ?? {};
  const filteredSLIs = sliConfigurations?.filter(sli => sli?.sliEntity?.applicationId === applicationId) ?? [];
  const field = form.get(sliConfigId);

  return (
    <Sections>
      <SelectInSection
        label="Service Level Indicator"
        id="sli-selection"
        disabled={!applicationId}
        value={field?.value}
        onChange={e => {
          onChange([], form => form.updateIn([sliConfigId], field => field.setValue(e.target.value).setTouched(true)));
          trackSliChanged({ sliConfigId: e.target.value });
        }}
        hasError={!field.valid && field.touched}
        additionalContent={<OverridingTextTouchedMessage field={field} message="Please select a SLI." />}
        actions={openManageSLIComponent}
      >
        {filteredSLIs.length === 0 && <option value="">None available, please create one.</option>}
        {filteredSLIs.length !== 0 && <option value="">Please select</option>}
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
