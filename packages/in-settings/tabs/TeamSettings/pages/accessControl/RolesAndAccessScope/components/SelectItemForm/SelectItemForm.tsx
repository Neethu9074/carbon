/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Typography } from '@instana/components';

import ConfigDialogFooter from 'in-settings/components/ConfigDialog/ConfigDialogFooter';
import { t } from 'in-i18n';

import locals from './SelectItemForm.mless';

interface SelectItemFormProps {
  children: React.ReactNode;
  subHeader?: string | React.ReactNode;
  onClickCancel: VoidFunction;
  onClickSave: VoidFunction;
}

export default function SelectItemForm({ children, subHeader, onClickCancel, onClickSave }: SelectItemFormProps) {
  return (
    <div className={locals.wrapper}>
      {subHeader && (
        <div className={locals.subHeader}>
          <Typography variant={'body-regular'}>{subHeader}</Typography>
        </div>
      )}
      <div className={locals.content}>{children}</div>
      <ConfigDialogFooter
        saveButtonText={t('in-settings:selectItemForm.doneButton')}
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
      />
    </div>
  );
}
