import React from 'react';

import * as serviceLevelIndicators from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/serviceLevelIndicators';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-new-components/workspace/HelpAction';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import Sections from 'in-new-components/workspace/Sections';
import { compareIgnoreCase } from 'in-services/util/string';
import { percentage } from 'in-services/formatters/number';
import Stack from 'in-new-components/layout/Stack';
import useObservable from 'in-hooks/useObservable';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration
}) {
  const { data: sliConfigurations } = useObservable(() => getSliConfigurations(), []) ?? {};
  return (
    <Stack space="xsmall">
      <Sections>{dataSourceSection}</Sections>

      {form.get('sliConfigId').map(field => (
        <Sections>
          <SelectInSection
            label="Configured SLI"
            id="metric-configurator-sli-id"
            value={field.value}
            onChange={e =>
              onChange([], form =>
                form.updateIn(['sliConfigId'], field => field.setValue(e.target.value).setTouched(true))
              )
            }
            hasError={!field.valid && field.touched}
            actions={<HelpAction>SLI configuration used to compute error budget and SLI values</HelpAction>}
            additionalContent={<TouchedMessages field={field} />}
          >
            <option value="">Please select</option>
            {sliConfigurations &&
              sliConfigurations.map(({ id, sliName }) => (
                <option key={id} value={id}>
                  {sliName}
                </option>
              ))}
          </SelectInSection>
        </Sections>
      ))}

      {form.get('slo').map(field => (
        <Sections>
          <InputInSection
            label="SLO"
            id="metric-configurator-slo"
            type="number"
            value={
              typeof field.value === 'number'
                ? parseFloat(Number.parseFloat(field.value * 100).toPrecision(6))
                : field.value
            }
            onChange={e => {
              let newValue = undefined;
              if (e.target.value !== '' && !isNaN(e.target.valueAsNumber)) {
                newValue = parseFloat((e.target.valueAsNumber / 100).toPrecision(6));
              }
              onChange(['slo'], field => field.setValue(newValue).setTouched(true));
            }}
            hasError={!field.valid && field.touched}
            min={0}
            max={99.99}
            step="any"
            actions={
              <HelpAction>
                Type in your desired SLO threshold from <code>{percentage.compact(0)}</code> to{' '}
                <code>{percentage.detailed(0.9999)}</code>.
              </HelpAction>
            }
            additionalContent={<TouchedMessages field={field} />}
          />
        </Sections>
      ))}

      {form.get('metric').map(field => (
        <Sections>
          <SelectInSection
            label="Value Type"
            id="metric-configurator-metric"
            value={field.value}
            onChange={e =>
              onChange([], form => form.updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true)))
            }
            hasError={!field.valid && field.touched}
            additionalContent={<TouchedMessages field={field} />}
          >
            <option value="">Please select</option>
            {Object.keys(serviceLevelIndicators)
              .sort((a, b) => compareIgnoreCase(serviceLevelIndicators[a], serviceLevelIndicators[b]))
              .map(key => (
                <option key={key} value={key}>
                  {serviceLevelIndicators[key]}
                </option>
              ))}
          </SelectInSection>
        </Sections>
      ))}

      {formatterSection}
      {timeShiftConfiguration}
      {labelSection}
    </Stack>
  );
}
