/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import SaveButton from 'in-components/form/SaveButton';
import { t } from 'in-i18n';

import locals from './ActionBar.mless';

interface ActionBarProps {
  isSaving: boolean;
  disabled: boolean;
}

/**
 * Provides an action-bar providing a cancel and submit button
 * @param {isSaving: boolean, disabled: boolean} param0 props for component
 * @returns new Component instance
 */
export default function ActionBar({ isSaving, disabled }: ActionBarProps) {
  return (
    <div className={locals.actionsWrapper}>
      <CancelButton className={locals.button} onClick={close} isSaving={isSaving}>
        {t('in-settings:tabs.cancel')}
      </CancelButton>
      <SaveButton isSaving={isSaving} className={locals.button} disabled={disabled} kind="primary">
        {t('in-settings:termsDialog.save')}
      </SaveButton>
    </div>
  );
}
