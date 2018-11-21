import React from 'react';

import {
  FlexWrapper,
  CustomKeySection,
  OperatorSelection,
  ValueInput,
  KeySelectionSection
} from 'in-analyze/Dialogs/components/AnalyzeFilterFormComponents';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { operators } from 'in-analyze/applicationFilter';

export default function TagFilterEditor({
  keys,
  tagKey,
  secondLevelName,
  operator,
  value,
  nameFieldMessages,
  secondLevelNameFieldMessages,
  valueFieldMessages,
  tagSuggestionResult,
  tagSecondLevelNameSuggestionResult,
  operatorBlacklist,
  onChange,
  autoFocus
}) {
  const node = findSubTreeByFullyQualifiedName(tagKey);

  return (
    <FlexWrapper>
      <KeySelectionSection
        keys={keys}
        value={tagKey}
        messages={nameFieldMessages}
        onChange={value => onChange('key', value)}
        autoFocus={autoFocus}
      />

      <CustomKeySection
        value={secondLevelName}
        node={node}
        messages={secondLevelNameFieldMessages}
        onChange={value => onChange('secondLevelName', value)}
        tagSecondLevelNameSuggestionResult={tagSecondLevelNameSuggestionResult}
      />

      <OperatorSelection
        value={operator}
        onChange={value => onChange('operator', value)}
        node={node}
        operatorBlacklist={operatorBlacklist}
      />

      {operator !== operators.NOT_EMPTY &&
        operator !== operators.IS_EMPTY && (
          <ValueInput
            tagKey={tagKey}
            value={value}
            messages={valueFieldMessages}
            tagSuggestionResult={tagSuggestionResult}
            onChange={value => onChange('value', value)}
          />
        )}
    </FlexWrapper>
  );
}
