import React, { Fragment } from 'react';

import AnalyzeFilterForm, {
  FieldSeperator,
  KeyListGroup,
  KeyPart,
  SelectBox,
  ValueGroup,
  TagCategorySwitcher,
  NamedSection,
  OperatorSelection,
  AutoCompletedSelect
} from 'in-analyze/Dialogs/components/AnalyzeFilterFormComponents';
import {
  getTreeNodesTillName,
  getFullPathTillNode,
  getDeepestPossibleNodePath,
  findChildByName,
  findSubTreeByFullyQualifiedName,
  getTagTree
} from 'in-applications/tags';
import { operators, TAG_TYPES } from 'in-analyze/applicationFilter';
import Input from 'in-components/form/Input';

export default class extends React.Component {
  static displayName = 'EditFilterForm';

  constructor(props) {
    super(props);

    this.state = {
      treeNodesTillName: getTreeNodesTillName(props.form.get('nameForm').value.get('name').value)
    };
  }

  componentWillUpdate(nextProps) {
    const oldName = this.props.form.get('nameForm').value.get('name').value;
    const newName = nextProps.form.get('nameForm').value.get('name').value;
    if (oldName !== newName) {
      this.setState({
        treeNodesTillName: getTreeNodesTillName(newName)
      });
    }
  }

  render() {
    const treeNodesTillName = this.state.treeNodesTillName;
    const { form, onChange } = this.props;
    const nameField = form.get('nameForm').value.get('name');
    const isKeyValid = nameField.valid;

    let node = isKeyValid ? findSubTreeByFullyQualifiedName(nameField.value) : null;

    return (
      <Fragment>
        <NamedSection name="Category">
          <TagCategorySwitcher {...this.props} />
        </NamedSection>
        <NamedSection name="Tag">
          <AnalyzeFilterForm>
            {nameField.map(field => (
              <KeyListGroup field={field}>
                <KeySelection
                  {...this.props}
                  treeNodesTillName={treeNodesTillName}
                  field={field}
                  onChange={this.onChange}
                />
              </KeyListGroup>
            ))}

            {isKeyValid && (
              <Fragment>
                <CustomKey
                  {...this.props}
                  treeNodesTillName={treeNodesTillName}
                  onChange={value => onChange('customName', value)}
                />
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
                    <ValueGroup field={valueFormField}>
                      <ValueInputByType form={form} field={field} onChange={onChange} />
                    </ValueGroup>
                  ));
                })}
              </Fragment>
            )}
          </AnalyzeFilterForm>
        </NamedSection>
      </Fragment>
    );
  }

  onChange = (oldNode, newName) => {
    this.props.onChange(
      'name',
      getDeepestPossibleNodePath({
        name: getFullPathTillNode(oldNode, newName),
        filtered: true,
        blacklist: this.props.blacklist
      })
    );
  };
}

function KeySelection(props) {
  const { treeNodesTillName, field, onChange } = props;
  if (!treeNodesTillName) {
    return <UnknownKeySelection {...props} name={field.value} onChange={onChange} />;
  }
  return <KnownKeySelection treeNodesTillName={treeNodesTillName} {...props} onChange={onChange} />;
}

function UnknownKeySelection({ name, onChange, selectedCategory, blacklist }) {
  const rootNode = getTagTree();
  const parts = name.split('.');

  return parts.map((part, i) => {
    let options = getNodesChildren(rootNode, selectedCategory, blacklist).map(childNode => ({
      label: childNode.name,
      value: childNode.name
    }));
    if (part) {
      options = [{ value: part, label: part }].concat(options);
    }

    return (
      <KeyPart key={part}>
        <SelectBox
          id={part}
          value={part}
          onChange={e => {
            if (i === 0) {
              onChange(rootNode, e.value);
            }
          }}
          options={options}
        />
      </KeyPart>
    );
  });
}

function KnownKeySelection({ onChange, treeNodesTillName, selectedCategory, blacklist }) {
  const lastNode = treeNodesTillName[treeNodesTillName.length - 1];

  return (
    <Fragment>
      {treeNodesTillName.map(node => (
        <KeyPart key={node.fullyQualifiedName}>
          <SelectBox
            id={node.name}
            value={node.name}
            onChange={e => onChange(node, e.value)}
            options={getNodesChildren(node.parentNode, selectedCategory, blacklist).map(childNode => ({
              label: childNode.name,
              value: childNode.name
            }))}
          />
        </KeyPart>
      ))}

      {getNodesChildren(lastNode, selectedCategory, blacklist).length > 0 && (
        <KeyPart key={lastNode.fullyQualifiedName}>
          <SelectBox
            id={lastNode.name}
            value=""
            onChange={e => {
              const childNode = findChildByName(lastNode, e.value);
              onChange(childNode, e.value);
            }}
            options={getNodesChildren(lastNode, selectedCategory, blacklist).map(childNode => ({
              label: childNode.name,
              value: childNode.name
            }))}
          />
        </KeyPart>
      )}
    </Fragment>
  );
}

function getNodesChildren(node, selectedCategory, blacklist) {
  return node.getChildren({ category: selectedCategory, blacklist });
}

function CustomKey({ form, onChange, treeNodesTillName }) {
  if (!treeNodesTillName) {
    return null;
  }
  const lastNode = treeNodesTillName[treeNodesTillName.length - 1];
  const currentSelectedNode = findSubTreeByFullyQualifiedName(lastNode.fullyQualifiedName);
  if (currentSelectedNode.type !== TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
    return null;
  }

  return (
    <Fragment>
      <FieldSeperator>:</FieldSeperator>
      {form.get('nameForm').map(subForm =>
        subForm.value.get('customName').map(field => (
          <ValueGroup field={subForm}>
            <Input
              type="text"
              id="customName"
              value={field.value || ''}
              onChange={e => onChange(e.target.value)}
              autoComplete="off"
            />
          </ValueGroup>
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

  return (
    <AutoCompletedSelect field={field} onChange={onChange} autoCompletedOptions={tagSuggestionOptions} clearable />
  );
}
