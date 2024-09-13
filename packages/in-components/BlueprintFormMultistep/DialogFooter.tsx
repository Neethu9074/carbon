/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef } from 'react';
import { Item } from 'formalistic';

import { Button } from '@instana/components';

import FormFooter from 'in-components/form/FormFooter/FormFooter';
import SaveButton from 'in-components/form/SaveButton';

import locals from './DialogFooter.mless';

interface DialogFooterProps {
  form?: Item;
  /**
   * to enable browser default form submitting even
   * when footer is not part of this form
   */
  formId?: string;
  onSecondaryActionClick?: () => void;
  primaryActionDisabled?: boolean;
  saving?: boolean;
  secondaryActionText: string | React.ReactElement;
  onPrimaryActionClick?: () => void;
  primaryActionText?: string | React.ReactElement;
  renderCustomSaveAction?: () => React.ReactElement;
}

export default forwardRef<HTMLElement, DialogFooterProps>(function DialogFooter(
  {
    form,
    formId,
    primaryActionText,
    primaryActionDisabled,
    secondaryActionText,
    onSecondaryActionClick,
    saving,
    renderCustomSaveAction,
    onPrimaryActionClick
  },
  ref
) {
  return (
    <FormFooter ref={ref} className={locals.controls}>
      <Button kind="secondary" onClick={onSecondaryActionClick}>
        {secondaryActionText}
      </Button>
      {renderCustomSaveAction?.() ?? (
        <SaveButton
          type="submit"
          kind="primary"
          form={form}
          formId={formId}
          disabled={primaryActionDisabled}
          isSaving={saving}
          onClick={onPrimaryActionClick}
        >
          {primaryActionText ?? ''}
        </SaveButton>
      )}
    </FormFooter>
  );
});
