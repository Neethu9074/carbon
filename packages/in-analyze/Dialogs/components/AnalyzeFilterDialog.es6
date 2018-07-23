import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { close } from 'in-components/DialogPresenter/store';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Dialog from 'in-components/Dialog';

import locals from './AnalyzeFilterDialog.mless';

export default function AnalyzeFilterDialog(props) {
  const { onCancel, title = 'Filter' } = props;

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
            onClick={() => {
              close();
              if (onCancel) {
                onCancel();
              }
            }}
          />
        </Fragment>
      }
      onClose={() => {
        close();
        if (props.onCancel) {
          props.onCancel();
        }
      }}
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
      form: getInitialForm(props),
      selectedCategory: null
    };
  }

  render() {
    const { renderForm, onRemove, removePostPhrase } = this.props;
    const { form } = this.state;

    return (
      <form onSubmit={e => this.onSubmit(e, form)} className={locals.form}>
        <div className={locals.dialog}>
          <div className={locals.content}>
            {renderForm({
              form,
              onChange: this.onChange,
              selectedCategory: this.state.selectedCategory,
              setSelectedCategory: this.setSelectedCategory
            })}
          </div>

          <div className={locals.footer}>
            <Button kind="create" type="submit" disabled={!form.hierarchyValid && form.touched}>
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
                Delete {removePostPhrase && ` ${removePostPhrase}`}
              </Button>
            )}
          </div>
        </div>
      </form>
    );
  }

  onChange = (fieldName, value) => {
    let form = this.state.form;

    function changeFormValue(_form, _fieldName, _value) {
      return _form.updateIn([_fieldName], field => field.setValue(_value).setTouched(true));
    }

    if (fieldName === 'name') {
      const node = findSubTreeByFullyQualifiedName(value);

      form = form.updateIn(['nameForm'], subForm => {
        let updatedSubForm = changeFormValue(subForm.value, 'name', value);
        updatedSubForm = changeFormValue(updatedSubForm, 'customName', '');
        if (node && node.type) {
          updatedSubForm = changeFormValue(updatedSubForm, 'type', node.type);
        }
        return subForm.setValue(updatedSubForm).setTouched(true);
      });

      const operator = node ? get(TAG_TYPES, [node.type, 'operators', 0], null) : null;
      form = changeFormValue(form, 'operator', operator);

      if (this.props.withValue !== false) {
        form = changeFormValue(form, 'value', '');
      }
    } else if (fieldName === 'customName') {
      form = form.updateIn(['nameForm'], subForm =>
        subForm.setValue(changeFormValue(subForm.value, 'customName', value)).setTouched(true)
      );
    } else {
      form = form.updateIn([fieldName], field => field.setValue(value).setTouched(true));
    }

    this.setState({ form });
  };

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
    const nameForm = tag.nameForm ? tag.nameForm.toJS() : {};
    tag.name = nameForm.name;

    if (nameForm.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
      if (nameForm.customName) {
        if (tag.value) {
          tag.value = `${nameForm.customName}=${tag.value}`;
        } else {
          tag.value = nameForm.customName;
        }
      }
    }
    this.props.onSave(tag);
  }

  setSelectedCategory = newCategory => {
    this.setState({
      form: getInitialForm({}),
      selectedCategory: newCategory
    });
  };
}

function getInitialForm(props) {
  let { name = '', value = '', customName = '', operator, withValue = true } = props;

  const nodeInTree = findSubTreeByFullyQualifiedName(name);
  const type = nodeInTree ? nodeInTree.type : TAG_TYPES.STRING.technicalName;

  if (type === TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
    const parts = value.split('=');
    customName = parts[0];

    if (parts.length > 1) {
      value = value.slice(customName.length + 1); // also remove the =
    }
  }

  let form = createMapForm()
    .put(
      'nameForm',
      createField({
        value: createMapForm()
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
          ),
        validator: nameFormValidator
      })
    )
    .put(
      'operator',
      createField({
        value: operator
      })
    );

  if (withValue) {
    form = form.put(
      'value',
      createField({
        value: value,
        validator: notBlankValidator
      })
    );
  }

  return form;
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

function nameFormValidator(nameForm) {
  const type = nameForm.get('type').value;
  if (type !== TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
    return null;
  }

  const customName = nameForm.get('customName').value;
  const keyName = nameForm.get('name').value;

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
