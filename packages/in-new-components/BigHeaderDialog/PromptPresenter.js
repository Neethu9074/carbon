import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import BigHeaderDialog from 'in-new-components/BigHeaderDialog/BigHeaderDialog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Actions from 'in-new-components/BigHeaderDialog/Actions';
import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import SaveButton from 'in-components/form/SaveButton';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function PromptPresenter({
  header,
  headerIcon,
  inputLabel,
  confirmButtonLabel = 'Confirm',
  onSubmit,
  field,
  onChange,
  isSaving,
  errors,
  onClose = close
}) {
  return (
    <BigHeaderDialog titleIconType={headerIcon} title={header} onClose={onClose}>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <ErroneousResultPresenter errors={errors} addBottomMargin />

        <FormGroup>
          <Label htmlFor="prompt-input" hasError={!field.valid && field.touched}>
            {inputLabel}
          </Label>
          <Input
            id="prompt-input"
            type="text"
            value={field.value || ''}
            onChange={e => onChange(e.target.value)}
            hasError={!field.valid && field.touched}
            disabled={isSaving}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>

        <Actions>
          <CancelButton onClick={close} isSaving={isSaving} />
          <SaveButton form={field} isSaving={isSaving}>
            {confirmButtonLabel}
          </SaveButton>
        </Actions>
      </form>
    </BigHeaderDialog>
  );
}
