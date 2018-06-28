import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React, { Fragment } from 'react';

import AnalyzeFilterForm, {
  KeyListGroup,
  KeyPart,
  SelectBox,
  FieldSeperator,
  ValueGroup
} from 'in-analyze/Dialogs/AnalyzeFilterForm';
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
    const { form, onCustomNameChanged, onValueChanged } = this.props;

    return (
      <AnalyzeFilterForm>
        {form
          .get('customNameSubform')
          .value.get('name')
          .map(field => (
            <KeyListGroup field={field}>
              <KeySelection
                {...this.props}
                treeNodesTillName={treeNodesTillName}
                field={field}
                onNameChanged={this.onNameChanged}
              />
            </KeyListGroup>
          ))}

        <FieldSeperator label=":" />
        <CustomKey {...this.props} treeNodesTillName={treeNodesTillName} onCustomNameChanged={onCustomNameChanged} />

        {form.get('value').map(field => (
          <ValueGroup field={field}>
            <Input
              type={form.get('customNameSubform').value.get('type') === TAG_TYPES.NUMBER ? 'number' : 'text'}
              id="value"
              value={field.value}
              onChange={e => onValueChanged(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </ValueGroup>
        ))}
      </AnalyzeFilterForm>
    );
  }

  onNameChanged = (oldNode, newName) => {
    this.props.onNameChanged(getDeepestPossibleNodePath(getFullPathTillNode(oldNode, newName)));
  };
}

function KeySelection(props) {
  const { treeNodesTillName, field, onNameChanged } = props;
  if (!treeNodesTillName) {
    return <UnknownKeySelection {...props} name={field.value} onNameChanged={onNameChanged} />;
  }
  return <KnownKeySelection treeNodesTillName={treeNodesTillName} {...props} onNameChanged={onNameChanged} />;
}

function UnknownKeySelection({ name, onNameChanged }) {
  const rootNode = getTagTree();
  const parts = name.split('.');
  return parts.map((part, i) => (
    <KeyPart key={part}>
      <SelectBox
        id={part}
        value={part}
        onChange={e => {
          if (i === 0) {
            onNameChanged(rootNode, e.target.value);
          }
        }}
      >
        <option key={part} value={part}>
          {part}
        </option>
        {i === 0 &&
          rootNode.getFilteredChildren().map(childNode => (
            <option key={childNode.name} value={childNode.name}>
              {childNode.name}
            </option>
          ))}
      </SelectBox>
    </KeyPart>
  ));
}

function KnownKeySelection({ onNameChanged, treeNodesTillName }) {
  const lastNode = treeNodesTillName[treeNodesTillName.length - 1];

  return (
    <Fragment>
      {treeNodesTillName.map(node => (
        <KeyPart key={node.fullyQualifiedName}>
          <SelectBox id={node.name} value={node.name} onChange={e => onNameChanged(node, e.target.value)}>
            {node.parentNode.isTag && <option key="" value="" />}
            {node.parentNode.getFilteredChildren().map(childNode => (
              <option key={childNode.name} value={childNode.name}>
                {childNode.name}
              </option>
            ))}
          </SelectBox>
        </KeyPart>
      ))}

      {lastNode.getFilteredChildren().length > 0 && (
        <KeyPart key={lastNode.fullyQualifiedName}>
          <SelectBox
            id={lastNode.name}
            value=""
            onChange={e => {
              const childNode = findChildByName(lastNode, e.target.value);
              onNameChanged(childNode, e.target.value);
            }}
          >
            {lastNode.getFilteredChildren().length > 1 && <option key="" value="" />}
            {lastNode.getFilteredChildren().map(childNode => (
              <option key={childNode.name} value={childNode.name}>
                {childNode.name}
              </option>
            ))}
          </SelectBox>
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
      <FieldSeperator label="=" />
    </Fragment>
  );
}

export function getInitialForm(name, value) {
  const nodeInTree = findSubTreeByFullyQualifiedName(name);
  const type = nodeInTree ? nodeInTree.type : TAG_TYPES.STRING;

  let customName = '';
  if (type === TAG_TYPES.KEY_VALUE_PAIR) {
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
