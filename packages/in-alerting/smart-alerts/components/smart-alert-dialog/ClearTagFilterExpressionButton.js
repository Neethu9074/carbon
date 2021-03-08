/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React from 'react';

import { handleChangeTagFilterExpressionChange } from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertFilterConfigurator';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

export function ClearTagFilterExpressionButton({ form, updateForm, customFormUpdater }) {
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
      {t('in-new-components:alerting.components.clearTagFilterExpressionButton')}
    </Button>
  );
}
