import React from 'react';

import EditForm, { getTagEditForm } from 'in-analyze/Filter/Dialogs/EditFilterDialog/EditForm';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Dialog from 'in-components/Dialog';

import locals from './EditDialog.mless';

export default function EditDialog(props) {
  return (
    <Dialog
      onClose={() => {
        close();
        if (props.onCancel) {
          props.onCancel();
        }
      }}
    >
      <EditViewForm {...props} />
    </Dialog>
  );
}

class EditViewForm extends React.Component {
  static displayName = 'EditViewForm';

  constructor(props) {
    super(props);
    this.state = {
      form: getTagEditForm(props.tag.name, props.tag.value, props.restrictKeys)
    };
  }

  render() {
    const { form } = this.state;
    const { onCancel, restrictKeys } = this.props;

    return (
      <form onSubmit={e => this.onSubmit(e, form)} className={locals.form}>
        <div className={locals.dialog}>
          <div className={locals.heading}>
            <h1 className={locals.title}>Filter</h1>
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
          </div>

          <EditForm
            form={form}
            onNameChanged={name => this.onChange('name', name)}
            onValueChanged={value => this.onChange('value', value)}
            restrictKeys={restrictKeys}
          />

          <div className={locals.footer}>
            <Button kind="create" type="submit" disabled={!form.hierarchyValid && form.touched}>
              Save
            </Button>
          </div>
        </div>
      </form>
    );
  }

  onChange = (fieldName, value) => {
    let form = this.state.form.updateIn([fieldName], field => field.setValue(value).setTouched(true));
    if (fieldName === 'name') {
      const node = findSubTreeByFullyQualifiedName(value);
      if (node && node.type) {
        form = form.updateIn(['type'], field => field.setValue(node.type).setTouched(true));
      }
    }

    this.setState({
      form
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
    this.props.onSave(tag);
  }
}
