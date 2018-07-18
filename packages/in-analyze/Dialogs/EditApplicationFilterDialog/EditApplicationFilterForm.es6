import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React from 'react';

import AnalyzeFilterForm, {
  KeyListGroup,
  KeyPart,
  FieldSeperator,
  FixedSelection,
  AutoCompletedSelect,
  ValueGroup,
  NamedSection
} from 'in-analyze/Dialogs/components/AnalyzeFilterForm';

export default function EditApplicationFilterForm({ form, onChange, tagSuggestionOptions }) {
  return (
    <NamedSection name="Tag">
      <AnalyzeFilterForm>
        {form.get('name').map(field => {
          const parts = field.value.split('.');
          return (
            <KeyListGroup field={field}>
              {parts.map(part => (
                <KeyPart key={part}>
                  <FixedSelection value={part} />
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
              onChange={onChange}
              autoCompletedOptions={tagSuggestionOptions}
              clearable
            />
          </ValueGroup>
        ))}
      </AnalyzeFilterForm>
    </NamedSection>
  );
}

export function getInitialForm(props = {}) {
  let { name = '', value = '' } = props;

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
