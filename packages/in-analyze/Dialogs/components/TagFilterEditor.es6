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
  name,
  secondLevelName,
  operator,
  value,
  nameFieldMessages,
  secondLevelNameFieldMessages,
  valueFieldMessages,
  tagSuggestionResult,
  tagSecondLevelNameSuggestionResult,
  withExtendedOperators,
  onChange
}) {
  const node = findSubTreeByFullyQualifiedName(name);

  return (
    <FlexWrapper>
      <KeySelectionSection
        keys={keys}
        value={name}
        messages={nameFieldMessages}
        onChange={value => onChange('name', value)}
      />

      <CustomKeySection
        value={secondLevelName}
        node={node}
        messages={secondLevelNameFieldMessages}
        onChange={value => onChange('secondLevelName', value)}
        tagSecondLevelNameSuggestionResult={tagSecondLevelNameSuggestionResult}
      />

      <OperatorSelection
        withExtendedOperators={withExtendedOperators}
        value={operator}
        onChange={value => onChange('operator', value)}
        node={node}
      />

      {operator !== operators.NOT_EMPTY &&
        operator !== operators.IS_EMPTY && (
          <ValueInput
            tagKey={name}
            value={value}
            messages={valueFieldMessages}
            tagSuggestionResult={tagSuggestionResult}
            onChange={value => onChange('value', value)}
          />
        )}
    </FlexWrapper>
  );
}
