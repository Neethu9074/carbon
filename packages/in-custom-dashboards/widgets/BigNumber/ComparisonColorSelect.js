/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { green, red, yellow, orange, blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import Badge from 'in-custom-dashboards/widgets/BigNumber/Badge';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

import locals from './ComparisonColorSelect.mless';

const sortedColors = [
  // Custom sort order for colors
  blue,
  green,
  yellow,
  orange,
  red
];

export default function ComparisonColorSelect({ label, examplePercentage, field, onChange, idSuffix }) {
  return (
    <>
      <FormGroup>
        <Label
          htmlFor={`metic-configurator-time-shift-comparison-${idSuffix}}`}
          hasError={!field.valid && field.touched}
        >
          {label}
        </Label>
        <div className={locals.wrapper}>
          <Badge colorId={field.value}>{examplePercentage}</Badge>
          <Select
            id={`metic-configurator-time-shift-comparison-${idSuffix}}`}
            value={field.value}
            onChange={e => onChange(e.target.value)}
            hasError={!field.valid && field.touched}
            className={locals.input}
          >
            {sortedColors.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <TouchedMessages field={field} />
      </FormGroup>
    </>
  );
}
