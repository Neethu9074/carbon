import React from 'react';

import {form$, setValue, save, error$} from 'in-components/SearchBar/stores/dialog';
import ValidationBlock from 'in-components/form/ValidationBlock';
import {close} from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';

import './SaveDialog.less';

const block = 'in-search-save-dialog';

export default connectTo({
  form: form$,
  error: error$
}, function SaveDialog({form, error}) {
  const nameField = form.getItem('name');
  const definitionField = form.getItem('definition');

  return (
    <Dialog header='Save filter'
            onClose={close}>
      <form onSubmit={onSubmit}>
        <FormGroup>
          <Label htmlFor='filter-name'>
            Name
          </Label>
          <Input type='text'
                 id='filter-name'
                 value={nameField.value}
                 onChange={e => setValue('name', e.target.value)}
                 hasError={!nameField.valid}
                 autoFocus />
          {nameField.error ?
            <ValidationBlock hasError>
              {nameField.error}
            </ValidationBlock>
          : null}
        </FormGroup>

        <FormGroup>
          <Label htmlFor='filter-definition'>
            Definition
          </Label>
          <Input type='text'
                 id='filter-definition'
                 value={definitionField.value}
                 onChange={e => setValue('definition', e.target.value)}
                 hasError={!definitionField.valid} />
          {definitionField.error ?
            <ValidationBlock hasError>
              {definitionField.error}
            </ValidationBlock>
          : null}
        </FormGroup>

        <div className={`${block}__actions`}>
          <Button disabled={!form.valid}
                  type='submit'>
            Save filter
          </Button>
          {error ?
            <div className={`${block}__error`}>
              {error}
            </div>
          : null}
        </div>
      </form>
    </Dialog>
  );

  function onSubmit(e) {
    e.preventDefault();

    if (form.valid) {
      save();
    }
  }
});
