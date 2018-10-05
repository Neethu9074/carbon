import React, { Fragment } from 'react';

import {
  FlexWrapper,
  NamedSection,
  HelpText,
  CustomKeySection,
  KeySelectionSection
} from 'in-analyze/Dialogs/components/AnalyzeFilterFormComponents';
import { findSubTreeByFullyQualifiedName, callGroupBlacklist } from 'in-applications/tags';

export default function EditGroupForm(props) {
  const { form, onChange, filters } = props;
  const isTracesDataSource = filters.get('dataSource') === 'traces';
  const nameField = form.get('nameForm').value.get('name');
  const node = findSubTreeByFullyQualifiedName(nameField.value);

  return (
    <Fragment>
      <HelpText>Select a tag by which your calls should be grouped.</HelpText>

      <NamedSection name="Tag">
        <FlexWrapper>
          {nameField.map(field => (
            <KeySelectionSection
              {...props}
              field={field}
              messages={nameField.messages}
              getNodesChildren={isTracesDataSource ? getTraceGroupNodesChildren : getCallGroupNodesChildren}
            />
          ))}

          <CustomKeySection {...props} node={node} onChange={onChange} />
        </FlexWrapper>
      </NamedSection>
    </Fragment>
  );
}

function getCallGroupNodesChildren(node) {
  return node.getChildren({ blacklist: callGroupBlacklist });
}

function getTraceGroupNodesChildren() {
  return [{ name: 'trace.name' }];
}
