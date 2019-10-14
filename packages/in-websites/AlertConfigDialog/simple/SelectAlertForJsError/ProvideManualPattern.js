import React from 'react';

import { fieldNames } from 'in-websites/AlertConfigDialog/form/alertDialogFormDefinition';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import locals from './ProvideManualPattern.mless';

export function ProvideManualPattern({ form, onChange }) {
  return (
    <div className={locals.container}>
      {form.get(fieldNames.matchingOperator).map(field => (
        <FormGroup>
          <Label htmlFor={fieldNames.matchingOperator} hasError={!field.valid && field.touched}>
            Error Message
          </Label>
          <ComboBox
            name={fieldNames.matchingOperator}
            value={field.value}
            options={operators()}
            onChange={e => onChange(form, fieldNames.matchingOperator, (e && e.value) || '')}
            searchable
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {form.get(fieldNames.value).map(field => (
        <FormGroup>
          <Label htmlFor={fieldNames.value} hasError={!field.valid && field.touched}>
            String
          </Label>
          <Input
            type="text"
            name={fieldNames.value}
            value={field.value}
            onChange={e => onChange(form, fieldNames.value, (e && e.target.value) || '')}
            hasError={!field.valid && field.touched}
            autoComplete="off"
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </div>
  );
}

function operators() {
  return Object.freeze([{ value: 'EQUALS', label: 'equals' }, { value: 'CONTAINS', label: 'contains' }]);
}
