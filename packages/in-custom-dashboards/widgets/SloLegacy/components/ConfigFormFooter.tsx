/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { t } from 'in-i18n';

interface ConfigFormFooterProps {
  formId: string;
  onCancel: VoidFunction;
  cloneOnly?: boolean;
  isSaving?: boolean;
  isDisabled?: boolean;
}

export default function ConfigFormFooter({ formId, cloneOnly, isSaving, isDisabled, onCancel }: ConfigFormFooterProps) {
  return (
    <FormFooter withRoundedBottomBorder>
      <CancelButton onClick={onCancel} />
      <SaveButton isSaving={isSaving} disabled={isDisabled} formId={formId}>
        {cloneOnly
          ? t('in-custom-dashboards:widgets.slo.createSliForm.clone')
          : t('in-custom-dashboards:widgets.slo.createSliForm.create')}
      </SaveButton>
    </FormFooter>
  );
}
