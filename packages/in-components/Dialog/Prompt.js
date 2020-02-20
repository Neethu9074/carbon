import { createField, notBlankValidator } from 'formalistic';
import { compose, withProps, withState } from 'recompose';
import React from 'react';

import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default compose(
  withState('field', 'setField', () =>
    createField({
      value: '',
      validator: notBlankValidator
    })
  ),
  withProps(({ field, setField, onSubmit }) => ({
    onSubmit: e => {
      e.preventDefault();

      if (!field.valid) {
        setField(field.setTouched(true));
        return;
      }

      onSubmit(field.value);
    }
  }))
)(Prompt);

function Prompt({ header, description, inputLabel, field, setField, onSubmit, confirmButtonLabel = 'Confirm' }) {
  return (
    <ConfirmationDialog
      header={header}
      description={description}
      bButtonKind="primaryv2"
      onB={onSubmit}
      bButtonLabel={confirmButtonLabel}
    >
      <form onSubmit={onSubmit}>
        <FormGroup>
          <Label htmlFor="prompt-input" hasError={!field.valid && field.touched}>
            {inputLabel}
          </Label>
          <Input
            id="prompt-input"
            type="text"
            value={field.value}
            onChange={e => setField(field.setValue(e.target.value).setTouched(true))}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      </form>
    </ConfirmationDialog>
  );
}
