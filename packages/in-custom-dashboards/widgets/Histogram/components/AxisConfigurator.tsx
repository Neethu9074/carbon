/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item, Field } from 'formalistic';
import React from 'react';

import {
  formatterPath,
  metricConfigurationPath,
  sourcePath,
  unitPath
} from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { getFormatterById, publicFormatters } from 'in-stores/metric/formatters';
import { getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { unitForInfraMetricsEnabled } from 'in-services/featureFlags';
import { getBaseUnit } from 'in-stores/metric/units';
import { AggregationType } from 'in-types';

interface AxisConfiguratorProps {
  label: string;
  axisName: string;
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}

export default function AxisConfigurator({ form, onChange, label, axisName }: AxisConfiguratorProps) {
  const metricConfig = form.get(metricConfigurationPath);
  const source = metricConfig.get(sourcePath)?.value;
  const baseUnit = unitForInfraMetricsEnabled ? getBaseUnit(metricConfig?.get(unitPath)?.value) : undefined;
  const formatters =
    source === 'INFRASTRUCTURE_METRICS' ? getFormatter(source, '', '' as AggregationType, baseUnit) : publicFormatters;

  //backward compatibility, adding selected formatter to the list of available formatters
  const existingFormatter = getFormatterById(form.get(formatterPath)?.value);
  if (existingFormatter && !formatters.find(formatter => formatter.id === existingFormatter?.id)) {
    formatters.push(existingFormatter);
  }

  return form.get(axisName).map((field: Field<string>) => (
    <SelectInSection
      id={`axis-${axisName}`}
      label={label}
      value={field.value}
      // @ts-expect-error
      onChange={e => onChange([axisName], (field: Item) => field.setValue(e.target.value).setTouched(true))}
      hasError={!field.valid && field.touched}
    >
      {formatters.map(({ id, label }: { id: string; label: string }, index: number) => (
        <option key={`${id}-${index}`} value={id}>
          {label}
        </option>
      ))}
    </SelectInSection>
  ));
}
