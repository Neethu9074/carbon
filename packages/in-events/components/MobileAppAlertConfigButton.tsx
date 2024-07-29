/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { useGetAlertConfigLink } from 'in-mobile-apps/navigation/paths';
import { MobileAppAlertConfigWithMetadata } from 'in-types';
import { t } from 'in-i18n';

interface PropsType {
  alertConfig: MobileAppAlertConfigWithMetadata;
}
export default function MobileAppAlertConfigButton({ alertConfig }: PropsType) {
  const getLinkToAlertConfig = useGetAlertConfigLink();

  return (
    <Button kind="secondary" href={getLinkToAlertConfig(alertConfig.id, alertConfig.mobileAppId, alertConfig.created)}>
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}
