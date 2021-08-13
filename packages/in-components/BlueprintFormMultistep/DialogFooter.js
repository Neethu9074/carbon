/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@instana/components';

import FormFooter from 'in-components/form/FormFooter/FormFooter';
import SaveButton from 'in-components/form/SaveButton';

import locals from './DialogFooter.mless';

export default forwardRef(DialogFooter);

function DialogFooter(
  {
    form,
    primaryActionText,
    primaryActionDisabled,
    secondaryActionText,
    onSecondaryActionClick,
    saving,
    additionalContent,
    renderCustomSaveAction
  },
  ref
) {
  return (
    <FormFooter ref={ref} className={locals.controls}>
      {additionalContent && <div className={locals.additionalRow}>{additionalContent}</div>}
      <div className={locals.buttonRow}>
        <Button kind="secondary" onClick={onSecondaryActionClick}>
          {secondaryActionText}
        </Button>
        {renderCustomSaveAction?.() ?? (
          <SaveButton type="submit" kind="primary" form={form} disabled={primaryActionDisabled} isSaving={saving}>
            {primaryActionText}
          </SaveButton>
        )}
      </div>
    </FormFooter>
  );
}

DialogFooter.propTypes = {
  form: PropTypes.object.isRequired,
  onSecondaryActionClick: PropTypes.func,
  primaryActionDisabled: PropTypes.bool,
  primaryActionText: PropTypes.node.isRequired,
  renderCustomSaveAction: PropTypes.func,
  additionalContent: PropTypes.node,
  saving: PropTypes.bool,
  secondaryActionText: PropTypes.node.isRequired
};
