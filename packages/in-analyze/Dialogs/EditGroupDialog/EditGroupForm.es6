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
  const keyField = nameForm.value.get('key');
  const secondLevelNameField = nameForm.value.get('secondLevelName');
  const nameFieldMessages = nameForm.messages.filter(message => message.field === 'key');
  const secondLevelNameFieldMessages = nameForm.messages.filter(message => message.field === 'secondLevelName');

  const node = findSubTreeByFullyQualifiedName(keyField.value);

  return (
    <Fragment>
      <HelpText>Select a tag by which your calls should be grouped.</HelpText>

      <NamedSection name="Tag">
        <FlexWrapper>
          <KeySelectionSection
            keys={keys}
            value={keyField.value}
            messages={nameFieldMessages}
            onChange={value => onChange('key', value)}
            autoFocus
          />

          <CustomKeySection
            value={secondLevelNameField.value}
            node={node}
            messages={secondLevelNameFieldMessages}
            onChange={value => onChange('secondLevelName', value)}
            tagSecondLevelNameSuggestionResult={tagSecondLevelNameSuggestionResult}
          />
        </FlexWrapper>
      </NamedSection>
    </Fragment>
  );
}
