import React, { Fragment } from 'react';

import { NamedSection, HelpText } from 'in-analyze/Dialogs/components/AnalyzeFilterFormComponents';
import TagFilterEditor from 'in-analyze/Dialogs/components/TagFilterEditor';

export default function EditFilterForm({
  keys,
  form,
  helpText,
  onChange,
  tagSuggestionResult,
  tagSecondLevelNameSuggestionResult,
  operatorBlacklist
}) {
  const nameForm = form.get('nameForm');
  const keyField = nameForm.value.get('key');
  const secondLevelNameField = nameForm.value.get('secondLevelName');
  const nameFieldMessages = nameForm.messages.filter(message => message.field === 'key');
  const secondLevelNameFieldMessages = nameForm.messages.filter(message => message.field === 'secondLevelName');

  const valueForm = form.get('valueForm');
  const operatorField = valueForm.value.get('operator');
  const valueField = valueForm.value.get('value');
  const valueFieldMessages = valueForm.messages;

  return (
    <Fragment>
      {helpText && <HelpText>{helpText}</HelpText>}

      <NamedSection name="Tag">
        <TagFilterEditor
          keys={keys}
          tagKey={keyField.value}
          secondLevelName={secondLevelNameField.value}
          operator={operatorField.value}
          value={valueField.value}
          nameFieldMessages={nameFieldMessages}
          secondLevelNameFieldMessages={secondLevelNameFieldMessages}
          valueFieldMessages={valueFieldMessages}
          tagSuggestionResult={tagSuggestionResult}
          tagSecondLevelNameSuggestionResult={tagSecondLevelNameSuggestionResult}
          operatorBlacklist={operatorBlacklist}
          onChange={onChange}
          autoFocus
        />
      </NamedSection>
    </Fragment>
  );
}
