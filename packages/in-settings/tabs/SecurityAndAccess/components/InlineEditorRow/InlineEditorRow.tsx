/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode, useState } from 'react';

import InlineEditorReadonly, {
  InlineEditorReadonlyExposedProps
} from 'in-settings/tabs/SecurityAndAccess/components/InlineEditorRow/InlineEditorReadonly';
import InlineEditorInput, {
  InlineEditorInputProps
} from 'in-settings/tabs/SecurityAndAccess/components/InlineEditorRow/InlineEditorInput';
import { DeleteKind } from 'in-settings/components/ApiList/sharedComponents/Delete';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { Col, Row } from 'in-components/layout/Grid/Grid';

import locals from './InlineEditorRow.mless';

interface InlineEditorRowProps extends InlineEditorInputProps, InlineEditorReadonlyExposedProps {
  avatar: ReactNode;
  canEdit?: boolean;
  canDelete?: boolean;
  onClickDelete?: VoidFunction;
  deleteLabel?: string;
  skipDeleteDialog?: boolean;
  isDeleting?: boolean;
}

export default function InlineEditorRow({
  avatar,
  label,
  extra,
  inputValue,
  onInputChange,
  onClickSave,
  onClickCancel,
  onClickDelete,
  hasError,
  canEdit,
  canDelete,
  deleteLabel,
  skipDeleteDialog = false,
  isDeleting = false
}: InlineEditorRowProps) {
  const [isEditMode, setEditMode] = useState(false);

  return (
    <Row>
      <Col lg>
        <div className={locals.column}>
          {avatar}
          {isEditMode ? (
            <div className={locals.inputEditSection}>
              <InlineEditorInput
                inputValue={inputValue}
                onInputChange={onInputChange}
                onClickSave={onClickSave}
                onClickCancel={() => {
                  onClickCancel?.();
                  setEditMode(false);
                }}
                hasError={hasError}
              />
            </div>
          ) : (
            <InlineEditorReadonly
              label={label}
              extra={extra}
              onEnterEditMode={() => setEditMode(true)}
              canEdit={canEdit}
            />
          )}
        </div>
      </Col>
      {canDelete && onClickDelete ? (
        <Col xs--auto className={locals.deleteButton}>
          <Delete
            kind={DeleteKind.Button}
            itemName={label}
            dialogMessage=""
            confirmLabel=""
            doDelete={() => onClickDelete()}
            label={deleteLabel}
            isDeleting={isDeleting}
            skipDialog={skipDeleteDialog}
          />
        </Col>
      ) : null}
    </Row>
  );
}
