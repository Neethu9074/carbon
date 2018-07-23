import React, { Fragment } from 'react';

import AnalyzeFilterForm, {
  KeyListGroup,
  KeyPart,
  FieldSeperator,
  ValueGroup,
  TagCategorySwitcher,
  NamedSection,
  SelectBox
} from 'in-analyze/Dialogs/components/AnalyzeFilterFormComponents';
import {
  getTreeNodesTillName,
  getFullPathTillNode,
  getDeepestPossibleNodePath,
  findChildByName,
  findSubTreeByFullyQualifiedName,
  getTagTree
} from 'in-applications/tags';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import Input from 'in-components/form/Input';

export default class extends React.Component {
  static displayName = 'EditGroupForm';

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

    return (
      <Fragment>
        <NamedSection name="Category">
          <TagCategorySwitcher {...this.props} />
        </NamedSection>
        <NamedSection name="Tag">
          <AnalyzeFilterForm>
            {form
              .get('nameForm')
              .value.get('name')
              .map(field => (
                <KeyListGroup field={field}>
                  <KeySelection
                    {...this.props}
                    treeNodesTillName={treeNodesTillName}
                    field={field}
                    onChange={(oldNode, newName) => {
                      onChange(
                        'name',
                        getDeepestPossibleNodePath({ name: getFullPathTillNode(oldNode, newName), filtered: false })
                      );
                    }}
                  />
                </KeyListGroup>
              ))}

            <CustomKey
              {...this.props}
              treeNodesTillName={treeNodesTillName}
              onChange={value => onChange('customName', value)}
            />
          </AnalyzeFilterForm>
        </NamedSection>
      </Fragment>
    );
  }
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
              onChange(getTagTree(), e.value);
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
              value={field.value}
              onChange={e => onChange(e.target.value)}
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
