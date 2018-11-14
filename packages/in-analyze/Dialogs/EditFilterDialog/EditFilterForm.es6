import React, { Fragment } from 'react';

import {
  FlexWrapper,
  CustomKeySection,
  SelectBox,
  NamedSection,
  OperatorSelection,
  AutoCompletedSelect,
  HelpText,
  KeySelectionSection
} from 'in-analyze/Dialogs/components/AnalyzeFilterFormComponents';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { operators, TAG_TYPES } from 'in-analyze/applicationFilter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';

import locals from './EditFilterForm.mless';

export default function EditFilterForm(props) {
  const { keys, form, helpText, onChange, withExtendedOperators } = props;
  const nameField = form.get('nameForm').value.get('name');
  const node = findSubTreeByFullyQualifiedName(nameField.value);

  return (
    <Fragment>
      {helpText && <HelpText>{helpText}</HelpText>}

      <NamedSection name="Tag">
        <FlexWrapper>
          {form
            .get('nameForm')
            .map(subForm =>
              subForm.value
                .get('name')
                .map(field => <KeySelectionSection {...props} field={field} messages={subForm.messages} keys={keys} />)
            )}

          <CustomKeySection {...props} node={node} onChange={onChange} />

          {form
            .get('valueForm')
            .value.get('operator')
            .map(field => (
              <OperatorSelection
                withExtendedOperators={withExtendedOperators}
                field={field}
                onChange={onChange}
                node={node}
              />
            ))}

          {form.get('valueForm').map(valueFormField => {
            const operator = valueFormField.value.get('operator').value;
            if (operator === operators.NOT_EMPTY || operator === operators.IS_EMPTY) {
              return null;
            }

            return valueFormField.value.get('value').map(field => (
              <FormGroup className={locals.valueFormGroup}>
                <ValueInputByType {...props} field={field} />
                <TouchedMessages field={valueFormField} className={locals.validationMessage} />
              </FormGroup>
            ));
          })}
        </FlexWrapper>
      </NamedSection>
    </Fragment>
  );
}

function ValueInputByType({ form, field, onChange, tagSuggestionResult }) {
  const nodeInTree = findSubTreeByFullyQualifiedName(form.get('nameForm').value.get('name').value);
  const type = nodeInTree ? nodeInTree.type : null;

  if (type === TAG_TYPES.BOOLEAN.technicalName) {
    return (
      <SelectBox
        id="value"
        value={field.value}
        onChange={e => onChange('value', e.value)}
        options={[{ label: 'false', value: 'false' }, { label: 'true', value: 'true' }]}
      />
    );
  }

  const isNumberInput = type === TAG_TYPES.NUMBER.technicalName ? true : false;
  if (isNumberInput) {
    return (
      <Input
        type="number"
        min={0}
        step="1"
        id="value"
        value={field.value}
        onChange={e => onChange('value', e.target.value)}
        autoComplete="off"
        autoFocus
      />
    );
  }

  return (
    <AutoCompletedSelect
      field={field}
      onChange={value => onChange('value', value)}
      tagSuggestionResult={tagSuggestionResult}
    />
  );
}
