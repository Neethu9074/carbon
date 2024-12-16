/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';
import { Button, CarbonMenuItem } from '@instana/components';
import { t } from '@instana/i18n-react';

import useHrefToSloAlertConfig from 'in-service-levels/navigation/hooks/useHrefToSloAlertConfig';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { parseUrl } from 'in-stores/navigation/routing/parser';

interface SloAlertConfigButtonProps {
  sloId: string;
  alertConfig: ServiceLevelsAlertConfigWithMetadata;
  as?: 'button' | 'menuItem';
}

export default function SloAlertConfigButton({ sloId, alertConfig, as = 'button' }: SloAlertConfigButtonProps) {
  const alertConfigHref = useHrefToSloAlertConfig({ sloId, config: alertConfig });
  const { navigate } = useNavigation();
  const parsedLocation = parseUrl(alertConfigHref, true);
  if (as === 'menuItem') {
    return <CarbonMenuItem label={t('in-events:buttonViewAlertConfig')} onClick={() => navigate(parsedLocation)} />;
  }
  return (
    <Button kind="secondary" href={alertConfigHref}>
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}
