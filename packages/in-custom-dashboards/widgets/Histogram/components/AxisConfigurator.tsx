/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item, Field } from 'formalistic';
import React from 'react';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import { publicFormatters } from 'in-stores/metric/formatters';

interface AxisConfiguratorProps {
  label: string;
  axisName: string;
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}

export default function AxisConfigurator({ form, onChange, label, axisName }: AxisConfiguratorProps) {
  return form.get(axisName).map((field: Field<string>) => (
    <SelectInSection
      id={`axis-${axisName}`}
      label={label}
      value={field.value}
      // @ts-expect-error
      onChange={e => onChange([axisName], (field: Item) => field.setValue(e.target.value).setTouched(true))}
      hasError={!field.valid && field.touched}
    >
      {publicFormatters.map(({ id, label }: { id: string; label: string }, index: number) => (
        <option key={`${id}-${index}`} value={id}>
          {label}
        </option>
      ))}
    </SelectInSection>
  ));
}
