import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React from 'react';

import AnalyzeFilterForm, {
  KeyListGroup,
  KeyPart,
  SelectBox,
  FieldSeperator,
  ValueGroup
} from 'in-analyze/Dialogs/AnalyzeFilterForm';
import Input from 'in-components/form/Input';

export default function EditApplicationFilterForm({ form, onValueChanged }) {
  return (
    <AnalyzeFilterForm>
      {form.get('name').map(field => {
        const parts = field.value.split('.');
        return (
          <KeyListGroup field={field}>
            {parts.map(part => (
              <KeyPart key={part}>
                <SelectBox id={part} value={part} onChange={() => {}}>
                  <option key={part} value={part}>
                    {part}
                  </option>
                </SelectBox>
              </KeyPart>
            ))}
          </KeyListGroup>
        );
      })}

      <FieldSeperator label=":" />

      {form.get('value').map(field => (
        <ValueGroup field={field}>
          <Input
            type="text"
            id="value"
            value={field.value}
            onChange={e => onValueChanged(e.target.value)}
            autoComplete="off"
            autoFocus
          />
        </ValueGroup>
      ))}
    </AnalyzeFilterForm>
  );
}

export function getInitialForm(name, value) {
  return createMapForm()
    .put(
      'name',
      createField({
        value: name
      })
    )
    .put(
      'value',
      createField({
        value: value,
        validator: notBlankValidator
      })
    );
}
