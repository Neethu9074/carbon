/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, CarbonMenuItem } from '@instana/components';

import { MobileAppSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useGetAlertConfigLink } from 'in-mobile-apps/navigation/paths';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { t } from 'in-i18n';

interface PropsType {
  alertConfig: MobileAppSmartAlertConfigWithMetadata;
  as?: 'button' | 'menuItem';
}
export default function MobileAppAlertConfigButton({ alertConfig, as = 'button' }: PropsType) {
  const getLinkToAlertConfig = useGetAlertConfigLink();
  const { navigate } = useNavigation();

  if (as === 'menuItem') {
    return (
      <CarbonMenuItem
        label={t('in-events:buttonViewAlertConfig')}
        onClick={() => {
          navigate(parseUrl(getLinkToAlertConfig(alertConfig.id, alertConfig.mobileAppId, alertConfig.created), true));
        }}
      />
    );
  }

  return (
    <Button kind="secondary" href={getLinkToAlertConfig(alertConfig.id, alertConfig.mobileAppId, alertConfig.created)}>
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}
