/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import Actions from 'in-new-components/Dialog/Actions';
import SaveButton from 'in-components/form/SaveButton';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from './commonDialog.mless';

export default function PromptPresenter({
  header,
  headerIcon,
  description,
  additionalFields,
  inputLabel,
  confirmButtonLabel = 'Confirm',
  onSubmit,
  field,
  form,
  onChange,
  isSaving,
  errors,
  onClose = close
}) {
  return (
    <Dialog className={locals.dialog} titleIconType={headerIcon} title={header} onClose={onClose}>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <ErroneousResultPresenter errors={errors} addBottomMargin />

        {description && <p className={locals.description}>{description}</p>}

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

        {additionalFields}

        <Actions>
          <CancelButton onClick={close} isSaving={isSaving} />
          <SaveButton form={form || field} isSaving={isSaving}>
            {confirmButtonLabel}
          </SaveButton>
        </Actions>
      </form>
    </Dialog>
  );
}
