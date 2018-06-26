import { createField, createMapForm, notBlankValidator, composeValidators } from 'formalistic';
import React, { Fragment } from 'react';

import AnalyzeFilterForm, {
  KeyListGroup,
  KeyPart,
  SelectBox,
  KeyValueSeperator,
  ValueGroup
} from 'in-analyze/Filter/Dialogs/AnalyzeFilterForm';
import { findSubTreeByFullyQualifiedName, getTagTree } from 'in-applications/tags';
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
    const { form, onValueChanged } = this.props;

    return (
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

        <KeyValueSeperator />

        {form.get('value').map(field => (
          <ValueGroup field={field}>
            <Input
              type={form.get('type').value === TAG_TYPES.NUMBER ? 'number' : 'text'}
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

function getFullPathTillNode(node, name) {
  let cursor = node.parentNode;
  while (cursor) {
    if (cursor && cursor.parentNode) {
      if (name) {
        name = `${cursor.name}.${name}`;
      } else {
        name = cursor.name;
      }
    }
    cursor = cursor.parentNode;
  }
  return name;
}

function getDeepestPossibleNodePath(name) {
  let cursor = findSubTreeByFullyQualifiedName(name);
  while (cursor) {
    if (cursor.children.length !== 1) {
      break;
    }

    cursor = cursor.children[0];
    name = `${name}.${cursor.name}`;
  }
  return name;
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
            onNameChanged(getTagTree(), e.target.value);
          }
        }}
      >
        <option key={part} value={part}>
          {part}
        </option>
        {i === 0 &&
          rootNode.children.map(childNode => (
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
            {node.parentNode.children.map(childNode => (
              <option key={childNode.name} value={childNode.name}>
                {childNode.name}
              </option>
            ))}
          </SelectBox>
        </KeyPart>
      ))}

      {lastNode.children.length > 0 && (
        <KeyPart key={lastNode.fullyQualifiedName}>
          <SelectBox
            id={lastNode.name}
            value=""
            onChange={e => {
              const childNode = findChildByName(lastNode.children, e.target.value);
              onNameChanged(childNode, e.target.value);
            }}
          >
            {lastNode.children.length > 1 && <option key="" value="" />}
            {lastNode.children.map(childNode => (
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

function findChildByName(children, childName) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.name === childName) {
      return child;
    }
  }
}

function getTreeNodesTillName(name) {
  const treeNode = findSubTreeByFullyQualifiedName(name);
  if (!treeNode) {
    return null;
  }

  const nodesTillRoot = [];
  let nodeCursor = treeNode;
  while (nodeCursor) {
    if (nodeCursor.parentNode) {
      nodesTillRoot.push(nodeCursor);
    }
    nodeCursor = nodeCursor.parentNode;
  }
  return nodesTillRoot.reverse();
}

export function getTagEditForm(name, value) {
  const nodeInTree = findSubTreeByFullyQualifiedName(name);
  const type = nodeInTree.type;
  return createMapForm()
    .put(
      'name',
      createField({
        value: name,
        validator: nameValidator
      })
    )
    .put(
      'type',
      createField({
        value: type
      })
    )
    .put(
      'value',
      createField({
        value: value,
        validator: getValueValidatorByType(type)
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

function getValueValidatorByType(type) {
  if (type === 'KEY_VALUE_PAIRS') {
    return composeValidators(keyValuePairValidator, notBlankValidator);
  }
  return notBlankValidator;
}

function keyValuePairValidator(v) {
  if (v == null || isBlank(v)) {
    return null;
  }

  if (v.indexOf('=') === -1) {
    return null;
  }

  const keyAndValue = v.split('=');
  const containsMultipleEquals = keyAndValue.length > 2;
  if (containsMultipleEquals) {
    return [
      {
        severity: 'error',
        message: "The value is not allowed to contains multiple '=' characters."
      }
    ];
  }

  const subKey = keyAndValue[0];
  const value = keyAndValue[1];

  if (!subKey) {
    return [
      {
        severity: 'error',
        message: "When using the '=' character, you need to define a key in the form of key=value."
      }
    ];
  }

  if (!value) {
    return [
      {
        severity: 'error',
        message: "When using the '=' character, you need to define a value in the form of key=value."
      }
    ];
  }

  return null;
}
