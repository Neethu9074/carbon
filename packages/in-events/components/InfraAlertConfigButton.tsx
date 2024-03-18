/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/legacy';

import { useGetAlertConfigLink } from 'in-infrastructure/navigation/paths';
import { InfraAlertConfigWithMetadata } from 'in-types';
import { t } from 'in-i18n';

interface PropsType {
  alertConfig: InfraAlertConfigWithMetadata;
}
export default function InfraAlertConfigButton({ alertConfig }: PropsType) {
  const getLinkToAlertConfig = useGetAlertConfigLink();

  return (
    <Button kind="secondary" href={getLinkToAlertConfig(alertConfig.id, alertConfig.created)}>
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}
