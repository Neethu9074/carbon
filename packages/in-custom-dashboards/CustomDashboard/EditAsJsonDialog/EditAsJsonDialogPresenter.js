/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import SaveButton from 'in-components/form/SaveButton';
import FormGroup from 'in-components/form/FormGroup';
import Actions from 'in-components/Dialog/Actions';
import Dialog from 'in-components/Dialog/Dialog';
import Code from 'in-components/form/Code';
import { t } from 'in-i18n';

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
          <SaveButton form={field}>
            {t('in-custom-dashboards:customDashboard.editJsonDialog.editJsonDialogPresenter.confirmBt')}
          </SaveButton>
        </Actions>
      </form>
    );
  }

  return (
    <Dialog
      titleIconType="lib_views_grid"
      title={
        readOnly
          ? t('in-custom-dashboards:customDashboard.editJsonDialog.editJsonDialogPresenter.dashboardAJson')
          : t('in-custom-dashboards:customDashboard.editJsonDialog.editJsonDialogPresenter.editDashboard')
      }
      onClose={close}
      doNotCloseOnOutsideClick
    >
      {content}
    </Dialog>
  );
}
