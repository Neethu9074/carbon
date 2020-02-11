import React from 'react';

import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

// Step 1: Select Source

// For website source
//   Step 2: Select beacon type
//   Step 3: Select metric and aggregation          // TODO get this from backend?
//   Step 4: Define tag filters

export default function MetricConfiguratorPresenter({form, onChange, onChangeSource, onSubmit}) {
  const sourceField = form.get('source');

  let sourceSpecificConfiguration;
  if (sourceField.value) {
    const FormComponent = sources[sourceField.value].Form;
    sourceSpecificConfiguration = <FormComponent form={form} onChange={onChange} />;
  }

  return (
    <form onSubmit={onSubmit}>
      <FormGroup>
        <Label
          htmlFor="metic-configurator-source"
          hasError={!sourceField.valid && sourceField.touched}
        >
          Source
        </Label>
        <Select
          id="metic-configurator-source"
          value={sourceField.value}
          onChange={e => onChangeSource(e.target.value)}
          hasError={!sourceField.valid && sourceField.touched}
        >
          <option value="">
            Please select
          </option>
          {Object.keys(sources)
            .sort((a, b) => compareIgnoreCase(sources[a].label, sources[b].label))
            .map(key => (
              <option key={key} value={key}>
                {sources[key].label}
              </option>
            ))}
        </Select>
        <TouchedMessages field={sourceField} />
      </FormGroup>

      {sourceSpecificConfiguration}
    </form>
  );
}
