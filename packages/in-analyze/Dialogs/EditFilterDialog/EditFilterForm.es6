import React, { Fragment } from 'react';

import {
  FlexWrapper,
  CustomKeySection,
  NamedSection,
  OperatorSelection,
  ValueInput,
  HelpText,
  KeySelectionSection
} from 'in-analyze/Dialogs/components/AnalyzeFilterFormComponents';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { operators } from 'in-analyze/applicationFilter';

export default function EditFilterForm({
  keys,
  form,
  helpText,
  onChange,
  withExtendedOperators,
  tagSuggestionResult,
  tagSecondLevelNameSuggestionResult
}) {
  const nameForm = form.get('nameForm');
  const nameField = nameForm.value.get('name');
  const secondLevelNameField = nameForm.value.get('secondLevelName');
  const nameFormValidationMessages = nameForm.messages;

  const valueForm = form.get('valueForm');
  const operatorField = valueForm.value.get('operator');
  const valueField = valueForm.value.get('value');
  const valueFormValidationMessages = valueForm.messages;

  const node = findSubTreeByFullyQualifiedName(nameField.value);

  return (
    <Fragment>
      {helpText && <HelpText>{helpText}</HelpText>}

      <NamedSection name="Tag">
        <FlexWrapper>
          <KeySelectionSection
            value={nameField.value}
            messages={nameFormValidationMessages.filter(message => message.field === 'name')}
            keys={keys}
            onChange={value => onChange('name', value)}
          />

          <CustomKeySection
            value={secondLevelNameField.value}
            node={node}
            messages={nameFormValidationMessages.filter(message => message.field === 'secondLevelName')}
            onChange={value => onChange('secondLevelName', value)}
            tagSecondLevelNameSuggestionResult={tagSecondLevelNameSuggestionResult}
          />

          <OperatorSelection
            withExtendedOperators={withExtendedOperators}
            value={operatorField.value}
            onChange={value => onChange('operator', value)}
            node={node}
          />

          {operatorField.value !== operators.NOT_EMPTY &&
            operatorField.value !== operators.IS_EMPTY && (
              <ValueInput
                tagKey={nameField.value}
                value={valueField.value}
                messages={valueFormValidationMessages}
                tagSuggestionResult={tagSuggestionResult}
                onChange={value => onChange('value', value)}
              />
            )}
        </FlexWrapper>
      </NamedSection>
    </Fragment>
  );
}
