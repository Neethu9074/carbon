import React from 'react';

import AnalyzeFilterForm, {
  KeyListGroup,
  KeyPart,
  FieldSeperator,
  FixedSelection,
  AutoCompletedSelect,
  ValueGroup,
  NamedSection
} from 'in-analyze/Dialogs/components/AnalyzeFilterFormComponents';

export default function EditApplicationFilterForm({ form, onChange, tagSuggestionOptions }) {
  return (
    <NamedSection name="Tag">
      <AnalyzeFilterForm>
        {form
          .get('nameForm')
          .value.get('name')
          .map(field => {
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
