import React, { Fragment } from 'react';

import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { close } from 'in-components/DialogPresenter/store';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
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
      form: props.getInitialForm(),
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
              onValueChanged: value => this.onChange('value', value),
              onNameChanged: name => this.onChange('name', name),
              onCustomNameChanged: name => this.onChange('customName', name),
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
    if (fieldName === 'customName') {
      this.setState({
        form: form.updateIn(['customNameSubform'], subForm => {
          const updatedSubForm = subForm.value.updateIn(['customName'], field =>
            field.setValue(value).setTouched(true)
          );
          return subForm.setValue(updatedSubForm).setTouched(true);
        })
      });
      return;
    }

    if (fieldName === 'name') {
      const node = findSubTreeByFullyQualifiedName(value);
      if (node && node.type) {
        form = form.updateIn(['customNameSubform'], subForm => {
          const updatedSubForm = subForm.value.updateIn(['type'], field => field.setValue(node.type).setTouched(true));
          return subForm.setValue(updatedSubForm).setTouched(true);
        });
      }
    }

    if (this.props.onChange) {
      form = this.props.onChange(form, fieldName, value);
    }

    this.setState({
      form: form.updateIn([fieldName], field => field.setValue(value).setTouched(true))
    });
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
    const customNameSubform = tag.customNameSubform ? tag.customNameSubform.toJS() : {};
    if (customNameSubform.type === TAG_TYPES.KEY_VALUE_PAIR) {
      if (customNameSubform.customName) {
        if (tag.value) {
          tag.value = `${customNameSubform.customName}=${tag.value}`;
        } else {
          tag.value = customNameSubform.customName;
        }
      }
    }
    this.props.onSave(tag);
  }

  setSelectedCategory = newCategory => {
    this.setState({
      form: this.props.getClearForm(),
      selectedCategory: newCategory
    });
  };
}
