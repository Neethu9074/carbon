import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React, { Fragment } from 'react';

import AnalyzeFilterForm, {
  FieldSeperator,
  KeyListGroup,
  KeyPart,
  SelectBox,
  ValueGroup,
  TagCategorySwitcher,
  NamedSection,
  OperatorSelection
} from 'in-analyze/Dialogs/components/AnalyzeFilterForm';
import {
  getTreeNodesTillName,
  getFullPathTillNode,
  getDeepestPossibleNodePath,
  findChildByName,
  findSubTreeByFullyQualifiedName,
  getTagTree,
  customFilterBlacklist
} from 'in-applications/tags';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import { isBlank } from 'in-services/util/string';
import Input from 'in-components/form/Input';

export default class extends React.Component {
  static displayName = 'EditFilterForm';

  constructor(props) {
    super(props);

    this.state = {
      treeNodesTillName: getTreeNodesTillName(props.form.get('name').value)
    };
  }

  componentWillUpdate(nextProps) {
    const oldName = this.props.form.get('customNameSubform').value.get('name').value;
    const newName = nextProps.form.get('customNameSubform').value.get('name').value;
    if (oldName !== newName) {
      this.setState({
        treeNodesTillName: getTreeNodesTillName(newName)
      });
    }
  }

  render() {
    const treeNodesTillName = this.state.treeNodesTillName;
    const { form, onChange } = this.props;
    const isKeyValid = form.get('name').valid;

    let node = isKeyValid ? findSubTreeByFullyQualifiedName(form.get('name').value) : null;

    return (
      <Fragment>
        <NamedSection name="Category">
          <TagCategorySwitcher {...this.props} />
        </NamedSection>
        <NamedSection name="Tag">
          <AnalyzeFilterForm>
            {form.get('name').map(field => (
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
                {form.get('operator').map(field => <OperatorSelection field={field} onChange={onChange} node={node} />)}

                <CustomKey
                  {...this.props}
                  treeNodesTillName={treeNodesTillName}
                  onChange={value => onChange('customName', value)}
                />

                {form.get('value').map(field => (
                  <ValueGroup field={field}>
                    <ValueInputByType form={form} field={field} onChange={onChange} />
                  </ValueGroup>
                ))}
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
      getDeepestPossibleNodePath({ name: getFullPathTillNode(oldNode, newName), filtered: true })
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

function UnknownKeySelection({ name, onChange, selectedCategory }) {
  const rootNode = getTagTree();
  const parts = name.split('.');

  return parts.map((part, i) => {
    let options = getNodesChildren(rootNode, selectedCategory).map(childNode => ({
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

function KnownKeySelection({ onChange, treeNodesTillName, selectedCategory }) {
  const lastNode = treeNodesTillName[treeNodesTillName.length - 1];

  return (
    <Fragment>
      {treeNodesTillName.map(node => (
        <KeyPart key={node.fullyQualifiedName}>
          <SelectBox
            id={node.name}
            value={node.name}
            onChange={e => onChange(node, e.value)}
            options={getNodesChildren(node.parentNode, selectedCategory).map(childNode => ({
              label: childNode.name,
              value: childNode.name
            }))}
          />
        </KeyPart>
      ))}

      {getNodesChildren(lastNode, selectedCategory).length > 0 && (
        <KeyPart key={lastNode.fullyQualifiedName}>
          <SelectBox
            id={lastNode.name}
            value=""
            onChange={e => {
              const childNode = findChildByName(lastNode, e.value);
              onChange(childNode, e.value);
            }}
            options={getNodesChildren(lastNode, selectedCategory).map(childNode => ({
              label: childNode.name,
              value: childNode.name
            }))}
          />
        </KeyPart>
      )}
    </Fragment>
  );
}

function getNodesChildren(node, selectedCategory) {
  return node.getChildren({ category: selectedCategory, blacklist: customFilterBlacklist });
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
      {form.get('customNameSubform').map(subForm =>
        subForm.value.get('customName').map(field => (
          <ValueGroup field={subForm}>
            <Input
              type="text"
              id="customName"
              value={field.value}
              onChange={e => onChange(e.target.value)}
              autoComplete="off"
            />
          </ValueGroup>
        ))
      )}
      <FieldSeperator>=</FieldSeperator>
    </Fragment>
  );
}

function ValueInputByType({ form, field, onChange }) {
  if (form.get('customNameSubform').value.get('type').value === TAG_TYPES.BOOLEAN.technicalName) {
    return (
      <SelectBox
        id="value"
        value={field.value}
        onChange={e => onChange('value', e.value)}
        options={[{ label: 'false', value: 'false' }, { label: 'true', value: 'true' }]}
      />
    );
  }
  return (
    <Input
      type={
        form.get('customNameSubform').value.get('type').value === TAG_TYPES.NUMBER.technicalName ? 'number' : 'text'
      }
      id="value"
      value={field.value}
      onChange={e => onChange('value', e.target.value)}
      autoComplete="off"
      autoFocus
    />
  );
}

export function getInitialForm(tag = {}) {
  let { name = '', value = '', operator } = tag;

  const nodeInTree = findSubTreeByFullyQualifiedName(name);
  const type = nodeInTree ? nodeInTree.type : TAG_TYPES.STRING.technicalName;

  let customName = '';
  if (type === TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
    const parts = value.split('=');
    if (parts.length > 1) {
      customName = parts[0];
      value = value.slice(customName.length + 1); // also remove the =
    }
  }

  const customNameSubform = createMapForm()
    .put(
      'name',
      createField({
        value: name,
        validator: nameValidator
      })
    )
    .put(
      'customName',
      createField({
        value: customName
      })
    )
    .put(
      'type',
      createField({
        value: type
      })
    );

  return createMapForm()
    .put(
      'name',
      createField({
        value: name,
        validator: nameValidator
      })
    )
    .put(
      'customNameSubform',
      createField({
        value: customNameSubform,
        validator: customNameSubformValidator
      })
    )
    .put(
      'operator',
      createField({
        value: operator
      })
    )
    .put(
      'value',
      createField({
        value: value,
        validator: notBlankValidator
      })
    );
}

function nameValidator(name) {
  if (isBlank(name)) {
    return [
      {
        severity: 'error',
        message: 'Please select a key.'
      }
    ];
  }

  const nodeInTree = findSubTreeByFullyQualifiedName(name);
  if (!nodeInTree) {
    return [
      {
        severity: 'error',
        message: 'Please select a valid key.'
      }
    ];
  }

  if (!nodeInTree.isTag) {
    return [
      {
        severity: 'error',
        message: 'Please select a full key.'
      }
    ];
  }

  return null;
}

function customNameSubformValidator(customNameSubform) {
  const type = customNameSubform.get('type').value;
  if (type !== TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
    return null;
  }

  const customName = customNameSubform.get('customName').value;
  const keyName = customNameSubform.get('name').value;

  // for backwards compatibility reasons, we need to support agent.tag tags with an empty 2nd level key
  if (keyName === 'agent.tag') {
    return null;
  }

  if (isBlank(customName)) {
    return [
      {
        severity: 'error',
        message: 'Please define a sub-key.'
      }
    ];
  }

  return null;
}
