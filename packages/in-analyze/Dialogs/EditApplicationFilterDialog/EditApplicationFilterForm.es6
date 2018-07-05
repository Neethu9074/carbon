import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React from 'react';

import AnalyzeFilterForm, {
  KeyListGroup,
  KeyPart,
  FieldSeperator,
  AutoCompletedSelect,
  ValueGroup
} from 'in-analyze/Dialogs/AnalyzeFilterForm';
import Input from 'in-components/form/Input/Input';

export default function EditApplicationFilterForm({ form, onValueChanged, tagSuggestionOptions }) {
  return (
    <AnalyzeFilterForm>
      {form.get('name').map(field => {
        const parts = field.value.split('.');
        return (
          <KeyListGroup field={field}>
            {parts.map(part => (
              <KeyPart key={part}>
                <Input id={part} value={part} onChange={() => {}} autoComplete="off" />
              </KeyPart>
            ))}
          </KeyListGroup>
        );
      })}

      <FieldSeperator>:</FieldSeperator>

      {form.get('value').map(field => (
        <ValueGroup field={field}>
          <AutoCompletedSelect
            field={field}
            onValueChanged={onValueChanged}
            autoCompletedOptions={tagSuggestionOptions}
            clearable
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
