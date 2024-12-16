/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import { useGetAlertConfigLink } from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialog';
import { LogAlertConfigWithMetadata } from 'in-types';
import { t } from 'in-i18n';

interface PropsType {
  alertConfig: LogAlertConfigWithMetadata;
}
export default function LogAlertConfigButton({ alertConfig }: PropsType) {
  const getLinkToAlertConfig = useGetAlertConfigLink();

  return (
    <Button kind="secondary" href={getLinkToAlertConfig(alertConfig.id, alertConfig.created)}>
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}
