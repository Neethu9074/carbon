/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode, useState } from 'react';

import InlineEditorReadonly, {
  InlineEditorReadonlyExposedProps
} from 'in-settings/tabs/TeamSettings/components/InlineEditorRow/InlineEditorReadonly';
import InlineEditorInput, {
  InlineEditorInputProps
} from 'in-settings/tabs/TeamSettings/components/InlineEditorRow/InlineEditorInput';
import { Col, Row } from 'in-components/layout/Grid/Grid';

import locals from './InlineEditorRow.mless';

interface InlineEditorRowProps extends InlineEditorInputProps, InlineEditorReadonlyExposedProps {
  avatar: ReactNode;
  canEdit?: boolean;
}

export default function InlineEditorRow({
  avatar,
  label,
  extra,
  inputValue,
  onInputChange,
  onClickSave,
  onClickCancel,
  hasError,
  canEdit
}: InlineEditorRowProps) {
  const [isEditMode, setEditMode] = useState(false);

  return (
    <Row>
      <Col lg>
        <div className={locals.column}>
          {avatar}

          {isEditMode ? (
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
    </Row>
  );
}
