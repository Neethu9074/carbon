import React from 'react';

import BigHeaderDialog from 'in-new-components/BigHeaderDialog/BigHeaderDialog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Actions from 'in-new-components/BigHeaderDialog/Actions';
import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import FormGroup from 'in-components/form/FormGroup';
import Code from 'in-components/form/Code';

import SaveButton from 'in-components/form/SaveButton';

export default function EditAsJsonDialogPresenter({ onSubmit, field, setField }) {
  return (
    <BigHeaderDialog titleIconType="lib_views_grid" title="Edit Dashboard" onClose={close} doNotCloseOnOutsideClick>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <FormGroup>
          <Code
            mode="application/json"
            value={field.value}
            onChange={value => setField(field.setValue(value).setTouched(true))}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
        </FormGroup>

        <Actions>
          <CancelButton onClick={close} />
          <SaveButton form={field}>Confirm</SaveButton>
        </Actions>
      </form>
    </BigHeaderDialog>
  );
}
