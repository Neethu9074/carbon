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

export default function NewDashboardDialogPresenter({ onSubmit, field, onChange, isSaving, errors }) {
  return (
    <BigHeaderDialog titleIconType="lib_views_grid" title="Create New Dashboard" onClose={close}>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <ErroneousResultPresenter errors={errors} addBottomMargin />

        <FormGroup>
          <Label htmlFor="new-dashboard-name" hasError={!field.valid && field.touched}>
            Dashboard Name
          </Label>
          <Input
            id="new-dashboard-name"
            type="text"
            value={field.value || ''}
            onChange={e => onChange(e.target.value)}
            hasError={!field.valid && field.touched}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>

        <Actions>
          <CancelButton onClick={close} isSaving={isSaving} />
          <SaveButton form={field} isSaving={isSaving}>
            Create
          </SaveButton>
        </Actions>
      </form>
    </BigHeaderDialog>
  );
}
