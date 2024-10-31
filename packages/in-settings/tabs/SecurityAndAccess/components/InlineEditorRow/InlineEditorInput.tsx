/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button } from '@instana/components';

import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './InlineEditorRow.mless';

export interface InlineEditorInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onClickSave: VoidFunction;
  hasError?: boolean;
  onClickCancel?: VoidFunction;
}

export default function InlineEditorInput({
  inputValue,
  onInputChange,
  onClickSave,
  onClickCancel,
  hasError
}: InlineEditorInputProps) {
  return (
    <>
      <Input
        type="text"
        value={inputValue}
        className={locals.inputField}
        onChange={e => onInputChange(e.target.value || '')}
        autoComplete="off"
        hasError={hasError}
      />

      <Button
        kind="action"
        onClick={e => {
          e.preventDefault();
          onClickSave();
        }}
        className={locals.saveButton}
        noAutoMargin
      >
        {t('in-settings:tabs.save')}
      </Button>

      <Button kind="subtle" onClick={onClickCancel} className={locals.cancelButton} noAutoMargin>
        {t('in-settings:tabs.cancel')}
      </Button>
    </>
  );
}
