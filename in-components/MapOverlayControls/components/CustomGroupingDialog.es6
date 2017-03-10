import {createMapForm, createField, notBlankValidator} from 'formalistic';
import React from 'react';

import {setCurrentViewwWithViewGrouping} from 'in-stores/navigation/view';
import ValidationBlock from 'in-components/form/ValidationBlock';
import {close} from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';

import './CustomGroupingDialog.less';


const block = 'in-search-custom-grouping-dialog';

export default connectTo({
},
React.createClass({

  displayName: 'CustomGroupingDialog',

  getInitialState() {
    return {
      form: createMapForm()
        .put('path', createField({
          value: '',
          validator: notBlankValidator
        }))
    };
  },

  render() {
    const form = this.state.form;

    return (
      <Dialog header='Custom Grouping'
              onClose={close}>
        <form onSubmit={this.onSubmit}>
          {form.get('path').map(field =>
            <FormGroup>
              <Label htmlFor='grouping-path'>
                Group by
              </Label>
              <Input type='text'
                     id='grouping-path'
                     value={field.value}
                     onChange={e => this.onChange('path', e.target.value)}
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

          <div className={`${block}__actions`}>
            <Button disabled={!form.valid}
                    type='submit'>
              Apply grouping
            </Button>
          </div>
        </form>
      </Dialog>
    );
  },

  onChange(fieldName, value) {
    this.setState({
      form: this.state.form.updateIn([fieldName], field =>
        field.setValue(value).setTouched(true)
      )
    });
  },

  onSubmit(e) {
    e.preventDefault();

    if (this.state.form.hierarchyValid) {
      setCurrentViewwWithViewGrouping(`custom-${this.state.form.get('path').value}`);
      close();
    }
  }
}));
