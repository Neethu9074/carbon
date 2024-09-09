/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { IconButton } from '@instana/components';

import locals from './InlineEditorRow.mless';

export interface InlineEditorReadonlyExposedProps {
  label: string;
  extra?: string;
  canEdit?: boolean;
}

interface InlineEditorReadonlyProps extends InlineEditorReadonlyExposedProps {
  onEnterEditMode: VoidFunction;
}

export default function InlineEditorReadonly({ label, extra, onEnterEditMode, canEdit }: InlineEditorReadonlyProps) {
  return (
    <>
      <span className={locals.readonlyLabel}>{label}</span>
      {canEdit && (
        <IconButton kind="action" type="lib_actions_edit" className={locals.editIcon} onClick={onEnterEditMode} />
      )}
      {extra && <span className={locals.readonlyExtra}>{extra}</span>}
    </>
  );
}
