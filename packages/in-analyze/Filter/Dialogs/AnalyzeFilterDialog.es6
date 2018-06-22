import React from 'react';

import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Dialog from 'in-components/Dialog';

import locals from './AnalyzeFilterDialog.mless';

export default function AnalyzeFilterDialog(props) {
  return (
    <Dialog
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
      form: props.getInitialForm()
    };
  }

  render() {
    const { onCancel, renderForm } = this.props;
    const { form } = this.state;

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

          {renderForm({
            form,
            onValueChanged: value => this.onChange('value', value),
            onNameChanged: name => this.onChange('name', name)
          })}

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
    let form = this.state.form;
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
    this.props.onSave(tag);
  }
}
