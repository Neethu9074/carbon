import React, { Fragment } from 'react';

import {
  FlexWrapper,
  NamedSection,
  HelpText,
  CustomKeySection,
  KeySelectionSection
} from 'in-analyze/Dialogs/components/AnalyzeFilterFormComponents';

import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';

export default function EditGroupForm(props) {
  const { form, keys, onChange, tagSecondLevelNameSuggestionResult } = props;

  const nameForm = form.get('nameForm');
  const nameField = nameForm.value.get('name');
  const secondLevelNameField = nameForm.value.get('secondLevelName');
  const nameFormValidationMessages = nameForm.messages;

  const node = findSubTreeByFullyQualifiedName(nameField.value);

  return (
    <Fragment>
      <HelpText>Select a tag by which your calls should be grouped.</HelpText>

      <NamedSection name="Tag">
        <FlexWrapper>
          <KeySelectionSection
            keys={keys}
            value={nameField.value}
            messages={nameFormValidationMessages.filter(message => message.field === 'name')}
            onChange={value => onChange('name', value)}
          />

          <CustomKeySection
            value={secondLevelNameField.value}
            node={node}
            messages={nameFormValidationMessages.filter(message => message.field === 'secondLevelName')}
            onChange={value => onChange('secondLevelName', value)}
            tagSecondLevelNameSuggestionResult={tagSecondLevelNameSuggestionResult}
          />
        </FlexWrapper>
      </NamedSection>
    </Fragment>
  );
}
