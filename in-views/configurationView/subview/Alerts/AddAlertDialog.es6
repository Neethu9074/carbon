import {createMapForm, createField, notBlankValidator} from 'formalistic';
import irpt from 'react-immutable-proptypes';
import {fromJS} from 'immutable';
import React from 'react';

import {addOrUpdateAlert} from 'in-services/groundskeeper/alertings';
import ValidationBlock from 'in-components/form/ValidationBlock';
import {close} from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import {user} from 'in-stores/user';


export default connectTo({
},
React.createClass({

  displayName: 'AddAlertDialog',

  propTypes: {
    alert: irpt.map
  },

  getInitialState() {
    const alert = this.props.alert;
    const form = createMapForm()
      .put('name', createField({
        value: alert ? alert.getIn(['data', 'name']) : '',
        validator: notBlankValidator
      }));

    return {
      form
    };
  },

  render() {
    const {form} = this.state;

    return (
      <Dialog header='Add Alert'
              onClose={close}>
        <form onSubmit={this.onSubmit}>

          {form.get('name').map(field =>
            <FormGroup>
              <Label htmlFor='name'
                     hasError={!field.valid}>
                Name
              </Label>
              <Input id='name'
                     type='text'
                     value={field.value}
                     onChange={e => this.onChange('name', e.target.value)}
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
            Add alert
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

    const alert = this.props.alert;
    addOrUpdateAlert(fromJS({
      id: alert ? alert.get('id') : null,
      data: {
        name: this.state.form.get('name').value,
        enabled: alert ? alert.getIn(['data', 'enabled']) : true,
        misc: `added by: ${user.preferredName}`
      }
    }));
    close();
  }
}));
