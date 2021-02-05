/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SectionLabelWithSubtext from 'in-new-components/workspace/SectionLabelWithSubtext';
import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import { getMetricLabel } from 'in-custom-dashboards/widgets/Chart/util';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import Sections from 'in-new-components/workspace/Sections';
import { emptyArray } from 'in-services/fixedObjects';

export default function MetricConfigurator({
  form,
  onChange,
  onChangeSource,
  withLabelConfiguration,
  formatterSection,
  timeShiftConfiguration,
  disabledDataSources = emptyArray,
  axisForm,
  axisName,
  withGrouping = true
}) {
  const sourceField = form.get('source');

  const dataSourceSection = (
    <SelectInSection
      id="metic-configurator-source"
      label="Data Source"
      value={sourceField.value}
      onChange={e => onChangeSource(e.target.value)}
      hasError={!sourceField.valid && sourceField.touched}
      additionalContent={<TouchedMessages field={sourceField} />}
    >
      <option value="">Please select</option>
      {Object.values(sources)
        .filter(
          ({ source, visible }) =>
            (visible && disabledDataSources.indexOf(source) === -1) || sourceField.value === source
        )
        .sort((a, b) => compareIgnoreCase(a.label, b.label))
        .map(({ source, label, disabled }) => (
          <option key={source} value={source} disabled={disabled}>
            {label}
          </option>
        ))}
    </SelectInSection>
  );

  let labelSection;
  if (withLabelConfiguration) {
    labelSection = form.get('label').map(field => (
      <Sections>
        <InputInSection
          label={<SectionLabelWithSubtext subtext="Optional">Name</SectionLabelWithSubtext>}
          id="metic-configurator-label"
          type="text"
          value={field.value}
          placeholder={getMetricLabel(form.toJS())}
          onChange={e => onChange(['label'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!field.valid && field.touched}
          additionalContent={<TouchedMessages field={field} />}
        />
      </Sections>
    ));
  }

  if (sourceField.value) {
    const FormComponent = sources[sourceField.value].Form;
    return (
      <FormComponent
        form={form}
        onChange={onChange}
        dataSourceSection={dataSourceSection}
        labelSection={labelSection}
        formatterSection={formatterSection}
        timeShiftConfiguration={timeShiftConfiguration}
        axisForm={axisForm}
        axisName={axisName}
        withGrouping={withGrouping}
      />
    );
  }

  return <Sections>{dataSourceSection}</Sections>;
}
