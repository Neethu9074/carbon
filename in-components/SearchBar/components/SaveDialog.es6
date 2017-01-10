import React from 'react';

import {form$, setValue, save} from 'in-components/SearchBar/stores/dialog';
import ValidationBlock from 'in-components/form/ValidationBlock';
import {close} from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';

import './SaveDialog.less';

// const block = 'in-search-save-dialog';

export default connectTo({
  form: form$
}, function SaveDialog({form}) {
  const nameField = form.getItem('name');
  const definitionField = form.getItem('definition');

  return (
    <Dialog header='Save filter'
            onClose={close}>
      <Button disabled={!form.valid}
              onClick={save}>
        Save filter
      </Button>

      <FormGroup>
        <Label htmlFor='filter-name'>
          Name
        </Label>
        <Input type='text'
               id='filter-name'
               value={nameField.value}
               onChange={e => setValue('name', e.target.value)}
               hasError={!nameField.valid} />
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
    </Dialog>
  );
});
