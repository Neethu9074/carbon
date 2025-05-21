/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button } from '@instana/components';

import CreateSmartAlertDialog from 'in-alerting/smart-alerts/slo/CreateSmartAlertDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

export interface CreateSmartAlertProps {
  sloId?: string;
}

export default function CreateSmartAlert({ sloId }: CreateSmartAlertProps) {
  return (
    <Button
      kind="primaryv2"
      icon="lib_openclose_add"
      onClick={() => addActiveDialog(<CreateSmartAlertDialog preselectedSloId={sloId} />)}
      size="xl"
    >
      {t('in-alerting:smartAlerts.createSmartAlert')}
    </Button>
  );
}
