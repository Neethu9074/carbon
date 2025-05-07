/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, CarbonMenuItem } from '@instana/components';

import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { useGetAlertConfigLink } from 'in-infrastructure/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { t } from 'in-i18n';

interface PropsType {
  alertConfig: InfraSmartAlertConfigWithMetadata;
  as?: 'button' | 'menuItem';
}
export default function InfraAlertConfigButton({ alertConfig, as = 'button' }: PropsType) {
  const getLinkToAlertConfig = useGetAlertConfigLink();
  const { navigate } = useNavigation();

  if (as === 'menuItem') {
    return (
      <CarbonMenuItem
        label={t('in-events:buttonViewAlertConfig')}
        onClick={() => {
          navigate(parseUrl(getLinkToAlertConfig(alertConfig.id), true));
        }}
      />
    );
  }

  return (
    <Button kind="secondary" href={getLinkToAlertConfig(alertConfig.id, alertConfig.created)}>
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}
