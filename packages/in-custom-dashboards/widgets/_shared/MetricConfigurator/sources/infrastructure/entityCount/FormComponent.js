/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-new-components/workspace/HelpAction';
import Sections from 'in-new-components/workspace/Sections';
import { aggregationLabels } from 'in-stores/metric/metric';
import Stack from 'in-new-components/layout/Stack';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration
}) {
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const dynamicFocusQueryField = form.get('dynamicFocusQuery');

  return (
    <Stack space="xsmall">
      {dataSourceSection}

      <Sections>
        <InputInSection
          label="Query"
          id="metic-configurator-infra-dynamic-focus-query"
          type="text"
          value={dynamicFocusQueryField.value}
          onChange={e => onChange(['dynamicFocusQuery'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!dynamicFocusQueryField.valid && dynamicFocusQueryField.touched}
          actions={
            <HelpAction>A Dynamic Focus Query (DFQ) as you would use it within the infrastructure map.</HelpAction>
          }
          additionalContent={<TouchedMessages field={dynamicFocusQueryField} />}
        />
      </Sections>

      <Sections>
        <SelectInSection
          label="Metric"
          id="metic-configurator-infra-metric"
          value={metricField.value}
          disabled
          additionalContent={<TouchedMessages field={metricField} />}
        >
          <option value="count">Count</option>
        </SelectInSection>
      </Sections>

      <Sections>
        <SelectInSection
          label="Aggregation"
          id="metic-configurator-infra-aggregation"
          value={aggregationField.value}
          disabled
          additionalContent={<TouchedMessages field={aggregationField} />}
        >
          {!metricField.valid && <option value="">Please select a metric</option>}
          {metricField.valid && (
            <>
              <option value="">Please select</option>
              {Object.keys(aggregationLabels).map(aggregation => (
                <option key={aggregation} value={aggregation}>
                  {aggregationLabels[aggregation]}
                </option>
              ))}
            </>
          )}
        </SelectInSection>
      </Sections>

      {formatterSection}

      {timeShiftConfiguration}

      {labelSection}
    </Stack>
  );
}
