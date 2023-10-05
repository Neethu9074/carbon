/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement, ReactNode } from 'react';

import { close } from 'in-components/DialogPresenter/store';
import Actions from 'in-components/Dialog/Actions';
import Dialog from 'in-components/Dialog/Dialog';

import locals from './commonDialog.mless';

export interface BaseDialogProps {
  title: string | ReactElement;
  headerIcon?: string;
  onClose?: () => void;
  customButtons: ReactNode;
  children?: ReactNode;
}
export default function BaseDialog({ title, onClose = close, customButtons, headerIcon, children }: BaseDialogProps) {
  return (
    <Dialog className={locals.dialog} titleIconType={headerIcon} title={title} onClose={onClose}>
      {children}
      <Actions>{customButtons}</Actions>
    </Dialog>
  );
}
