import {createMapForm, createField, notBlankValidator} from 'formalistic';
import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';
import {close} from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';
import {config} from 'in-services/config';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';


export default connectTo({
}, React.createClass({
  displayName: 'AddAlertDialog',

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      form: createMapForm()
        .put('alertId', createField({
          value: '',
          validator: notBlankValidator
        }))
    };
  },

  render() {
    const {form} = this.state;

    return (
      <Dialog header={`Invite user to ${config.tenant}`}
              onClose={close}>
        <form onSubmit={this.onSubmit}>
          {form.get('alertId').map(field =>
            <FormGroup>
              <Label htmlFor='alert-id'
                     hasError={!field.valid}>
                Alert
              </Label>
              <Input id='alert-id'
                     type='text'
                     value={field.value}
                     onChange={e => this.onChange('alertId', e.target.value)}
                     hasError={!field.valid}
                     autoFocus />
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )}

          <Button kind='success'
                  type='submit'
                  disabled={!form.hierarchyValid && form.touched}>
            Invite User
          </Button>
        </form>
      </Dialog>
    );
  },

  onChange(fieldName, value) {
    const updatedForm = this.state.form.updateIn([fieldName], field =>
      field.setValue(value).setTouched(true)
    );

    this.setState({
      form: updatedForm
    });
  },

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, {recurse: true})
      });
      return;
    }

    this.props.onSubmit(this.state.form.get('alertId').value);
  }
}));
