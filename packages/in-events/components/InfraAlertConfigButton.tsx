/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { useGetAlertConfigLink } from 'in-infrastructure/navigation/paths';
import { t } from 'in-i18n';

interface PropsType {
  alertConfig: InfraSmartAlertConfigWithMetadata;
}
export default function InfraAlertConfigButton({ alertConfig }: PropsType) {
  const getLinkToAlertConfig = useGetAlertConfigLink();

  return (
    <Button kind="secondary" href={getLinkToAlertConfig(alertConfig.id, alertConfig.created)}>
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}
