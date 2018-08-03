import React, { Fragment } from 'react';
import { get } from 'lodash';

import AnalyzeFilterForm, {
  FieldSeperator,
  NamedSection,
  SelectBox,
  HelpText
} from 'in-analyze/Dialogs/components/AnalyzeFilterFormComponents';
import { findSubTreeByFullyQualifiedName, getTagTree } from 'in-applications/tags';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';

import locals from './EditGroupForm.mless';

export default function EditGroupForm(props) {
  const { form, onChange, helpText } = props;
  const nameField = form.get('nameForm').value.get('name');
  const node = findSubTreeByFullyQualifiedName(nameField.value);

  return (
    <Fragment>
      <HelpText helpText={helpText} />

      <NamedSection name="Tag">
        <AnalyzeFilterForm>
          {nameField.map(field => (
            <FormGroup className={locals.keyGroup}>
              <KeySelection
                {...props}
                field={field}
                onChange={newName =>
                  onChange('name', get(findSubTreeByFullyQualifiedName(newName), ['fullyQualifiedName'], newName))
                }
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}

          <CustomKey {...props} node={node} onChange={value => onChange('customName', value)} />
        </AnalyzeFilterForm>
      </NamedSection>
    </Fragment>
  );
}

function KeySelection({ selectedCategory, field, blacklist, onChange }) {
  const rootNode = getTagTree();
  const options = getNodesChildren(rootNode, selectedCategory, blacklist).map(childNode => ({
    label: childNode.name,
    value: childNode.name
  }));

  return <SelectBox id="key" value={field.value} onChange={e => onChange(e.value)} options={options} />;
}

function CustomKey({ form, onChange, node }) {
  if (!node || node.type !== TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
    return null;
  }

  return (
    <Fragment>
      <FieldSeperator>:</FieldSeperator>

      {form.get('nameForm').map(subForm =>
        subForm.value.get('customName').map(field => (
          <FormGroup className={locals.customKeyGroup}>
            <Input
              type="text"
              id="customName"
              value={field.value}
              onChange={e => onChange(e.target.value)}
              autoComplete="off"
            />
            <TouchedMessages field={subForm} />
          </FormGroup>
        ))
      )}
    </Fragment>
  );
}

function getNodesChildren(node, selectedCategory) {
  return node.getChildren({ category: selectedCategory });
}
