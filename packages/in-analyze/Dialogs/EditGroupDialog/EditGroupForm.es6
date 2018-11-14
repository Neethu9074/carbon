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
  const { form, onChange } = props;
  const nameField = form.get('nameForm').value.get('name');
  const node = findSubTreeByFullyQualifiedName(nameField.value);

  return (
    <Fragment>
      <HelpText>Select a tag by which your calls should be grouped.</HelpText>

      <NamedSection name="Tag">
        <FlexWrapper>
          {nameField.map(field => (
            <KeySelectionSection {...props} field={field} messages={nameField.messages} />
          ))}
          <CustomKeySection {...props} node={node} onChange={onChange} />
        </FlexWrapper>
      </NamedSection>
    </Fragment>
  );
}
