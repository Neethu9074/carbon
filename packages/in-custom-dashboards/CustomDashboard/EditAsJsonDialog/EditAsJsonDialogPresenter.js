import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import Actions from 'in-new-components/Dialog/Actions';
import SaveButton from 'in-components/form/SaveButton';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import Code from 'in-components/form/Code';

export default function EditAsJsonDialogPresenter({ onSubmit, field, setField, readOnly }) {
  let content = (
    <Code
      mode="application/json"
      value={field.value}
      onChange={value => setField(field.setValue(value).setTouched(true))}
      hasError={!field.valid && field.touched}
      readOnly={readOnly}
    />
  );

  if (!readOnly) {
    content = (
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <FormGroup>
          {content}
          <TouchedMessages field={field} />
        </FormGroup>

        <Actions>
          <CancelButton onClick={close} />
          <SaveButton form={field}>Confirm</SaveButton>
        </Actions>
      </form>
    );
  }

  return (
    <Dialog
      titleIconType="lib_views_grid"
      title={readOnly ? 'Dashboard as JSON' : 'Edit Dashboard'}
      onClose={close}
      doNotCloseOnOutsideClick
    >
      {content}
    </Dialog>
  );
}
