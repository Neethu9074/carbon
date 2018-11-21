import { createField, createMapForm } from 'formalistic';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { operators, TAG_TYPES } from 'in-analyze/applicationFilter';
import { close } from 'in-components/DialogPresenter/store';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Dialog from 'in-components/Dialog';

import locals from './AnalyzeFilterDialog.mless';

export default function AnalyzeFilterDialog(props) {
  const { title } = props;

  return (
    <Dialog
      customHeaderClassName={locals.customHeader}
      contentWrapperClassName={locals.contentWrapper}
      contentClassName={locals.content}
      customHeader={
        <Fragment>
          <h1 className={locals.title}>{title}</h1>
          <SvgIcon
            className={locals.cancelIcon}
            type="lib_openclose_cancel"
            width={32}
            height={32}
            onClick={() => close()}
          />
        </Fragment>
      }
      onClose={() => close()}
    >
      <AnalyzeFilterBasicDialog {...props} />
    </Dialog>
  );
}

class AnalyzeFilterBasicDialog extends React.Component {
  static displayName = 'AnalyzeFilterBasicDialog';

  constructor(props) {
    super(props);

    this.state = {
      form: getInitialForm(props)
    };
  }

  render() {
    const { renderForm, onRemove, removeItemName } = this.props;
    const { form } = this.state;

    return (
      <form onSubmit={e => this.onSubmit(e, form)}>
        {renderForm({
          form,
          onChange: this.onChange
        })}

        <div className={locals.footer}>
          <Button kind="create" type="submit" disabled={!form.hierarchyValid}>
            Save
          </Button>
          {onRemove && (
            <Button
              style={{ marginLeft: 0 }}
              kind="subtle"
              size="compact"
              icon="lib_actions_delete"
              onClick={() => {
                close();
                onRemove();
              }}
            >
              Delete {removeItemName}
            </Button>
          )}
        </div>
      </form>
    );
  }

  onSubmit(e, form) {
    e.preventDefault();

    if (!form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, { recurse: true })
      });
      return;
    }

    close();

    const tag = form.toJS();

    const nameForm = tag.nameForm.toJS();
    tag.name = nameForm.name;
    tag.secondLevelName = nameForm.secondLevelName;

    const valueForm = tag.valueForm.toJS();
    tag.operator = valueForm.operator;
    tag.value = valueForm.value;

    this.props.onSave(tag);
  }

  onChange = (fieldName, value) => {
    let form = this.state.form;
    const { setNameForTagSuggestion, set2ndLevelNameForTagSuggestion } = this.props;

    if (fieldName === 'key') {
      if (setNameForTagSuggestion) {
        setNameForTagSuggestion(value);
      }
      if (set2ndLevelNameForTagSuggestion) {
        set2ndLevelNameForTagSuggestion(null);
      }
      form = onChangeName(form, value);
    } else if (fieldName === 'secondLevelName') {
      if (set2ndLevelNameForTagSuggestion) {
        set2ndLevelNameForTagSuggestion(value);
      }
      form = onChangeSecondLevelName(form, value);
    } else if (fieldName === 'value') {
      form = onChangeValue(form, value);
    } else if (fieldName === 'operator') {
      form = onChangeOperator(form, value);
    }

    this.setState({ form });
  };
}

function onChangeName(form, value) {
  form = form.updateIn(['nameForm'], subForm => {
    let updatedSubForm = subForm.value.updateIn(['key'], field => field.setValue(value).setTouched(true));
    updatedSubForm = updatedSubForm.updateIn(['secondLevelName'], field => field.setValue('').setTouched(true));

    return subForm.setValue(updatedSubForm).setTouched(true);
  });

  return form.updateIn(['valueForm'], subForm => {
    let updatedSubForm = subForm.value.updateIn(['value'], field => field.setValue('').setTouched(true));

    const node = findSubTreeByFullyQualifiedName(value);
    const operator = node ? get(TAG_TYPES, [node.type, 'operators', 0], null) : null;
    updatedSubForm = updatedSubForm.updateIn(['operator'], field => field.setValue(operator).setTouched(true));

    return subForm.setValue(updatedSubForm).setTouched(true);
  });
}

function onChangeSecondLevelName(form, value) {
  return form.updateIn(['nameForm'], subForm =>
    subForm
      .setValue(subForm.value.updateIn(['secondLevelName'], field => field.setValue(value).setTouched(true)))
      .setTouched(true)
  );
}

function onChangeValue(form, value) {
  return form.updateIn(['valueForm'], subForm =>
    subForm
      .setValue(subForm.value.updateIn(['value'], field => field.setValue(value).setTouched(true)))
      .setTouched(true)
  );
}

function onChangeOperator(form, value) {
  return form.updateIn(['valueForm'], subForm => {
    let updatedSubForm = subForm.value.updateIn(['operator'], field => field.setValue(value).setTouched(true));

    if (value === operators.NOT_EMPTY || value === operators.IS_EMPTY) {
      updatedSubForm = updatedSubForm.updateIn(['value'], field => field.setValue('').setTouched(true));
    }

    return subForm.setValue(updatedSubForm).setTouched(true);
  });
}

export function getInitialForm(props) {
  let { name = '', value = '', secondLevelName = '', operator, validateValue = true } = props;

  return createMapForm()
    .put(
      'nameForm',
      createField({
        value: createMapForm()
          .put(
            'key',
            createField({
              value: name
            })
          )
          .put(
            'secondLevelName',
            createField({
              value: secondLevelName
            })
          ),
        validator: nameFormValidator
      })
    )
    .put(
      'valueForm',
      createField({
        value: createMapForm()
          .put(
            'operator',
            createField({
              value: operator
            })
          )
          .put(
            'value',
            createField({
              value: value
            })
          ),
        validator: validateValue ? valueFormValidator : null
      })
    );
}

function nameValidator(name) {
  if (isBlank(name)) {
    return [
      {
        field: 'key',
        severity: 'error',
        message: 'Please select a key.'
      }
    ];
  }

  const nodeInTree = findSubTreeByFullyQualifiedName(name);
  if (!nodeInTree) {
    return [
      {
        field: 'key',
        severity: 'error',
        message: 'Please select a valid key.'
      }
    ];
  }
}

function nameFormValidator(nameForm) {
  const keyName = nameForm.get('key').value;
  const nameValidationResult = nameValidator(keyName);
  if (nameValidationResult) {
    return nameValidationResult;
  }

  const secondLevelName = nameForm.get('secondLevelName').value;

  const nodeInTree = findSubTreeByFullyQualifiedName(keyName);
  const type = nodeInTree ? nodeInTree.type : null;

  if (type !== TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
    return null;
  }

  // for backwards compatibility reasons, we need to support agent.tag tags with an empty 2nd level key
  if (keyName === 'agent.tag') {
    return null;
  }

  if (isBlank(secondLevelName)) {
    return [
      {
        field: 'secondLevelName',
        severity: 'error',
        message: 'Please define a sub-key.'
      }
    ];
  }

  return null;
}

function valueFormValidator(valueForm) {
  const operator = valueForm.get('operator').value;
  if (operator === operators.NOT_EMPTY || operator === operators.IS_EMPTY) {
    return null;
  }

  const value = String(valueForm.get('value').value);
  if (isBlank(value)) {
    return [
      {
        severity: 'error',
        message: 'The value must not be blank.'
      }
    ];
  }

  return null;
}
