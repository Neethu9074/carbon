import { createField, createMapForm } from 'formalistic';
import React, { Fragment } from 'react';

import AnalyzeFilterForm, {
  KeyListGroup,
  KeyPart,
  FieldSeperator,
  ValueGroup,
  TagCategorySwitcher,
  NamedSection,
  SelectBox
} from 'in-analyze/Dialogs/components/AnalyzeFilterForm';
import {
  getTreeNodesTillName,
  getFullPathTillNode,
  getDeepestPossibleNodePath,
  findChildByName,
  findSubTreeByFullyQualifiedName,
  getTagTree
} from 'in-applications/tags';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import { isBlank } from 'in-services/util/string';
import Input from 'in-components/form/Input';

export default class extends React.Component {
  static displayName = 'EditGroupForm';

  constructor(props) {
    super(props);

    this.state = {
      treeNodesTillName: getTreeNodesTillName(props.form.get('name').value)
    };
  }

  componentWillUpdate(nextProps) {
    const oldName = this.props.form.get('name').value;
    const newName = nextProps.form.get('name').value;
    if (oldName !== newName) {
      this.setState({
        treeNodesTillName: getTreeNodesTillName(newName)
      });
    }
  }

  render() {
    const treeNodesTillName = this.state.treeNodesTillName;
    const { form, onCustomNameChanged } = this.props;

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
                  onNameChanged={this.onNameChanged}
                />
              </KeyListGroup>
            ))}

            <CustomKey
              {...this.props}
              treeNodesTillName={treeNodesTillName}
              onCustomNameChanged={onCustomNameChanged}
            />
          </AnalyzeFilterForm>
        </NamedSection>
      </Fragment>
    );
  }

  onNameChanged = (oldNode, newName) => {
    this.props.onNameChanged(
      getDeepestPossibleNodePath({ name: getFullPathTillNode(oldNode, newName), filtered: false })
    );
  };
}

function KeySelection(props) {
  const { treeNodesTillName, field, onNameChanged } = props;
  if (!treeNodesTillName) {
    return <UnknownKeySelection {...props} name={field.value} onNameChanged={onNameChanged} />;
  }
  return <KnownKeySelection treeNodesTillName={treeNodesTillName} {...props} onNameChanged={onNameChanged} />;
}

function UnknownKeySelection({ name, onNameChanged, selectedCategory }) {
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
              onNameChanged(getTagTree(), e.value);
            }
          }}
          options={options}
        />
      </KeyPart>
    );
  });
}

function KnownKeySelection({ onNameChanged, treeNodesTillName, selectedCategory }) {
  const lastNode = treeNodesTillName[treeNodesTillName.length - 1];

  return (
    <Fragment>
      {treeNodesTillName.map(node => (
        <KeyPart key={node.fullyQualifiedName}>
          <SelectBox
            id={node.name}
            value={node.name}
            onChange={e => onNameChanged(node, e.value)}
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
              onNameChanged(childNode, e.value);
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

function CustomKey({ form, onCustomNameChanged, treeNodesTillName }) {
  if (!treeNodesTillName) {
    return null;
  }
  const lastNode = treeNodesTillName[treeNodesTillName.length - 1];
  const currentSelectedNode = findSubTreeByFullyQualifiedName(lastNode.fullyQualifiedName);
  if (currentSelectedNode.type !== TAG_TYPES.KEY_VALUE_PAIR) {
    return null;
  }
  return (
    <Fragment>
      <FieldSeperator>:</FieldSeperator>

      {form.get('customNameSubform').map(subForm =>
        subForm.value.get('customName').map(field => (
          <ValueGroup field={subForm}>
            <Input
              type="text"
              id="customName"
              value={field.value}
              onChange={e => onCustomNameChanged(e.target.value)}
              autoComplete="off"
            />
          </ValueGroup>
        ))
      )}
    </Fragment>
  );
}

function getNodesChildren(node, selectedCategory) {
  return node.getChildren({ category: selectedCategory });
}

export function getInitialForm(group) {
  const name = group.name || '';
  let customName = group.value || '';

  const nodeInTree = findSubTreeByFullyQualifiedName(name);
  const type = nodeInTree ? nodeInTree.type : TAG_TYPES.STRING;

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
  if (type !== TAG_TYPES.KEY_VALUE_PAIR) {
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
