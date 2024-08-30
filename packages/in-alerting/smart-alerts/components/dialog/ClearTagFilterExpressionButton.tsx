/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Button } from '@instana/components';

import { handleChangeTagFilterExpressionChange } from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import { t } from 'in-i18n';

interface ClearTagFilterExpressionButtonProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  customFormUpdater?: () => void;
}

export function ClearTagFilterExpressionButton({
  form,
  updateForm,
  customFormUpdater
}: ClearTagFilterExpressionButtonProps) {
  return (
    <Button
      kind="subtle"
      icon="lib_openclose_cancel"
      size="compact"
      onClick={() =>
        typeof customFormUpdater === 'function'
          ? customFormUpdater()
          : handleChangeTagFilterExpressionChange([], form, updateForm)
      }
    >
      {t('in-alerting:smartAlerts.components.smartAlertDialog.clearTagFilterExpressionButton')}
    </Button>
  );
}
