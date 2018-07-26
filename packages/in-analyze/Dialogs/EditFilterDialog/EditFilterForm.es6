import React, { Fragment } from 'react';

import AnalyzeFilterForm, {
  FieldSeperator,
  SelectBox,
  TagCategorySwitcher,
  NamedSection,
  OperatorSelection,
  AutoCompletedSelect
} from 'in-analyze/Dialogs/components/AnalyzeFilterFormComponents';
import { findSubTreeByFullyQualifiedName, getTagTree } from 'in-applications/tags';
import { operators, TAG_TYPES } from 'in-analyze/applicationFilter';
import ValidationBlock from 'in-components/form/ValidationBlock';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';

import locals from './EditFilterForm.mless';

export default function EditFilterForm(props) {
  const { form, onChange } = props;
  const node = findSubTreeByFullyQualifiedName(form.get('nameForm').value.get('name').value);

  return (
    <Fragment>
      <NamedSection name="Category">
        <TagCategorySwitcher {...props} />
      </NamedSection>

      <NamedSection name="Tag">
        <AnalyzeFilterForm>
          {form.get('nameForm').map(subForm =>
            subForm.value.get('name').map(field => (
              <FormGroup className={locals.keyGroup}>
                <KeySelection
                  {...props}
                  node={node}
                  field={field}
                  onChange={newName => onChange('name', findSubTreeByFullyQualifiedName(newName).fullyQualifiedName)}
                />
                {field.messages.map((message, i) => (
                  <ValidationBlock hasError key={i}>
                    {message.message}
                  </ValidationBlock>
                ))}
              </FormGroup>
            ))
          )}

          <CustomKey {...props} node={node} onChange={value => onChange('customName', value)} />

          {form
            .get('valueForm')
            .value.get('operator')
            .map(field => <OperatorSelection field={field} onChange={onChange} node={node} />)}

          {form.get('valueForm').map(valueFormField => {
            const operator = valueFormField.value.get('operator').value;
            if (operator === operators.NOT_EMPTY) {
              return null;
            }

            return valueFormField.value.get('value').map(field => (
              <FormGroup className={locals.valueFormGroup}>
                <ValueInputByType {...props} field={field} />

                <TouchedMessages field={valueFormField} />
              </FormGroup>
            ));
          })}
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

function getNodesChildren(node, selectedCategory, blacklist) {
  return node.getChildren({ category: selectedCategory, blacklist });
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
              value={field.value || ''}
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

function ValueInputByType({ form, field, onChange, tagSuggestionOptions }) {
  if (form.get('nameForm').value.get('type').value === TAG_TYPES.BOOLEAN.technicalName) {
    return (
      <SelectBox
        id="value"
        value={field.value}
        onChange={e => onChange('value', e.value)}
        options={[{ label: 'false', value: 'false' }, { label: 'true', value: 'true' }]}
      />
    );
  }

  const isNumberInput = form.get('nameForm').value.get('type').value === TAG_TYPES.NUMBER.technicalName ? true : false;
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

  return <AutoCompletedSelect field={field} onChange={onChange} autoCompletedOptions={tagSuggestionOptions} />;
}
